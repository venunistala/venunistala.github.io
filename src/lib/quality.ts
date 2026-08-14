import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * public/quality.json — written by CI from a real run, never by hand.
 *
 * Every field is optional, and that is the whole point. Phase 5's rule is
 * that a number which cannot be produced by a real run is omitted rather
 * than defaulted, so this type models a report where any field may be
 * missing and the renderer drops the cell entirely.
 *
 * Absence is expected and handled. Corruption is not: a field present with
 * the wrong shape throws, because a malformed report is a bug in CI and
 * should fail the build rather than quietly render as missing.
 */
export type QualityReport = {
  readonly tests?: number;
  readonly axeViolations?: number;
  readonly commit?: string;
  readonly timestamp?: string;
};

/**
 * Git's short form, for display only.
 *
 * The full SHA is what CI records and what the file keeps; seven characters is
 * what a reader copies into a compare view. Truncating for display is not
 * hiding anything — the short form resolves to exactly one commit — and it
 * stops a 40-character string dominating a line whose other values are
 * two-digit counts.
 */
export function shortCommit(sha: string): string {
  return sha.slice(0, 7);
}

const QUALITY_FILE = join(process.cwd(), "public", "quality.json");

const KNOWN_FIELDS = ["tests", "axeViolations", "commit", "timestamp"] as const;

class QualityReportError extends Error {
  constructor(source: string, detail: string) {
    super(`Invalid ${source}: ${detail}`);
    this.name = "QualityReportError";
  }
}

function optionalCount(
  value: unknown,
  field: string,
  source: string,
): number | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new QualityReportError(
      source,
      `"${field}" must be a non-negative integer, got ${JSON.stringify(value)}`,
    );
  }
  return value;
}

function optionalCommit(value: unknown, source: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string" || !/^[0-9a-f]{7,40}$/i.test(value)) {
    throw new QualityReportError(
      source,
      `"commit" must be a hex SHA of 7-40 characters, got ${JSON.stringify(value)}`,
    );
  }
  return value;
}

function optionalTimestamp(value: unknown, source: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  // Rendered verbatim, so it must already be a UTC ISO 8601 instant. No
  // reformatting: a value the reader can compare to a CI log is the point.
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(value) ||
    Number.isNaN(Date.parse(value))
  ) {
    throw new QualityReportError(
      source,
      `"timestamp" must be a UTC ISO 8601 instant, got ${JSON.stringify(value)}`,
    );
  }
  return value;
}

/** Pure: validates an already-parsed JSON value. Unit tested in Phase 4. */
export function parseQualityReport(
  raw: unknown,
  source = "quality.json",
): QualityReport {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new QualityReportError(source, "expected a JSON object");
  }
  const record = raw as Record<string, unknown>;

  const unknown = Object.keys(record).filter(
    (key) => !KNOWN_FIELDS.includes(key as (typeof KNOWN_FIELDS)[number]),
  );
  if (unknown.length > 0) {
    throw new QualityReportError(
      source,
      `unknown field(s): ${unknown.join(", ")}`,
    );
  }

  return {
    tests: optionalCount(record.tests, "tests", source),
    axeViolations: optionalCount(record.axeViolations, "axeViolations", source),
    commit: optionalCommit(record.commit, source),
    timestamp: optionalTimestamp(record.timestamp, source),
  };
}

/**
 * Read the report at build time, or null when there is nothing to read.
 *
 * Null is the honest state until CI exists (Phase 5). The strip renders
 * nothing at all rather than showing a shape with no numbers in it.
 */
export function readQualityReport(): QualityReport | null {
  if (!existsSync(QUALITY_FILE)) return null;
  return parseQualityReport(
    JSON.parse(readFileSync(QUALITY_FILE, "utf8")),
    "public/quality.json",
  );
}
