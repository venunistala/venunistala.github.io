import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { getCaseStudySlugs } from "../src/lib/content";

// Case study routes are derived from the content directory rather than listed
// here. A hand-maintained list is a list that eventually disagrees with the
// site, and its failure mode is silent: a new route that nothing scans.
const ROUTES = [
  "/",
  "/quality-lab/",
  "/how-this-site-is-tested/",
  "/resume/",
  ...getCaseStudySlugs().map((slug) => `/work/${slug}/`),
];

// Phase 4 splits this into one spec per route and adds keyboard and
// console-error coverage. It exists now, rather than after Phase 3, because
// the charter rule is that *every* route gets an axe scan — not something to
// defer while shipping four unscanned routes.
for (const route of ROUTES) {
  test(`${route} renders with a single h1 and no axe violations`, async ({
    page,
  }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);

    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

    const { violations } = await new AxeBuilder({ page }).analyze();

    // toEqual([]) rather than a length check: when this fails the diff prints
    // the offending rules and nodes, which is the information you actually need.
    expect(violations).toEqual([]);
  });
}
