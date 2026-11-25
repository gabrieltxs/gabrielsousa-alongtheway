// Run with PLAYWRIGHT_MODULE pointing to playwright/index.mjs and SITE_TEST_URL.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const base = process.env.SITE_TEST_URL || 'http://127.0.0.1:4321';
const categories = ['research-notes', 'experiments', 'builds', 'engineering-notes', 'milestones'];
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.install();
  await page.clock.pauseAt(new Date(Date.now() + 1000));
  await page.goto(`${base}/writing/`);
  const cards = page.locator('.category-banner');
  const latest = await page.locator('.latest-writings a').evaluateAll(links => links.map(link => ({url:link.href, category:link.querySelector('.latest-category').textContent, title:link.querySelector('h3').textContent})));
  assert.equal(latest.length,3);
  assert.equal(new Set(latest.map(post => post.url)).size,3);
  assert(latest.every(post => post.title && post.category));
  assert.equal(await cards.count(), 5);
  assert.equal(await page.locator('.archive, .keyword-panel, .site-footer, .scroll-tools').count(), 0);
  const active = () => page.locator('.category-banner.is-active').getAttribute('href');
  assert.match(await active(), /research-notes\/$/);
  await page.clock.runFor(4900);
  assert.match(await active(), /research-notes\/$/);
  await page.clock.runFor(100);
  assert.match(await active(), /experiments\/$/);
  await page.getByRole('button', { name: 'Pause rotation' }).click();
  const paused = await active();
  await page.clock.runFor(10000);
  assert.equal(await active(), paused);
  await page.getByRole('button', { name: 'Resume rotation' }).click();
  await page.mouse.move(0, 0);
  await page.clock.runFor(5000);
  assert.notEqual(await active(), paused);
  await cards.nth(3).hover();
  assert.match(await active(), /engineering-notes\/$/);
  await page.clock.runFor(10000);
  assert.match(await active(), /engineering-notes\/$/);
  await page.mouse.move(0, 0);
  await cards.nth(4).focus();
  await page.clock.runFor(10000);
  assert.match(await active(), /milestones\/$/);
  await page.keyboard.press('Enter');
  await page.waitForURL('**/writing/category/milestones/');
  assert.equal(await page.locator('.archive .entry').count(), 1);
  await page.getByRole('link', { name: '← Writing categories' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  const still = await active();
  await page.clock.runFor(10000);
  assert.equal(await active(), still);
  assert(await page.getByRole('button', { name: 'Resume rotation' }).isVisible());

  for (const theme of ['dark', 'light']) {
    await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
    for (const [width, height] of [[320,480], [320,568], [390,844], [768,1024], [568,320], [667,375], [844,390], [1024,768], [1366,768], [1920,1080], [2544,1400]]) {
      await page.setViewportSize({ width, height });
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => ({
        overflowX: document.documentElement.scrollWidth > innerWidth,
        overflowY: document.documentElement.scrollHeight > innerHeight,
        latest: [...document.querySelectorAll('.latest-writings a')].every(link => {
          const r=link.getBoundingClientRect();
          return r.top>=0 && r.bottom<=innerHeight && r.height>=44 && link.scrollHeight<=r.height+1;
        }),
        cards: [...document.querySelectorAll('.category-banner')].map(card => {
          const r=card.getBoundingClientRect(), t=card.querySelector('h2').getBoundingClientRect();
          return r.top>=0 && r.bottom<=innerHeight && r.height>=44 && t.top>=r.top && t.bottom<=r.bottom;
        }),
      }));
      assert(!layout.overflowX && !layout.overflowY, `${theme} ${width}x${height}: ${JSON.stringify(layout)}`);
      assert(layout.latest, `${width}x${height}: latest writings must fit`);
      if (!layout.cards.every(Boolean)) {
        await page.screenshot({path:'/tmp/writing-fit-failure.png'});
        console.log(await cards.evaluateAll(cards => cards.map(card => ({card:card.getBoundingClientRect().toJSON(), title:card.querySelector('h2').getBoundingClientRect().toJSON()}))));
      }
      assert(layout.cards.every(Boolean), `${width}x${height}: banners and titles must fit`);
      if ([390,1366,1920].includes(width)) await page.screenshot({path:`/tmp/writing-gateway-${theme}-${width}.png`});
    }
  }
  const uniquePosts = new Set();
  const postDates = new Map();
  for (const [i, category] of categories.entries()) {
    await page.goto(`${base}/writing/category/${category}/`);
    const entries = page.locator('.archive .entry');
    assert.equal(await entries.count(), [1,5,0,0,1][i]);
    const records = await entries.evaluateAll(entries => entries.map(entry => ({url:entry.querySelector('.entry-title a').href, date:entry.querySelector('time').dateTime})));
    const urls = records.map(post => post.url);
    for (const post of records) postDates.set(post.url, post.date);
    for (const post of latest.filter(post => urls.includes(post.url))) assert.equal(post.category, await page.locator('h1.page-title').innerText());
    for (const url of urls) { assert(!uniquePosts.has(url), 'Each post belongs to exactly one category'); uniquePosts.add(url); }
    if (!urls.length) assert(await page.getByText('No posts in this category yet.', {exact:false}).isVisible());
    else {
      await page.locator('.keyword-panel summary').click();
      const filters = await page.locator('.keyword-filters [data-keyword]').evaluateAll(links => links.map(link => ({ keyword: link.dataset.keyword, count: Number(link.querySelector('.tag-count').textContent) })));
      for (const {keyword,count} of filters) {
        await page.locator(`.keyword-filters [data-keyword="${keyword}"]`).click();
        assert.equal(await page.locator('.archive .entry:visible').count(),count);
      }
    }
  }
  assert.equal(uniquePosts.size,7);
  assert.deepEqual(latest.map(post => postDates.get(post.url)), [...postDates.values()].sort().reverse().slice(0,3));
  await page.goto(`${base}/writing/category/experiments/`);
  const visible = page.locator('.archive .entry:visible');
  await page.locator('.archive [data-keyword="legal-ai"]').first().click();
  assert.equal(await visible.count(),4);
  await page.reload();
  assert.equal(await visible.count(),4);
  await page.goBack();
  assert.equal(await visible.count(),5);
  await page.goForward();
  assert.equal(await visible.count(),4);
  await page.goto(`${base}/writing/category/experiments/?keyword=does-not-exist`);
  assert.equal(await visible.count(),5);
  for (const width of [320,390,1440]) {
    await page.setViewportSize({width,height:900});
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  for (const url of uniquePosts) assert.equal((await page.request.get(url)).status(),200);
  for (const slug of ['hello-world','post-template','legal-text-generation','goiania-is-three-tokens']) assert.equal((await page.request.get(`${base}/writing/${slug}/`)).status(),404);
  const noJs = await browser.newContext({javaScriptEnabled:false});
  const fallback = await noJs.newPage();
  await fallback.goto(`${base}/writing/`);
  await fallback.getByRole('link', {name:'Experiments',exact:true}).click();
  assert.equal(await fallback.locator('.archive .entry').count(),5);
  await fallback.locator('.keyword-panel summary').click();
  await fallback.locator('.keyword-filters [data-keyword="legal-ai"]').click();
  assert.equal(await fallback.locator('.archive .entry').count(),4);
  await noJs.close();
  assert.deepEqual(errors, []);
  console.log('Five categories, exclusive post classification, 5-second rotation, pause/hover/keyboard/reduced motion, viewport fit, timelines, keyword/history filters and no-JS navigation passed.');
} finally { await browser.close(); }
