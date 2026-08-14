/**
 * Frontmatter validation for case studies.
 *
 * Deliberately pure: no fs, no Next imports, no I/O. It takes whatever YAML
 * parsing produced and either returns a typed object or throws with a message
 * that names the file and the field. That makes it unit-testable in isolation
 * (Phase 4) and keeps the failure mode loud — a case study with bad
 * frontmatter fails the build rather than rendering with holes in it.
 */

export type CaseStudyMeta = {
  readonly title: string;
  readonly slug: string;
  readonly role: string;
  readonly period: string;
  readonly stack: readonly string[];
  readonly summary: string;
};

/** The six fields, exactly as specified. Order is the render order. */
const STRING_FIELDS = [
  "title",
  "slug",
  "role",
  "period",
  "summary",
] as const satisfies readonly (keyof CaseStudyMeta)[];

class FrontmatterError extends Error {
  constructor(source: string, detail: string) {
    super(`Invalid frontmatter in ${source}: ${detail}`);
    this.name = "FrontmatterError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireNonEmptyString(
  value: unknown,
  field: string,
  source: string,
): string {
  if (typeof value !== "string") {
    throw new FrontmatterError(
      source,
      `"${field}" must be a string, got ${value === undefined ? "nothing" : typeof value}`,
    );
  }
  const trimmed = value.trim();
  if (trimmed === "") {
    throw new FrontmatterError(source, `"${field}" must not be empty`);
  }
  return trimmed;
}

function requireStack(value: unknown, source: string): readonly string[] {
  if (!Array.isArray(value)) {
    throw new FrontmatterError(
      source,
      `"stack" must be a list, got ${value === undefined ? "nothing" : typeof value}`,
    );
  }
  if (value.length === 0) {
    throw new FrontmatterError(source, `"stack" must list at least one entry`);
  }
  return value.map((entry, i) =>
    requireNonEmptyString(entry, `stack[${i}]`, source),
  );
}

/**
 * Validate raw frontmatter for one case study.
 *
 * @param raw          whatever the YAML parser returned
 * @param expectedSlug the filename stem, e.g. "case-study-one" for
 *                     content/work/case-study-one.mdx
 * @param source       path used in error messages
 */
export function parseFrontmatter(
  raw: unknown,
  expectedSlug: string,
  source: string = `${expectedSlug}.mdx`,
): CaseStudyMeta {
  if (!isRecord(raw)) {
    throw new FrontmatterError(source, "expected a block of key/value pairs");
  }

  const known = new Set<string>([...STRING_FIELDS, "stack"]);
  const unknownKeys = Object.keys(raw).filter((key) => !known.has(key));
  if (unknownKeys.length > 0) {
    // Unknown keys are almost always typos, and a typo'd field would
    // otherwise silently render as missing.
    throw new FrontmatterError(
      source,
      `unknown field(s): ${unknownKeys.join(", ")}`,
    );
  }

  const parsed = Object.fromEntries(
    STRING_FIELDS.map((field) => [
      field,
      requireNonEmptyString(raw[field], field, source),
    ]),
  ) as Record<(typeof STRING_FIELDS)[number], string>;

  if (parsed.slug !== expectedSlug) {
    // If these disagree there is no non-arbitrary way to pick a winner, and
    // the URL would stop matching the file it came from.
    throw new FrontmatterError(
      source,
      `"slug" is "${parsed.slug}" but the file is named "${expectedSlug}.mdx" — they must match`,
    );
  }

  return {
    title: parsed.title,
    slug: parsed.slug,
    role: parsed.role,
    period: parsed.period,
    stack: requireStack(raw.stack, source),
    summary: parsed.summary,
  };
}
