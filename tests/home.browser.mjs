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
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.locator('[data-theme-toggle]').click();
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
  assert.equal(await page.locator('.icon-links a').count(), 4);
  assert.equal(await page.locator('.card-statement').first().innerText(), 'I research how language models learn a new domain and its tasks.');
  assert.equal(await page.locator('.card-statement-2 a').innerText(), 'Here I write about what I’ve learned along the way.');
  assert.equal(await page.locator('.scroll-tools').count(), 0);
  for (const theme of ['dark', 'light']) {
    await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
    for (const [width, height] of [[320, 740], [390, 844], [832, 900], [1024, 768], [1280, 720], [1366, 768], [1440, 900], [1920, 1080], [2544, 1400]]) {
      await page.setViewportSize({ width, height });
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => {
        const box = selector => document.querySelector(selector).getBoundingClientRect();
        const id = box('.card-id'), title = box('.card-statement'), about = box('.card-about');
        const invitation = box('.card-statement-2'), cards = box('.card-updates');
        return {
          overflowX: document.documentElement.scrollWidth > innerWidth,
          overflowY: document.documentElement.scrollHeight > innerHeight + 1,
          sideBySide: id.right < title.left,
          order: title.bottom <= about.top && about.bottom <= invitation.top && invitation.bottom <= cards.top,
          cardsVisible: cards.bottom <= innerHeight,
          justified: getComputedStyle(document.querySelector('.card-about')).textAlign === 'justify',
        };
      });
      assert.equal(layout.overflowX, false, `${theme} ${width} horizontal overflow`);
      assert(layout.order, `${theme} ${width} reading order`);
      if (width >= 960) {
        assert(layout.sideBySide && layout.justified, `${theme} ${width} columns`);
        assert(!layout.overflowY && layout.cardsVisible, `${theme} ${width}x${height}: ${JSON.stringify(layout)}`);
      }
      if ([390, 1366, 1920].includes(width)) await page.screenshot({ path: `/tmp/home-columns-${theme}-${width}.png`, fullPage: true });
    }
  }

  // Maximizing the window must not add a title line when the reading column is capped.
  let windowedLines;
  for (const [width, height] of [[1366, 768], [1680, 1050], [1920, 1080], [2544, 1400]]) {
    await page.setViewportSize({ width, height });
    const lines = await page.locator('.card-statement').first().evaluate(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return new Set([...range.getClientRects()].map(rect => rect.top)).size;
    });
    windowedLines ??= lines;
    assert(lines <= windowedLines, `${width}x${height}: maximizing added a title line`);
    if (width >= 1680) assert.equal(lines, 1, `${width}x${height}: wide-screen title must fit on one line`);
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
  console.log('Home columns, first-screen desktop content, reading order, theme persistence and post links passed.');
} finally { await browser.close(); }
