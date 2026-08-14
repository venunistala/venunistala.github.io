import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The Phase 0 smoke test. It runs against the built static export served from
// out/ — see webServer in playwright.config.ts. Phase 4 splits this into one
// spec per route; until there is more than one route, one spec is the whole
// suite.
test("home page renders with a single h1 and no axe violations", async ({
  page,
}) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);

  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

  const { violations } = await new AxeBuilder({ page }).analyze();

  // toEqual([]) rather than a length check: when this fails the diff prints
  // the offending rules and nodes, which is the information you actually need.
  expect(violations).toEqual([]);
});
