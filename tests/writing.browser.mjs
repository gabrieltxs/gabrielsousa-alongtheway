// Run with PLAYWRIGHT_MODULE pointing to an installed playwright/index.mjs.
// SITE_TEST_URL defaults to the existing local server; no site dependency needed.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const base = process.env.SITE_TEST_URL || 'http://127.0.0.1:4321';
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${base}/writing/`);
  const visible = page.locator('.archive .entry:visible');
  assert.equal(await visible.count(), 7);
  const filters = await page.locator('.keyword-filters [data-keyword]').evaluateAll(links => links.map(link => ({
    keyword: link.dataset.keyword, count: Number(link.querySelector('.tag-count').textContent),
  })));
  for (const { keyword, count } of filters) {
    await page.locator(`.keyword-filters [data-keyword="${keyword}"]`).click();
    assert.equal(await visible.count(), count, keyword);
    assert.equal(await page.locator('.keyword-filters [aria-current="true"]').getAttribute('data-keyword'), keyword);
    assert.match(await page.locator('#filter-status').textContent(), new RegExp(`Showing (all )?${count} post`));
    if (keyword) assert(await visible.evaluateAll((entries, key) => entries.every(entry => entry.dataset.keywords.split(' ').includes(key)), keyword));
  }
  await page.locator('.keyword-filters [data-keyword=""]').click();
  await page.locator('.archive [data-keyword="legal-ai"]').first().click();
  assert.equal(await visible.count(), 4);
  await page.reload();
  assert.equal(await visible.count(), 4);
  await page.goBack();
  assert.equal(await visible.count(), 7);
  await page.goForward();
  assert.equal(await visible.count(), 4);
  await page.goto(`${base}/writing/?keyword=does-not-exist`);
  assert.equal(await visible.count(), 7);
  for (const theme of ['dark', 'light']) {
    await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${theme} ${width} overflow`);
      assert(await visible.first().evaluate(entry => getComputedStyle(entry).borderLeftWidth === '3px'));
      await page.screenshot({ path: `/tmp/writing-${theme}-${width}.png`, fullPage: true });
    }
  }
  for (const slug of ['hello-world', 'post-template', 'legal-text-generation', 'goiania-is-three-tokens']) {
    assert.equal((await page.request.get(`${base}/writing/${slug}/`)).status(), 404, slug);
    for (const path of ['/', '/rss.xml', '/sitemap-0.xml', '/research/']) {
      assert(!(await (await page.request.get(`${base}${path}`)).text()).includes(`/writing/${slug}/`), `${path}: ${slug}`);
    }
  }
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const fallback = await noJs.newPage();
  await fallback.goto(`${base}/writing/`);
  await fallback.locator('.keyword-filters [data-keyword="legal-ai"]').click();
  assert.equal(await fallback.locator('.archive .entry').count(), 4);
  await noJs.close();
  assert.deepEqual(errors, []);
  console.log('Writing checks passed: every keyword, counts, card links, history, reload, responsive themes, removed routes and no-JS fallback.');
} finally {
  await browser.close();
}
