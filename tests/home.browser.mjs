// Use PLAYWRIGHT_MODULE and SITE_TEST_URL as in writing.browser.mjs.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const base = process.env.SITE_TEST_URL || 'http://127.0.0.1:4321';
try {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  // Exercise new tabs without visiting third-party services.
  await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin
    ? route.continue() : route.fulfill({ body: 'External destination' }));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  for (const theme of ['dark', 'light']) {
    await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
    for (const width of [320, 390, 832, 900, 1024, 1440, 2544]) {
      await page.setViewportSize({ width, height: 900 });
      const layout = await page.evaluate(() => {
        const box = selector => document.querySelector(selector).getBoundingClientRect();
        const home = box('.home');
        const photo = box('.portrait');
        const intro = box('.hero > div:last-child');
        const logo = box('.site-name');
        const nav = box('.site-nav');
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          centered: Math.abs(home.x + home.width / 2 - innerWidth / 2) < 1,
          photoAbove: photo.bottom < intro.top,
          photoCentered: Math.abs(photo.x + photo.width / 2 - innerWidth / 2) < 1,
          aboutFirst: !!(document.querySelector('[aria-labelledby="section-about"]').compareDocumentPosition(document.querySelector('.home-updates')) & Node.DOCUMENT_POSITION_FOLLOWING),
          dockVisible: Math.abs(box('.home-updates').bottom - innerHeight) < 1 && box('.home-updates').top >= 0,
          textCentered: ['.hero', '[aria-labelledby="section-about"]'].every(selector => getComputedStyle(document.querySelector(selector)).textAlign === 'center'),
          headerClear: logo.right <= nav.left || logo.bottom <= nav.top,
        };
      });
      assert.deepEqual(layout, { overflow: false, centered: true, photoAbove: true, photoCentered: true, aboutFirst: true, dockVisible: true, textCentered: true, headerClear: true }, `${theme} ${width}`);
      if ([390, 1440, 2544].includes(width)) await page.screenshot({ path: `/tmp/home-${theme}-${width}.png`, fullPage: true });
      assert.equal(await page.getByRole('button', { name: 'Go to top' }).isVisible(), false);
      await page.evaluate(() => window.scrollTo(0, 500));
      assert.equal(await page.locator('.scroll-tools, .go-to-top').count(), 0);
      assert(await page.locator('.home-updates').evaluate(el => Math.abs(el.getBoundingClientRect().bottom - innerHeight) < 1));
      await page.evaluate(() => window.scrollTo(0, 0));
    }
  }
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  assert(await page.locator('body > footer').evaluate(el => el.getBoundingClientRect().bottom <= document.querySelector('.home-updates').getBoundingClientRect().top + 1));
  await page.evaluate(() => scrollTo(0, 0));
  for (const label of ['LinkedIn', 'Lattes']) {
    const before = page.url();
    const popup = page.waitForEvent('popup');
    await page.locator('.hero-links').getByRole('link', { name: label, exact: true }).click();
    await (await popup).close();
    assert.equal(page.url(), before, label);
  }
  await page.goto(`${base}/writing/`);
  const posts = await page.locator('.archive .entry-title a').evaluateAll(links => links.map(link => link.href));
  assert(posts.length > 0);
  for (const url of posts) {
    await page.goto(url);
    assert(await page.locator('.post a[href]').evaluateAll(links => links.every(link =>
      !['http:', 'https:'].includes(link.protocol) || (link.target === '_blank' && link.relList.contains('noopener')))), url);
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.getByRole('button', { name: 'Go to top' }).click();
  await page.waitForFunction(() => window.scrollY === 0 && document.querySelector('.go-to-top').hidden);
  assert.deepEqual(errors, []);
  console.log(`Home layout, fixed banners and absence of scroll tools checked at seven widths in both themes; post smooth scrolling passed; links checked in ${posts.length} posts.`);
} finally {
  await browser.close();
}
