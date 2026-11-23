import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({args:['--no-sandbox']});
try {
 const page=await browser.newPage();
 await page.goto((process.env.SITE_TEST_URL || 'http://127.0.0.1:4321')+'/repo/');
 assert.deepEqual(await page.locator('.site-nav a').allTextContents(),['Home','Writing','Research','Projects','Repo','CV']);
 assert.equal(await page.locator('.site-nav [aria-current="page"]').innerText(),'Repo');
 assert.equal(await page.locator('.repo-card').count(),5);
 assert(await page.locator('.repo-card a').evaluateAll(links=>links.every(a=>a.target==='_blank'&&a.relList.contains('noopener'))));
 for(const theme of ['light','dark'])for(const width of [320,390,900,1440]){
  await page.setViewportSize({width,height:1000});
  await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if(width===1440)await page.screenshot({path:`/tmp/repo-${theme}.png`,fullPage:true});
 }
 console.log('Repo: five cards, navigation order, external links and responsive layout verified.');
}finally{await browser.close();}
