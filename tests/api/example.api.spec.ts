import { test, expect } from '@playwright/test';

/**
 * Example API-level test. Runs under the `api` project (see
 * playwright.config.ts), which has no browser dependency, so this stays
 * fast and can run in every CI job without a browser download.
 *
 * Swap the URL for a real endpoint on your API_BASE_URL once available.
 */
test.describe('API health @smoke', () => {
  test('reqres.in reports a healthy list-users endpoint', async ({ request }) => {
    const response = await request.get('https://reqres.in/api/users?page=1');

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.page).toBe(1);
    expect(Array.isArray(body.data)).toBe(true);
  });
});
