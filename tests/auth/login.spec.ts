import { test, expect } from '../../src/fixtures/test-fixtures';
import { users } from '../../src/utils/test-data';

// This spec intentionally starts logged out, overriding the project-level
// authenticated storage state, since it exercises the login flow itself.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login @smoke', () => {
  test('logs in successfully with valid standard-user credentials', async ({
    loginPage,
    inventoryPage,
    page,
  }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);

    await inventoryPage.expectLoaded();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('shows an error for a locked-out user', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.locked.username, users.locked.password);

    await loginPage.expectLoginError(/locked out/i);
  });

  test('shows an error for invalid credentials', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.invalid.username, users.invalid.password);

    await loginPage.expectLoginError(/username and password do not match/i);
  });

  test('rejects an empty submission', async ({ loginPage, page }) => {
    await loginPage.open();
    await page.getByRole('button', { name: 'Login' }).click();

    await loginPage.expectLoginError(/username is required/i);
  });
});
