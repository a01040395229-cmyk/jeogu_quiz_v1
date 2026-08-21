const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR:', msg.text());
    }
  });
  page.on('pageerror', err => {
    console.log('PAGE EXCEPTION:', err.toString());
  });

  await page.goto('file:///Users/jumjum22/Desktop/졸스0/(9)jeogu_quiz/jeogu_quiz_v1/quiz1/index.html');
  await page.waitForTimeout(2000);
  
  await browser.close();
})();
