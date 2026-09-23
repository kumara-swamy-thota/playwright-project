// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-conditional-in-test': 'off',
      // Many assertions live inside BasePage/page-object helper methods
      // (expectLoaded, expectLoginError, expectOrderComplete, ...) rather
      // than as raw `expect()` calls in the spec body, so teach the rule
      // to recognize those helper names too.
      'playwright/expect-expect': [
        'warn',
        {
          assertFunctionNames: [
            'expect',
            'expectLoaded',
            'expectVisible',
            'expectText',
            'expectURL',
            'expectLoginError',
            'expectOrderComplete',
          ],
        },
      ],
    },
  },
  prettier,
  {
    ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**', 'blob-report/**'],
  },
);
