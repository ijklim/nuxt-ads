import { defineConfig, devices } from '@playwright/test'

const portTesting = 8810;

/**
 * Playwright configuration for E2E testing
 * Run with: pnpm test:e2e
 */
export default defineConfig({
  testDir: './tests/e2e',

  // true: run tests in parallel (faster but may have race conditions)
  // false: run sequentially (slower but more stable)
  fullyParallel: false,

  // Prevent .only tests in CI to ensure full test suite runs
  forbidOnly: !!process.env.CI,

  // Retry failed tests up to 2 times in CI for transient issues
  retries: process.env.CI ? 2 : 0,

  // Limit to 4 workers in CI to reduce resource contention, otherwise use 1 worker for more stable test runs locally
  workers: process.env.CI ? 2 : 1,

  reporter: [['html', { outputFolder: './playwright-results' }]],
  outputDir: './playwright-results',
  use: {
    baseURL: `http://localhost:${portTesting}`,
    trace: 'on-first-retry',
    actionTimeout: 10000, // Individual actions shouldn't take forever
    navigationTimeout: 15000, // Navigations can be a bit slower, especially on CI
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: process.env.CI ? `pnpm build && pnpm preview --port=${portTesting}` : `pnpm dev --port=${portTesting}`,
    url: `http://localhost:${portTesting}`,
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
