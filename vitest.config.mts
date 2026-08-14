import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Playwright owns e2e/. Vitest must never try to run those specs.
    exclude: ["e2e/**", "node_modules/**"],
    // Phase 0 has no pure helpers yet — the MDX frontmatter parser arrives in
    // Phase 2 and its unit tests in Phase 4. This keeps `pnpm test` honestly
    // green rather than green because of a placeholder assertion.
    passWithNoTests: true,
  },
});
