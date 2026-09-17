const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  let hasError = false;
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR CONSOLE:', msg.text());
      hasError = true;
    }
  });
  page.on('pageerror', err => {
    console.log('BROWSER ERROR PAGE:', err.toString());
    hasError = true;
  });
  
  await page.goto('http://localhost:5173/');
  await page.waitForTimeout(3000);
  
  if (!hasError) {
    console.log('No errors detected.');
  }
  
  await browser.close();
})();
