// Internal links go through href() so the site also works when it is
// served from a sub-folder (https://user.github.io/repo/).

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function href(path: string): string {
	if (/^(https?:|mailto:|#)/.test(path)) return path;
	return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

// True when `path` is the current page or one of its parents.
export function isCurrent(pathname: string, path: string): boolean {
	const here = pathname.replace(base, '').replace(/\/$/, '') || '/';
	const target = path.replace(/\/$/, '') || '/';
	return target === '/' ? here === '/' : here === target || here.startsWith(`${target}/`);
}
