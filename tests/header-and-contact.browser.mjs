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
  const response = await page.goto(base + '/cv/');
  const address = Buffer.from(contactEmailEncoded, 'base64').toString('utf8');
  assert(address.includes('@'));
  assert.equal((await response.text()).includes(address), false);
  assert.equal((await page.locator('body').innerText()).includes(address), false);
  assert.equal(await page.locator('a[href^="mailto:"]').count(), 0);
  assert.deepEqual(await page.locator('[aria-labelledby="section-summary"] .row-body p').allTextContents(), summary);
  await page.getByRole('button', { name: 'Show contact email' }).focus();
  await page.keyboard.press('Enter');
  const link = page.getByRole('link', { name: address, exact: true });
  assert.equal(await link.getAttribute('href'), `mailto:${address}`);
  assert(await link.evaluate(el => el === document.activeElement));
  await page.reload();
  assert.equal(await page.locator('a[href^="mailto:"]').count(), 0);
  assert.equal(await page.getByRole('button', { name: 'Show contact email' }).isVisible(), true);
  assert.deepEqual(errors, []);
  console.log('Header positions match across five pages at four widths; CV email is absent initially, reveals by keyboard, and hides again on reload.');
} finally {
  await browser.close();
}
