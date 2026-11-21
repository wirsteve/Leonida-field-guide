import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
/** Set E2E_BASE_URL to test a deployed site (e.g. the Vercel URL) instead of a local build. */
const LIVE = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: LIVE ?? `http://localhost:${PORT}`,
    trace: "off",
  },
  projects: [
    { name: "iphone-15", use: { ...devices["iPhone 15"], browserName: "chromium" } },
    { name: "iphone-se", use: { ...devices["iPhone SE"], browserName: "chromium" } },
  ],
  webServer: LIVE
    ? undefined
    : {
        command: `npm run start -- -p ${PORT}`,
        port: PORT,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
