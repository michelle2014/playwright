import { test, expect } from '@playwright/test';

test('cross-browser snapshots', async ({ page, }) => {
  await page.goto('https://www.browsercat.com');
  await page.setViewportSize({
    width: 1280,
    height: 7344,
  });
  await page.locator(':has(> figure)')
    .evaluate(($el) => $el.remove());

  await expect(page).toHaveScreenshot(`home-page.png`, {
    fullPage: true,
    maxDiffPixelRatio: 0.1,
    // retry snapshot until timeout is reached
    timeout: 1000 * 60,
  });
});
