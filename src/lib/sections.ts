/**
 * Body-level requirements for case studies.
 *
 * Pure, like the frontmatter validator: takes the MDX body as a string and
 * either passes or throws. No fs, no Next.
 *
 * Phase 1 argued that for a test engineer, knowing the boundary of your own
 * gate is the credential — so a case study that claims what it blocks without
 * saying what it misses is the one shape this site should not be able to
 * publish. Enforcing it here makes that a gate rather than a good intention.
 *
 * Only the limitations section is required. The other three headings in the
 * placeholder files are a suggested shape, not a rule — requiring all four
 * would impose a template that was never agreed.
 */

export const REQUIRED_SECTION = "What it still doesn't catch";

/** Curly apostrophes, casing and surrounding space must not decide this. */
function normalizeHeading(heading: string): string {
  return heading.replace(/[‘’ʼ]/g, "'").trim().toLowerCase();
}

/** Every ATX heading in the body, at any level, normalized. */
export function headingsIn(body: string): string[] {
  return Array.from(body.matchAll(/^#{1,6}[ \t]+(.+?)[ \t]*#*$/gm)).map(
    (match) => normalizeHeading(match[1]),
  );
}

export function assertRequiredSections(body: string, source: string): void {
  const required = normalizeHeading(REQUIRED_SECTION);
  if (!headingsIn(body).includes(required)) {
    throw new Error(
      `${source} is missing its required "${REQUIRED_SECTION}" section. ` +
        `A case study that states what it blocks without stating what it misses ` +
        `is the one thing this site does not publish.`,
    );
  }
}
