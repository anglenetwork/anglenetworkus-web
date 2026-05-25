import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, ".env.local") });

/**
 * Playwright architecture (stabilization):
 * - chromium: primary gate — runs `tests/smoke/**` + `tests/integration/**` (Stripe, OAuth, profile flows).
 * - firefox / webkit: smoke only (`tests/smoke/**`) to reduce cross-browser noise while stabilizing.
 * - Global setup writes `playwright/.auth/state.json`; individual specs use `test.use({ storageState: … })`
 *   to opt out when unauthenticated flows are required (see smoke auth tests).
 *
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",

  // Runs once before all tests; generates playwright/.auth/state.json
  globalSetup: "./tests/global-setup.ts",

  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
    /* Use pre-authenticated state from global setup */
    storageState: "playwright/.auth/state.json",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testMatch: ["tests/smoke/**/*.spec.ts", "tests/integration/**/*.spec.ts"],
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testMatch: ["tests/smoke/**/*.spec.ts"],
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testMatch: ["tests/smoke/**/*.spec.ts"],
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    // `npm run dev` runs `predev` typegen (Sanity) which can exceed the default 60s on cold start.
    timeout: 180_000,
  },
});
