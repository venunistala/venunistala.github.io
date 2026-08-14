import { expect, test } from "@playwright/test";
import {
  expectCleanRoute,
  expectSkipLinkWorks,
  gotoCollectingConsole,
} from "./support/checks";
import { getAllCaseStudies } from "../src/lib/content";
import { readQualityReport } from "../src/lib/quality";

test.describe("/", () => {
  test("renders, scans clean, and is keyboard reachable", async ({ page }) => {
    await expectCleanRoute(page, "/", "Venu Nistala");
  });

  test("skip link is the first tab stop and points at #main", async ({
    page,
  }) => {
    await page.goto("/");
    await expectSkipLinkWorks(page);
  });

  test("work index lists every case study, linked", async ({ page }) => {
    await page.goto("/");
    const studies = getAllCaseStudies();

    const rows = page.getByRole("table").getByRole("row");
    // Header row plus one per case study.
    await expect(rows).toHaveCount(studies.length + 1);

    for (const { meta } of studies) {
      await expect(
        page.getByRole("link", { name: meta.title, exact: true }),
      ).toHaveAttribute("href", `/work/${meta.slug}/`);
    }
  });

  test("quality strip reflects the report, and shows nothing without one", async ({
    page,
  }) => {
    // Written as an invariant rather than a snapshot of today. Right now
    // there is no public/quality.json and the honest output is nothing at
    // all; once CI writes one in Phase 5 this same assertion checks that
    // every present field is rendered and every absent one is not. A test
    // that only asserted "no strip" would have to be rewritten the moment
    // the feature started working, which is when you least want to be
    // editing its test.
    const { consoleErrors } = await gotoCollectingConsole(page, "/");
    const report = readQualityReport();
    const tail = page.getByText("what this run does not prove");

    if (report === null) {
      await expect(tail).toHaveCount(0);
    } else {
      await expect(tail).toHaveCount(1);
      const strip = page.getByRole("main").locator("div", { has: tail });
      for (const [label, value] of [
        ["Tests", report.tests],
        ["Axe violations", report.axeViolations],
        ["Commit", report.commit],
        ["Run", report.timestamp],
      ] as const) {
        if (value === undefined) {
          await expect(strip.getByText(label, { exact: true })).toHaveCount(0);
        } else {
          await expect(
            strip.getByText(String(value), { exact: true }),
          ).toHaveCount(1);
        }
      }
    }

    expect(consoleErrors).toEqual([]);
  });
});
