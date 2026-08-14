import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Playwright owns e2e/. Vitest must never try to run those specs.
    exclude: ["e2e/**", "node_modules/**"],
    // There are unit tests now, so this no longer hides an empty suite. It
    // stays because the alternative — a run that fails when a glob matches
    // nothing — turns a tooling mistake into something that looks like a
    // product failure.
    passWithNoTests: true,
    // Written everywhere, not just in CI: quality.json's test count is
    // derived from this file, and a number only produced on the machine
    // nobody watches is a number nobody can check.
    reporters: ["default", ["json", { outputFile: "reports/vitest.json" }]],
  },
});
