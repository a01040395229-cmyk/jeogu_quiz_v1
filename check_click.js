const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log('BROWSER CONSOLE:', msg.text());
  });
  page.on('pageerror', err => {
    console.log('BROWSER EXCEPTION:', err.toString());
  });

  await page.setViewport({ width: 1080, height: 1920 });
  await page.goto('file:///Users/jumjum22/Desktop/졸스0/(9)jeogu_quiz/jeogu_quiz_v1/quiz1/index.html', { waitUntil: 'networkidle0' });
  
  // Inject a global click interceptor to see what is being clicked
  await page.evaluate(() => {
    document.addEventListener('click', (e) => {
        let el = e.target;
        console.log(`Global Click Intercepted on: <${el.tagName.toLowerCase()} id="${el.id}" class="${el.className}">, pointerEvents: ${window.getComputedStyle(el).pointerEvents}, zIndex: ${window.getComputedStyle(el).zIndex}`);
    }, true);
    
    // Also patch the bindQuizEvents to add console logs
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => console.log('OPTION BTN CLICK FIRED: ' + btn.getAttribute('data-answer')));
        btn.addEventListener('touchend', () => console.log('OPTION BTN TOUCHEND FIRED: ' + btn.getAttribute('data-answer')));
    });
  });

  console.log("Navigating to Screen 4...");
  // click to go to screen 2
  await page.evaluate(() => document.getElementById('section-screen1').dispatchEvent(new Event('click', { bubbles: true })));
  await page.waitForTimeout(500);

  // click to go to screen 3
  await page.evaluate(() => document.getElementById('section-screen2').dispatchEvent(new Event('click', { bubbles: true })));
  await page.waitForTimeout(500);

  // click to go to screen 4
  await page.evaluate(() => document.getElementById('section-screen3').dispatchEvent(new Event('click', { bubbles: true })));
  await page.waitForTimeout(500);
  
  console.log("On Screen 4. Finding button bounding box...");
  
  const box = await page.evaluate(() => {
      const btn = document.querySelector('#section-screen4 .option-btn[data-answer="horse"]');
      if (btn) {
          const rect = btn.getBoundingClientRect();
          return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: rect.width, height: rect.height, visible: btn.offsetParent !== null };
      }
      return null;
  });
  
  console.log("Button box:", box);
  
  if (box) {
      console.log(`Clicking at X=${box.x}, Y=${box.y}`);
      await page.mouse.click(box.x, box.y);
      await page.waitForTimeout(1000);
  }
  
  await browser.close();
})();
