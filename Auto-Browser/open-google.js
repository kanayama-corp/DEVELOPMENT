const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('Googleを開いています...');
  await page.goto('https://www.google.com');

  console.log('Googleが開かれました。ブラウザを手動で閉じるまで待機します...');

  // ブラウザが閉じられるまで待機
  await page.waitForEvent('close').catch(() => {});

  await browser.close();
})();