// Run against a built preview with SITE_TEST_URL and PLAYWRIGHT_MODULE.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const base = process.env.SITE_TEST_URL || 'http://127.0.0.1:4321';
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const path of ['/', '/writing/antimicrobial-resistance-machine-learning/']) {
    await page.goto(base + path);
    const tools = page.locator('.scroll-tools');
    assert.equal(await tools.isVisible(), false);
    for (const width of [320, 390, 1024, 1440, 2544]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => scrollTo(0, 500));
      if (path === '/') {
        assert.equal(await page.locator('.scroll-tools, .go-to-top').count(), 0);
        assert.equal(await page.locator('.home-updates').isVisible(), true);
        await page.evaluate(() => scrollTo(0, 0));
        continue;
      }
      await tools.waitFor({ state: 'visible' });
      const box = await tools.boundingBox();
      const button = page.getByRole('button', { name: 'Go to top' });
      const buttonBox = await button.boundingBox();
      assert(Math.abs(buttonBox.x + buttonBox.width / 2 - box.x - box.width / 2) < 1);
      assert(box.x >= 0 && box.x + box.width <= width && box.y + box.height <= 900);
      if (width > 1024) assert(Math.abs(box.x + box.width / 2 - width * 0.9) < 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      if (path !== '/' && [390, 1440].includes(width)) {
        await page.screenshot({ path: `/tmp/scroll-tools-${width}.png` });
      }
      await button.click();
      await tools.waitFor({ state: 'hidden' });
      assert.equal(await page.evaluate(() => scrollY), 0);
    }
  }
  await page.goto(base);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => scrollTo(0, 500));
  const home = page.locator('.home [data-updates-banner]');
  assert.equal(await home.locator('details[open]').count(), 1);
  // Clicking the top edge of either expanded image follows its real link.
  for (const path of ['/', '/writing/antimicrobial-resistance-machine-learning/']) {
    await page.goto(base + path);
    await page.evaluate(() => scrollTo(0, 500));
    const banner = page.locator(path === '/' ? '.home [data-updates-banner]' : '.scroll-tools [data-updates-banner]');
    const card = banner.locator('details').nth(1);
    await card.hover();
    assert.equal(await card.getAttribute('open'), '');
    const url = await card.locator('.update-link').evaluate(link => link.href);
    const before = page.url();
    const popup = page.waitForEvent('popup');
    const bounds = await card.boundingBox();
    await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + 5);
    const opened = await popup;
    await opened.waitForLoadState();
    assert.equal(opened.url(), url);
    await opened.close();
    assert.equal(page.url(), before);
  }
  const floating = page.locator('.scroll-tools [data-updates-banner]');
  const first = floating.locator('summary').first();
  await first.focus();
  await page.keyboard.press('ArrowRight');
  assert(await floating.locator('summary').nth(1).evaluate(el => el === document.activeElement));
  await page.locator('.site-name').evaluate(link => link.focus({ preventScroll: true }));
  await page.mouse.move(0, 0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const active = await floating.locator('details').evaluateAll(cards => cards.findIndex(card => card.open));
  await page.waitForFunction(previous => {
    const cards = [...document.querySelectorAll('.scroll-tools details')];
    return cards.findIndex(card => card.open) !== previous;
  }, active, { timeout: 5000 });
  assert.deepEqual(errors, []);
  console.log('Scroll tools: synchronized visibility, centered placement at five widths, independent rotation, keyboard navigation and full-image links passed.');
} finally {
  await browser.close();
}
