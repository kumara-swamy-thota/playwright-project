import type { FullConfig } from '@playwright/test';

/**
 * Runs once before the entire test suite.
 * Use this for suite-wide preconditions: seeding test data via API,
 * verifying the target environment is reachable, warming caches, etc.
 * Keep it fast — every second here is paid on every CI run.
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  const startedAt = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.log(`[global-setup] Test run starting at ${startedAt}`);

  // Example: fail fast if a required secret is missing, rather than letting
  // every single test fail individually with a confusing error.
  // if (!process.env.API_KEY) throw new Error('API_KEY is required to run this suite');
}

export default globalSetup;
