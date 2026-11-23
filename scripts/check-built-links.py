"""Check local href/src destinations in an Astro build, including a Pages base path."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

root = Path(__file__).resolve().parents[1] / 'dist'

class Canonical(HTMLParser):
    url = None
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.url = attrs['href']

canonical = Canonical()
canonical.feed((root / 'index.html').read_text())
assert canonical.url, 'Missing home canonical'
site = urlsplit(canonical.url)
base = site.path.rstrip('/')
missing = set()
checked = 0

class Links(HTMLParser):
    def handle_starttag(self, tag, attrs):
        global checked
        attrs = dict(attrs)
        # Astro routes a missing URL through 404.html; /404/ is not a real page.
        if page.name == '404.html' and attrs.get('rel') == 'canonical':
            return
        for key in ('href', 'src'):
            value = attrs.get(key)
            if not value or value.startswith('#'):
                continue
            url = urlsplit(urljoin(page_url, value))
            if url.scheme not in ('http', 'https') or url.netloc != site.netloc:
                continue
            path = unquote(url.path)
            if base and not (path == base or path.startswith(base + '/')):
                missing.add(f'Missing base prefix: {path}')
                continue
            target = root / path[len(base):].lstrip('/')
            if target.is_dir():
                target /= 'index.html'
            if not target.exists():
                missing.add(f'{page.relative_to(root)}: {path}')
            checked += 1

for page in root.rglob('*.html'):
    relative = page.relative_to(root).as_posix().removesuffix('index.html')
    page_url = urljoin(canonical.url, relative)
    Links().feed(page.read_text())
if missing:
    raise SystemExit('\n'.join(sorted(missing)))
print(f'{checked} local references checked; no missing paths. Base: {base or "/"}')
