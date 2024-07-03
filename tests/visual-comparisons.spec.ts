import { test, expect } from '@playwright/test';

test('visual comparisons test', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveScreenshot({ maxDiffPixels: 100 });
});

// to compare text or arbitrary binary data
test('non-image visual comparisons test', async ({ page }) => {
  await page.goto('https://playwright.dev');
  expect(await page.textContent('.hero__title')).toMatchSnapshot('hero.txt');
});
