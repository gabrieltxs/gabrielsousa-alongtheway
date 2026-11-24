// Use PLAYWRIGHT_MODULE and SITE_TEST_URL as in writing.browser.mjs.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const base = process.env.SITE_TEST_URL || 'http://127.0.0.1:4321';
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
  assert.equal(await page.locator('.icon-links a').count(), 4);
  assert.equal(await page.locator('.card-statement-2 a').innerText(), 'Here I write about what I’ve learned along the way.');
  assert.equal(await page.locator('.scroll-tools').count(), 0);
  for (const theme of ['dark', 'light']) {
    await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
    for (const width of [320, 390, 832, 900, 1024, 1440, 2544]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => document.fonts.ready);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${theme} ${width}`);
      assert(await page.locator('.card-photo').evaluate(el => {
        const box = el.getBoundingClientRect();
        return Math.abs(box.x + box.width / 2 - innerWidth / 2) < 1;
      }));
      assert(await page.locator('.card-about').evaluate(el => !!(el.compareDocumentPosition(document.querySelector('.card-updates')) & Node.DOCUMENT_POSITION_FOLLOWING)));
      if ([390, 1440].includes(width)) await page.screenshot({ path: `/tmp/redesign-home-${theme}-${width}.png`, fullPage: true });
    }
  }
  await page.locator('[data-theme-toggle]').click();
  const savedTheme = await page.locator('html').getAttribute('data-theme');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), savedTheme);
  await page.locator('.card-statement-2 a').click();
  await page.waitForURL('**/writing/');
  const posts = await page.locator('.archive .entry-title a').evaluateAll(links => links.map(link => link.href));
  assert.equal(posts.length, 7);
  for (const url of posts) {
    await page.goto(url);
    assert(await page.locator('.post-plain').isVisible());
    assert(await page.locator('.post-head time').first().isVisible());
    assert(await page.locator('.post a[href]').evaluateAll(links => links.every(link =>
      !['http:', 'https:'].includes(link.protocol) || (link.target === '_blank' && link.relList.contains('noopener')))), url);
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), url);
    }
  }
  assert.deepEqual(errors, []);
  console.log('Redesign home, theme persistence, responsive layout and all seven post summaries/links passed.');
} finally { await browser.close(); }
