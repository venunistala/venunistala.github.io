/**
 * Body-level structure for case studies.
 *
 * Pure, like the frontmatter validator: takes the MDX body as a string and
 * either passes, throws, or returns slices of it. No fs, no Next.
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

export type Heading = {
  /** Zero-based line index in the body. */
  readonly line: number;
  /** 1-6, from the number of leading hashes. */
  readonly level: number;
  /** Normalized heading text. */
  readonly text: string;
};

/** Curly apostrophes, casing and surrounding space must not decide this. */
function normalizeHeading(heading: string): string {
  return heading.replace(/[‘’ʼ]/g, "'").trim().toLowerCase();
}

const HEADING = /^(#{1,6})[ \t]+(.+?)[ \t]*#*$/;
const FENCE = /^[ \t]*(```+|~~~+)/;

/**
 * Every ATX heading in the body, in document order.
 *
 * Fenced code blocks are skipped. A case study may well contain a shell
 * transcript or a diff, and a `#` comment inside one is not a section — it
 * must not be able to satisfy the required-section gate.
 */
export function scanHeadings(body: string): Heading[] {
  const headings: Heading[] = [];
  let fence: string | null = null;

  body.split(/\r?\n/).forEach((line, index) => {
    const fenceMatch = FENCE.exec(line);
    if (fenceMatch) {
      const marker = fenceMatch[1][0];
      if (fence === null) fence = marker;
      else if (fence === marker) fence = null;
      return;
    }
    if (fence !== null) return;

    const match = HEADING.exec(line);
    if (match) {
      headings.push({
        line: index,
        level: match[1].length,
        text: normalizeHeading(match[2]),
      });
    }
  });

  return headings;
}

export function assertRequiredSections(body: string, source: string): void {
  const required = normalizeHeading(REQUIRED_SECTION);
  if (!scanHeadings(body).some((heading) => heading.text === required)) {
    throw new Error(
      `${source} is missing its required "${REQUIRED_SECTION}" section. ` +
        `A case study that states what it blocks without stating what it misses ` +
        `is the one thing this site does not publish.`,
    );
  }
}

export type SplitBody = {
  /** Everything before the required section. */
  readonly before: string;
  /** The required section including its heading, or null if absent. */
  readonly section: string | null;
  /** Everything after it, so document order is preserved. */
  readonly after: string;
};

/**
 * Split the body around the required section so it can be rendered as the
 * one boxed element on the page.
 *
 * Returned in three parts rather than two so the section is boxed *in place*.
 * Hoisting it to the end would be tidier to render and would silently reorder
 * what the author wrote.
 *
 * The section runs from its heading to the next heading of the same or higher
 * level, which is how a reader would scope it too.
 */
export function splitRequiredSection(body: string): SplitBody {
  const required = normalizeHeading(REQUIRED_SECTION);
  const headings = scanHeadings(body);
  const start = headings.find((heading) => heading.text === required);
  if (!start) return { before: body, section: null, after: "" };

  const next = headings.find(
    (heading) => heading.line > start.line && heading.level <= start.level,
  );
  const lines = body.split(/\r?\n/);
  const end = next ? next.line : lines.length;

  return {
    before: lines.slice(0, start.line).join("\n").trim(),
    section: lines.slice(start.line, end).join("\n").trim(),
    after: lines.slice(end).join("\n").trim(),
  };
}
