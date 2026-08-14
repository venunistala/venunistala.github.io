import { defineConfig, devices } from "@playwright/test";

// Not 3000. A dev server left running on the usual port must never be able to
// stand in for the export we mean to test.
const PORT = 4321;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,

  // A gate that retries is a gate that hides flake. If a spec is
  // non-deterministic we want to see it fail, not watch it pass on attempt 2.
  retries: 0,

  forbidOnly: !!process.env.CI,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"]],

  use: {
    baseURL,
    trace: "on-first-retry",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  webServer: {
    // Build the artifact, then serve it as static files. This is the whole
    // point: `next dev` has different routing, different bundling and no
    // export step, so testing it would tell us nothing about what ships.
    command: "pnpm build && pnpm serve:out",
    url: baseURL,
    // Never reuse whatever happens to be listening — that would silently
    // reintroduce the dev server this config exists to avoid.
    reuseExistingServer: false,
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
