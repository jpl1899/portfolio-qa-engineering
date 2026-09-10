import process from 'node:process';
import { defineConfig, devices } from '@playwright/test';
import { config } from './src/config';

const isCI = !!process.env.CI;

/**
 * The Toolshop SUT runs externally via `bun run sut:up` (Docker Compose),
 * so there is no `webServer` block — CI starts it as an explicit step.
 *
 * Projects mirror the four test disciplines. `auth-setup` produces the
 * browser storage state that the `ui` project reuses (wired in module 12).
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: [['list'], ['allure-playwright', { resultsDir: 'allure-results' }]],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'api',
      testDir: './tests/api',
    },
    {
      name: 'db',
      testDir: './tests/db',
    },
    {
      name: 'auth-setup',
      testDir: './tests/ui',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'ui',
      testDir: './tests/ui',
      testIgnore: /.*\.setup\.ts/,
      dependencies: ['auth-setup'],
      use: {
        ...devices['Desktop Chrome'],
        baseURL: config.sut.webUrl,
        // storageState: '.auth/customer.json',  // enabled in module 12
      },
    },
    {
      name: 'integration',
      testDir: './tests/integration',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: config.sut.webUrl,
      },
    },
  ],

  outputDir: 'test-results',
});
