import type { FullConfig } from '@playwright/test';

/**
 * Runs once after the entire test suite, regardless of pass/fail.
 * Use this to clean up any data/resources created in global-setup.
 */
async function globalTeardown(_config: FullConfig): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('[global-teardown] Test run complete.');
}

export default globalTeardown;
