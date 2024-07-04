import { test, expect } from '@playwright/test';

test('visual comparisons test', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveScreenshot({
    maxDiffPixels: 100,
    // crop the screenshot to a specific area
    clip: { x: 0, y: 0, width: 500, height: 500 },
  });
});

// to compare text or arbitrary binary data
test('non-image visual comparisons test', async ({ page }) => {
  await page.goto('https://playwright.dev');
  expect(await page.textContent('.hero__title')).toMatchSnapshot('hero.txt');
});

test('element snapshot', async ({ page }) => {
  await page.goto('https://playwright.dev');
  const locator = page.locator('.DocSearch').first();
  await expect(locator).toBeVisible();
  await expect(locator).toHaveScreenshot();
});
