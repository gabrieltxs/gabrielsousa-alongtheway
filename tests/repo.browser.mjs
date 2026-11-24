import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({args:['--no-sandbox']});
const base=process.env.SITE_TEST_URL || 'http://127.0.0.1:4321';
try {
 const context=await browser.newContext({reducedMotion:'reduce'});
 await context.route('**/*',route=>new URL(route.request().url()).origin===new URL(base).origin
  ?route.continue():route.fulfill({body:'Repository destination'}));
 const page=await context.newPage();
 const errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 for(const path of ['/projects/','/research/']) {
  await page.goto(base+path);
  assert.equal(await page.locator('main .glow').count(),0);
  assert.equal(await page.locator('.timeline > .entry').count(),4);
  assert(await page.locator('.timeline > .entry').evaluateAll(entries=>entries.every(el=>
   getComputedStyle(el).borderLeftWidth==='1px' && getComputedStyle(el,'::before').content==='""')));
  for(const width of [320,390,900,1440]) {
   await page.setViewportSize({width,height:1000});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path+' '+width);
  }
  await page.screenshot({path:`/tmp/${path.split('/')[1]}-timeline.png`,fullPage:true});
 }
 await page.goto(base+'/repo/');
 assert.deepEqual(await page.locator('.site-nav a').allTextContents(),['Home','Writing','Research','Projects','Repo','CV']);
 assert.equal(await page.locator('.site-nav [aria-current="page"]').innerText(),'Repo');
 assert.equal(await page.locator('.repo-card.glow').count(),5);
 assert(await page.locator('.repo-card a').evaluateAll(links=>links.every(a=>a.target==='_blank'&&a.relList.contains('noopener'))));
 for(const theme of ['light','dark'])for(const width of [320,390,900,1440]){
  await page.setViewportSize({width,height:1000});
  await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if(width===1440)await page.screenshot({path:`/tmp/repo-${theme}.png`,fullPage:true});
 }
 for(const card of await page.locator('.repo-card').all()) {
  await card.hover();
  assert(await card.evaluate(el=>el.style.getPropertyValue('--mx').endsWith('px')));
  const expected=await card.locator('h2 a').getAttribute('href');
  const popup=context.waitForEvent('page');
  await card.click({position:{x:12,y:12}});
  const opened=await popup;await opened.waitForLoadState();
  assert.equal(opened.url(),expected);await opened.close();
  for(const link of await card.locator('.repo-action a, a.repo-action').all()) {
   const destination=await link.getAttribute('href');
   const next=context.waitForEvent('page');await link.click();
   const tab=await next;await tab.waitForLoadState();
   assert.equal(tab.url(),destination);await tab.close();
  }
 }
 const primary=page.locator('.repo-card h2 a').first();
 await page.keyboard.press('Tab');
 await primary.focus();
 assert(await primary.evaluate(el=>getComputedStyle(el,'::after').outlineStyle==='solid'));
 const popup=context.waitForEvent('page');await page.keyboard.press('Enter');
 const tab=await popup;await tab.waitForLoadState();await tab.close();
 assert.deepEqual(errors,[]);
 console.log('Projects/Research timelines and Repo hover, full-card clicks, secondary links, keyboard and responsive themes passed.');
}finally{await browser.close();}
