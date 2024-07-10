import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Read from default ".env" file.
dotenv.config();

const crossBrowserConfig = {
  testDir: './tests/cross-browser',
  snapshotPathTemplate: '.test/spec/snaps/{projectName}/{testFilePath}/{arg}{ext}',
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.1 },
  },
};

const isCI = !!process.env.CI;

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  timeout: 1000 * 60,
  // Opt out of parallel tests on CI.
  workers: isCI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', {
      outputFolder: '.test/spec/results',
      open: 'never',
    }],
    isCI ? ['github'] : ['line'],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    // All requests we send go to this API endpoint.
    baseURL: 'https://api.github.com',
    extraHTTPHeaders: {
      // We set this header per GitHub guidelines.
      'Accept': 'application/vnd.github.v3+json',
      // Add authorization token to all requests.
      // Assuming personal access token available in the environment.
      'Authorization': `token ${process.env.API_TOKEN}`,
    },
  },
  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: '.test/spec/output',
  snapshotPathTemplate: '.test/spec/snaps/{projectName}/{testFilePath}/{arg}{ext}',
  testMatch: '*.spec.{ts,tsx}',

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'cross-chromium',
      use: { ...devices['Desktop Chrome'] },
      ...crossBrowserConfig,
    },
    {
      name: 'cross-firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['cross-chromium'],
      ...crossBrowserConfig,
    },
    {
      name: 'cross-browser',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['cross-firefox'],
      ...crossBrowserConfig,
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  // expect: {
  //   toHaveScreenshot: {
  //     threshold: 0.25,
  //     maxDiffPixelRatio: 0.025,
  //     maxDiffPixels: 25,
  //   },
  //   toMatchSnapshot: {
  //     threshold: 0.25,
  //     maxDiffPixelRatio: 0.025,
  //     maxDiffPixels: 25,
  //   }
  // },

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
