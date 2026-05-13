// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // Let unused-imports handle both, disable the base rules to avoid double reports.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      // Auto-removable on --fix.
      'unused-imports/no-unused-imports': 'warn',

      // Warn on unused vars, but allow underscore-prefixed as an opt-out.
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Low-noise quality-of-life rules, all as warnings.
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      eqeqeq: ['warn', 'smart'],
    },
  },
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*', 'android/*', 'ios/*'],
  },
]);
