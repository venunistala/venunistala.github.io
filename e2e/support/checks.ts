import { AxeBuilder } from "@axe-core/playwright";
import { expect, type Page, type Response } from "@playwright/test";

/**
 * Shared assertions for the per-route specs.
 *
 * Lives under e2e/support/ rather than beside the specs because Playwright's
 * default testMatch only picks up *.spec.ts — a helper file that got collected
 * as a suite with no tests in it would fail the run.
 */

/**
 * Navigate, collecting anything the browser complained about on the way.
 *
 * The listeners must be attached before the navigation, not after: errors
 * raised during initial evaluation would otherwise be missed entirely and the
 * assertion would pass for the wrong reason.
 */
export async function gotoCollectingConsole(
  page: Page,
  route: string,
): Promise<{ response: Response | null; consoleErrors: string[] }> {
  const consoleErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => {
    consoleErrors.push(`pageerror: ${error.message}`);
  });

  const response = await page.goto(route);
  return { response, consoleErrors };
}

export async function expectRenders(
  page: Page,
  response: Response | null,
  heading: string,
): Promise<void> {
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
}

export async function expectNoAxeViolations(page: Page): Promise<void> {
  const { violations } = await new AxeBuilder({ page }).analyze();
  // toEqual([]) rather than a length check: on failure the diff prints the
  // offending rules and nodes, which is the information you actually need.
  expect(violations).toEqual([]);
}

/**
 * Every link in the header must be reachable with Tab alone.
 *
 * The expected hrefs are read from the page rather than hard-coded, so adding
 * a nav item extends the assertion instead of quietly escaping it.
 */
export async function expectNavReachableByKeyboard(page: Page): Promise<void> {
  const navHrefs = await page
    .locator("header a")
    .evaluateAll((links) =>
      links.map((link) => link.getAttribute("href") ?? ""),
    );
  expect(navHrefs.length).toBeGreaterThan(0);

  const focused: string[] = [];
  // Bounded rather than "until we find them all": an unbounded walk over a
  // broken tab order would hang instead of failing.
  for (let i = 0; i < navHrefs.length + 4; i++) {
    await page.keyboard.press("Tab");
    const href = await page.evaluate(() => {
      const element = document.activeElement;
      return element instanceof HTMLAnchorElement
        ? element.getAttribute("href")
        : null;
    });
    if (href !== null) focused.push(href);
  }

  expect(focused).toEqual(expect.arrayContaining(navHrefs));
}

/**
 * The skip link is the first thing Tab reaches, and it targets something that
 * exists. A skip link pointing at a missing id is worse than none: it is an
 * accessibility affordance that silently does nothing, and axe does not check
 * that the target resolves.
 */
export async function expectSkipLinkWorks(page: Page): Promise<void> {
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();

  const target = await skipLink.getAttribute("href");
  expect(target).toBe("#main");
  await expect(page.locator("#main")).toHaveCount(1);
}

/** Everything every route must satisfy. */
export async function expectCleanRoute(
  page: Page,
  route: string,
  heading: string,
): Promise<void> {
  const { response, consoleErrors } = await gotoCollectingConsole(page, route);

  await expectRenders(page, response, heading);
  await expectNoAxeViolations(page);
  await expectNavReachableByKeyboard(page);

  expect(consoleErrors).toEqual([]);
}
