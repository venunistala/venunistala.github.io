import { expect, test } from "@playwright/test";
import { expectCleanRoute } from "./support/checks";
import { getAllCaseStudies } from "../src/lib/content";
import { REQUIRED_SECTION } from "../src/lib/sections";

// One spec per route, and /work/[slug] is one route with several instances.
// Generated from the content directory rather than hand-listed: a fixed list
// would eventually disagree with the site, and its failure mode is silent —
// a case study nothing scans.
for (const { meta } of getAllCaseStudies()) {
  const route = `/work/${meta.slug}/`;

  test.describe(route, () => {
    test("renders, scans clean, and is keyboard reachable", async ({
      page,
    }) => {
      await expectCleanRoute(page, route, meta.title);
    });

    test("shows the frontmatter facts", async ({ page }) => {
      await page.goto(route);
      for (const value of [meta.role, meta.period, ...meta.stack]) {
        await expect(page.getByText(value, { exact: false })).not.toHaveCount(
          0,
        );
      }
    });

    test(`carries its "${REQUIRED_SECTION}" section, boxed`, async ({
      page,
    }) => {
      await page.goto(route);

      // The section is labelled as a region, which is what makes it findable
      // by a screen reader as well as visible as the one bordered block.
      const section = page.getByRole("region", { name: REQUIRED_SECTION });
      await expect(section).toHaveCount(1);
      await expect(
        section.getByRole("heading", { name: REQUIRED_SECTION }),
      ).toBeVisible();
    });
  });
}
