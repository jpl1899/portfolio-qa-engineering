import antfu from '@antfu/eslint-config';

export default antfu({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },

  lessOpinionated: true,

  ignores: [
    'node_modules',
    'test-results',
    'playwright-report',
    'allure-results',
    'allure-report',
    '**/*.md',
    '.github/**',
    'sut/**',
  ],

  rules: {
    'no-console': 'off',
    'ts/explicit-function-return-type': 'off',
    'ts/explicit-module-boundary-types': 'off',
    'ts/no-explicit-any': 'warn',
    'ts/strict-boolean-expressions': 'off',
    'style/semi': ['error', 'always'],
    'style/quotes': ['error', 'single'],
    'style/comma-dangle': ['error', 'always-multiline'],
    'unused-imports/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
  },
});
