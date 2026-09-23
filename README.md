# Playwright E2E Framework

A production-grade end-to-end test automation framework built with
[Playwright](https://playwright.dev) + TypeScript. Example tests run against
the public demo app [saucedemo.com](https://www.saucedemo.com) — swap the
`config/env.ts` base URLs and page objects for your own application.

## Features

- **Page Object Model** (`src/pages`) — one class per page/component, all
  extending a shared `BasePage` with retry-safe waits and assertions.
- **Custom fixtures** (`src/fixtures/test-fixtures.ts`) — page objects are
  injected into tests via `test.extend`, so specs never construct `new
LoginPage(page)` by hand.
- **Auth setup project** — logs in once via `tests/auth/auth.setup.ts` and
  persists `storageState`; every other project depends on it, so specs start
  already authenticated instead of repeating a UI login per test.
- **Multi-environment config** (`config/env.ts`) — `.env` / `.env.<ENV>` /
  CI secrets are layered, validated, and typed. No env var is read ad hoc
  from `process.env` inside tests.
- **Cross-browser + mobile** — Chromium, Firefox, WebKit, plus emulated
  Pixel 7 and iPhone 14 projects.
- **Separate API project** — API-only tests run without spinning up a
  browser, keeping smoke checks fast.
- **CI-ready** — GitHub Actions workflow with lint/typecheck gate, 4-way
  test sharding, blob-report merging into a single HTML report, and
  artifact upload.
- **Diagnostics tuned for signal, not noise** — traces on first retry,
  screenshots/video only on failure, JUnit output for CI dashboards.
- **Tooling** — ESLint (flat config) with the Playwright plugin, Prettier,
  strict TypeScript, Husky + lint-staged pre-commit hook.
- **Dockerfile** for running the suite in a container identical to CI.

## Project structure

```
.
├── config/
│   └── env.ts                # layered, typed environment configuration
├── src/
│   ├── pages/                # Page Object Model
│   ├── fixtures/              # custom Playwright test fixtures
│   └── utils/                 # test data, logger, helpers
├── tests/
│   ├── auth/
│   │   ├── auth.setup.ts      # runs once, persists storageState
│   │   └── login.spec.ts      # login flow (runs logged-out)
│   ├── e2e/
│   │   ├── cart.spec.ts
│   │   └── checkout.spec.ts
│   └── api/
│       └── example.api.spec.ts
├── playwright.config.ts
├── global-setup.ts / global-teardown.ts
├── Dockerfile
└── .github/workflows/playwright.yml
```

## Getting started

```bash
npm ci
npx playwright install --with-deps   # or: npm run install:browsers
cp .env.example .env                 # fill in real values
npm test
```

## Common commands

| Command                     | What it does                                  |
| --------------------------- | --------------------------------------------- |
| `npm test`                  | Run the full suite headless                   |
| `npm run test:headed`       | Run with a visible browser                    |
| `npm run test:ui`           | Open the Playwright UI runner                 |
| `npm run test:debug`        | Run with the Playwright Inspector             |
| `npm run test:smoke`        | Run only `@smoke`-tagged tests                |
| `npm run test:regression`   | Run only `@regression`-tagged tests           |
| `npm run test:chromium`     | Run a single browser project                  |
| `npm run test:staging`      | Run against the staging environment           |
| `npm run codegen`           | Launch Playwright's codegen recorder          |
| `npm run report`            | Open the last HTML report                     |
| `npm run lint` / `lint:fix` | ESLint check / autofix                        |
| `npm run format`            | Prettier format                               |
| `npm run typecheck`         | `tsc --noEmit`                                |
| `npm run validate`          | typecheck + lint + format:check (the CI gate) |

## Writing a new test

1. Add or extend a page object in `src/pages`.
2. Register it in `src/fixtures/test-fixtures.ts` if it's new.
3. Write the spec using the fixture, not `new PageObject(page)` directly:

```ts
import { test, expect } from '../../src/fixtures/test-fixtures';

test.describe('Feature @regression', () => {
  test('does the thing', async ({ inventoryPage }) => {
    await inventoryPage.goto('/inventory.html');
    await inventoryPage.expectLoaded();
  });
});
```

4. Tag tests with `@smoke` or `@regression` in the `describe`/`test` title so
   they can be filtered with `--grep`.

## Environments

Set `ENV=development|staging|production` (see `.env.example`). Each
environment's base URL is resolved in `config/env.ts`; CI injects real
credentials as GitHub Actions secrets rather than committing them.

## CI

`.github/workflows/playwright.yml`:

1. **lint** — typecheck + lint + format check, fails fast before any browser
   spins up.
2. **test** — runs the suite across 4 shards in parallel, each uploading a
   blob report.
3. **merge-report** — merges all shard blob reports into a single
   downloadable HTML report artifact.

## Docker

```bash
docker build -t playwright-tests .
docker run --rm --env-file .env playwright-tests
```
