import { test, expect } from '@playwright/test';

test('Google search for リベシティ', async ({ page }) => {
  // Navigate to Google
  await page.goto('https://www.google.com/');
  
  // Accept cookies if present
  try {
    await page.click('[id="L2AGLb"]', { timeout: 3000 });
  } catch (error) {
    // Cookie banner might not appear or have different selector
    console.log('Cookie banner not found or already handled');
  }
  
  // Find search input and type "リベシティ"
  const searchInput = page.locator('textarea[name="q"], input[name="q"]');
  await searchInput.fill('リベシティ');
  
  // Press Enter to search
  await searchInput.press('Enter');
  
  // Check for CAPTCHA and handle it
  try {
    // Wait a moment to see if CAPTCHA appears
    await page.waitForTimeout(2000);
    
    // Check for various CAPTCHA selectors
    const captchaSelectors = [
      'iframe[src*="recaptcha"]',
      '[id*="captcha"]',
      '[class*="captcha"]',
      'img[src*="captcha"]',
      '.g-recaptcha'
    ];
    
    let captchaFound = false;
    for (const selector of captchaSelectors) {
      const captchaElement = await page.locator(selector).first();
      if (await captchaElement.isVisible().catch(() => false)) {
        console.log(`CAPTCHA detected with selector: ${selector}`);
        captchaFound = true;
        
        // Take a screenshot of the CAPTCHA page
        await page.screenshot({ path: '/Users/makoto/Desktop/google-captcha.png' });
        console.log('CAPTCHA screenshot saved to desktop');
        
        // Pause execution to allow manual intervention
        console.log('Please solve the CAPTCHA manually in the browser window and press any key to continue...');
        await page.pause();
        break;
      }
    }
    
    if (!captchaFound) {
      console.log('No CAPTCHA detected, proceeding with search results');
    }
    
  } catch (error) {
    console.log('Error checking for CAPTCHA:', error.message);
  }
  
  // Wait for search results to load
  await page.waitForLoadState('networkidle');
  
  // Take a screenshot of the results and save to desktop
  await page.screenshot({ path: '/Users/makoto/Desktop/google-search-results.png' });
  
  // Print the page title
  const title = await page.title();
  console.log('Page title:', title);
  
  // Get first few search result titles
  try {
    const resultTitles = await page.locator('h3').allTextContents();
    console.log('Search result titles:');
    resultTitles.slice(0, 5).forEach((title, index) => {
      if (title.trim()) {
        console.log(`${index + 1}. ${title}`);
      }
    });
  } catch (error) {
    console.log('Could not get search result titles:', error.message);
  }
});