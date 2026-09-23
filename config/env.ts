import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';

/**
 * Centralized environment configuration.
 *
 * Loading order (later overrides earlier):
 *   1. .env               – shared local defaults
 *   2. .env.[ENV]         – environment-specific overrides (e.g. .env.staging)
 *   3. real process.env   – CI-injected secrets always win
 */
const rootDir = process.cwd();
const baseEnvPath = path.resolve(rootDir, '.env');
if (fs.existsSync(baseEnvPath)) {
  loadEnv({ path: baseEnvPath });
}

const envName = process.env.ENV ?? 'development';
const specificEnvPath = path.resolve(rootDir, `.env.${envName}`);
if (fs.existsSync(specificEnvPath)) {
  loadEnv({ path: specificEnvPath, override: true });
}

type Environment = 'development' | 'staging' | 'production';

interface EnvConfig {
  env: Environment;
  baseURL: string;
  apiBaseURL: string;
  credentials: {
    standardUser: string;
    password: string;
    lockedUser: string;
    problemUser: string;
  };
  isCI: boolean;
  headless: boolean;
  traceMode: 'on' | 'off' | 'retain-on-failure' | 'on-first-retry';
}

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function resolveBaseUrl(env: Environment): string {
  switch (env) {
    case 'staging':
      return requireEnv('STAGING_BASE_URL');
    case 'production':
      return requireEnv('PROD_BASE_URL');
    case 'development':
    default:
      return requireEnv('DEV_BASE_URL', 'https://www.saucedemo.com');
  }
}

export const envConfig: EnvConfig = {
  env: envName as Environment,
  baseURL: resolveBaseUrl(envName as Environment),
  apiBaseURL: process.env.API_BASE_URL ?? '',
  credentials: {
    standardUser: requireEnv('TEST_USERNAME', 'standard_user'),
    password: requireEnv('TEST_PASSWORD', 'secret_sauce'),
    lockedUser: process.env.LOCKED_USER ?? 'locked_out_user',
    problemUser: process.env.PROBLEM_USER ?? 'problem_user',
  },
  isCI: process.env.CI === 'true' || !!process.env.GITHUB_ACTIONS,
  headless: process.env.HEADLESS !== 'false',
  traceMode: (process.env.TRACE_MODE as EnvConfig['traceMode']) ?? 'on-first-retry',
};
