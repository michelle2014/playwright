import { test, expect, APIRequestContext } from '@playwright/test';

const REPO = 'test-repo-3';
const USER = 'michelle2014';

// Request context is reused by all tests in the file.
let apiContext: APIRequestContext;

test.beforeAll(async ({ playwright, request }) => {
  apiContext = await playwright.request.newContext({
    // All requests we send go to this API endpoint.
    baseURL: 'https://api.github.com',
    extraHTTPHeaders: {
      // We set this header per GitHub guidelines.
      'Accept': 'application/vnd.github.v3+json',
      // Add authorization token to all requests.
      // Assuming personal access token available in the environment.
      'Authorization': `token ${process.env.API_TOKEN}`,
    },
  });
  await request.post('/user/repos', {
    data: {
      name: REPO
    }
  });
});

test.afterAll(async ({ request }) => {
  await request.delete(`/repos/${USER}/${REPO}`);
  // Dispose all responses.
  await apiContext.dispose();
});

test('last created issue should be on the server', async ({ }) => {
  const newIssue = await apiContext.post(`/repos/${USER}/${REPO}/issues`, {
    data: {
      title: 'Bug report 1',
    }
  });
  expect(newIssue.ok()).toBeTruthy();
  expect(await newIssue.json()).toEqual(expect.objectContaining({
    title: 'Bug report 1'
  }));
});
