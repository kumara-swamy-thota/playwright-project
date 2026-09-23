import { defineConfig, devices } from '@playwright/test';
import { envConfig } from './config/env';

/**
 * Production-grade Playwright configuration.
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',

  // Fail the build on CI if someone accidentally left test.only in the source.
  forbidOnly: envConfig.isCI,

  // Retries make flaky-network failures self-heal without masking real bugs.
  retries: envConfig.isCI ? 2 : 0,

  // Parallelism: full parallel locally, tuned worker count on CI runners.
  fullyParallel: true,
  workers: envConfig.isCI ? '50%' : undefined,

  // Global timeouts
  timeout: 30_000,
  expect: {
    timeout: 8_000,
  },

  // Multiple reporters: human-readable HTML, machine-readable JUnit for CI
  // dashboards, and a JSON blob for merging sharded runs.
  reporter: envConfig.isCI
    ? [['blob'], ['junit', { outputFile: 'test-results/junit-results.xml' }], ['github'], ['list']]
    : [['html', { open: 'never' }], ['list']],

  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',

  use: {
    baseURL: envConfig.baseURL,
    headless: envConfig.headless,

    // Diagnostics: capture only what's needed to debug a failure, so
    // successful runs stay fast and artifacts stay small.
    trace: envConfig.traceMode,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 10_000,
    navigationTimeout: 15_000,

    ignoreHTTPSErrors: true,
    testIdAttribute: 'data-testid',
  },

  projects: [
    // Runs once per suite to authenticate and persist storage state,
    // so individual specs don't each re-do a UI login.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/standard-user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: 'playwright/.auth/standard-user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: 'playwright/.auth/standard-user.json' },
      dependencies: ['setup'],
    },

    // Mobile coverage
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'], storageState: 'playwright/.auth/standard-user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 14'], storageState: 'playwright/.auth/standard-user.json' },
      dependencies: ['setup'],
    },

    // API-only tests don't need a browser context/storage state.
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: envConfig.apiBaseURL || envConfig.baseURL,
      },
    },
  ],
});
