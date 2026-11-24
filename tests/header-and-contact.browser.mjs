import assert from 'node:assert/strict';
import { contactEmailEncoded, summary } from '../src/data/cv.ts';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const base = process.env.SITE_TEST_URL || 'http://127.0.0.1:4321';
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [390, 900, 1440, 2544]) {
    await page.setViewportSize({ width, height: 900 });
    let home;
    for (const path of ['/', '/writing/', '/research/', '/projects/', '/cv/']) {
      await page.goto(base + path);
      await page.evaluate(() => document.fonts.ready);
      const boxes = await page.evaluate(() => ['.site-header', '.site-name', '.site-nav', '.theme-toggle'].map(selector => {
        const { x, y, width, height } = document.querySelector(selector).getBoundingClientRect();
        return [x, y, width, height];
      }));
      if (!home) home = boxes;
      else boxes.forEach((box, i) => box.forEach((value, j) => assert(Math.abs(value - home[i][j]) < 1, `${path}, ${width}px`)));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    }
  }
  for (const [path, label] of [['/', 'Show contact info']]) {
    const response = await page.goto(base + path);
    const address = Buffer.from(contactEmailEncoded, 'base64').toString('utf8');
    assert(address.includes('@'));
    assert.equal((await response.text()).includes(address), false);
    assert.equal((await page.locator('body').innerText()).includes(address), false);
    assert.equal(await page.locator('a[href^="mailto:"]').count(), 0);
    await page.getByRole('button', { name: label }).focus();
    await page.keyboard.press('Enter');
    const link = page.getByRole('link', { name: address, exact: true });
    assert.equal(await link.getAttribute('href'), `mailto:${address}`);
    assert(await link.evaluate(el => el === document.activeElement));
    await page.reload();
    assert.equal(await page.locator('a[href^="mailto:"]').count(), 0);
    assert.equal(await page.getByRole('button', { name: label }).isVisible(), true);
  }
  await page.goto(base + '/cv/');
  assert.deepEqual(await page.locator('[aria-labelledby="section-summary"] .row-body p').allTextContents(), summary);
  assert.equal(await page.locator('[data-contact-email], [data-print]').count(), 0);
  const downloads = page.locator('a[download]');
  assert.equal(await downloads.count(), 2);
  for (const link of await downloads.all()) {
    assert(await link.getAttribute('aria-label'));
    assert.equal(await link.getAttribute('title'), await link.getAttribute('aria-label'));
    assert.equal(await link.locator('svg').count(), 1);
    assert(!/[a-zA-Z]/.test(await link.innerText()));
    const response = await page.request.get(new URL(await link.getAttribute('href'), page.url()).href);
    assert.equal(response.status(), 200);
    assert((await response.body()).subarray(0, 5).equals(Buffer.from('%PDF-')));
  }
  assert.deepEqual(errors, []);
  console.log('Header positions match across five pages at four widths; Home contact reveals by keyboard; CV uses accessible PDF download icons without contact or print buttons.');
} finally {
  await browser.close();
}
