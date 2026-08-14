import { test } from "@playwright/test";
import { expectCleanRoute } from "./support/checks";

test.describe("/how-this-site-is-tested/", () => {
  test("renders, scans clean, and is keyboard reachable", async ({ page }) => {
    await expectCleanRoute(
      page,
      "/how-this-site-is-tested/",
      "How this site is tested",
    );
  });
});
