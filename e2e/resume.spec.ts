import { test } from "@playwright/test";
import { expectCleanRoute } from "./support/checks";

test.describe("/resume/", () => {
  test("renders, scans clean, and is keyboard reachable", async ({ page }) => {
    await expectCleanRoute(page, "/resume/", "Résumé");
  });
});
