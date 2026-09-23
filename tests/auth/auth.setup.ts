import { test as setup } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { users } from '../../src/utils/test-data';

/**
 * Runs once per project before the dependent tests, logs in through the real
 * UI, and persists the authenticated storage state to disk. Every spec that
 * declares `dependencies: ['setup']` in playwright.config.ts then starts
 * already logged in — no repeated login flow per test, which is both faster
 * and closer to how a real user only authenticates once per session.
 */
const authFile = 'playwright/.auth/standard-user.json';

setup('authenticate as standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.open();
  await loginPage.login(users.standard.username, users.standard.password);
  await inventoryPage.expectLoaded();

  await page.context().storageState({ path: authFile });
});
