import { test } from "@playwright/test";
import { expectCleanRoute } from "./support/checks";

test.describe("/quality-lab/", () => {
  test("renders, scans clean, and is keyboard reachable", async ({ page }) => {
    await expectCleanRoute(page, "/quality-lab/", "Quality lab");
  });
});
