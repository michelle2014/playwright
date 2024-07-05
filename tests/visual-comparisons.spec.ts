import { test, expect } from '@playwright/test';
const { chromium } = require('playwright');
import { buffer } from 'stream/consumers';

test('visual comparisons test', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveScreenshot({
    maxDiffPixelRatio: 0.1,
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
  const locator = page.locator('.DocSearch');
  await page.evaluate(() => {
    document
      .querySelector('.DocSearch')
      ?.scrollIntoView({ behavior: 'instant' });
  });
  await expect(locator).toBeVisible();
  await expect(locator).toHaveScreenshot();
});

// full page snapshot has a problem of scrollbar difference
// the solution below doesn't work but it does pass multiple times in headless mode
// on solution for this is using clip by restricting snapshot area to a small area
test('full page snapshot in headed mode', async ({ page }) => {
  const browser = await chromium.launch({
    headed: true,
    ignoreDefaultArgs: ['--hide-scrollbars']
  });
  await page.goto('https://www.browsercat.com');
  await page.setViewportSize({
    width: 1280,
    height: 7504,
  });
  // to have the almost last element loaded first before take a snapshot
  await expect(page.getByText('Stay informed!')).toBeVisible();
  await expect(page).toHaveScreenshot({
    fullPage: true,
    maxDiffPixelRatio: 0.2
  });
  await browser.close();
});

// test if a page looks the same across different browers
test('full page snapshot in headless mode', async ({ page }) => {
  await page.goto('https://www.browsercat.com');
  await page.setViewportSize({
    width: 1250,
    height: 7584,
  });
  await expect(page.getByText('Stay informed!')).toBeVisible();
  await expect(page).toHaveScreenshot({
    fullPage: true,
    maxDiffPixelRatio: 0.01
  });
});

test('more element states', async ({ page }) => {
  await page.goto('https://www.browsercat.com/contact');
  const textarea = page.locator('textarea').first();

  await expect(textarea).toHaveScreenshot();
  await textarea.hover();
  await expect(textarea).toHaveScreenshot();
  await textarea.focus();
  await expect(textarea).toHaveScreenshot();
  await textarea.fill('Hey, cool cat!');
  await expect(textarea).toHaveScreenshot();
});


test('masked snapshots', async ({ page }) => {
  await page.goto('https://www.browsercat.com');
  const hero = page.locator('main > header');
  const footer = page.locator('body > footer');

  await expect(page).toHaveScreenshot({
    maxDiffPixelRatio: 0.1,
    clip: { x: 0, y: 0, width: 500, height: 500 },
    mask: [
      hero.locator('img[src=".svg"]'),
      hero.locator('a[target="_blank"]'),
    ],
    // retry snapshot until timeout is reached
    timeout: 1000 * 60,
  });
});

test('arbitrary snapshot', async ({ page }) => {
  // generates custom avatars — fun!
  await page.goto('https://getavataaars.com');
  await page.locator('main form button').first().click();

  // download the avatar
  const avatar = await page.waitForEvent('download')
    .then((dl) => dl.createReadStream())
    .then((stream) => buffer(stream));

  expect(avatar).toMatchSnapshot('avatar.png');
});

test('custom snapshot names', async ({ page }) => {
  await page.goto('https://www.browsercat.com');
  const hero = page.locator('main > header');

  await expect(page).toHaveScreenshot('home-page.png');
  await expect(hero).toHaveScreenshot('home-hero.png');

  const footer = page.locator('body > footer');
  const footImg = await footer.screenshot();

  expect(footImg).toMatchSnapshot('home-foot.png')
});
