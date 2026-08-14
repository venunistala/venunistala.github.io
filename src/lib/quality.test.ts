import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseQualityReport, readQualityReport } from "./quality";

const full = {
  tests: 47,
  axeViolations: 0,
  commit: "3b38825",
  timestamp: "2026-08-13T20:18:07Z",
};

describe("parseQualityReport", () => {
  it("accepts a complete report", () => {
    expect(parseQualityReport(full)).toEqual(full);
  });

  // Every field is optional by design: Phase 5's rule is that a number which
  // cannot be produced by a real run is omitted rather than defaulted.
  it("accepts a partial report, leaving absent fields undefined", () => {
    expect(parseQualityReport({ tests: 47 })).toEqual({
      tests: 47,
      axeViolations: undefined,
      commit: undefined,
      timestamp: undefined,
    });
  });

  it("accepts an empty report", () => {
    expect(parseQualityReport({}).tests).toBeUndefined();
  });

  it("does not invent zeros for missing counts", () => {
    // The distinction this whole element exists to preserve: "measured zero"
    // and "did not measure" must not render identically.
    expect(parseQualityReport({}).axeViolations).not.toBe(0);
  });

  it.each([
    ["a negative count", { tests: -1 }, /"tests" must be a non-negative/],
    ["a fractional count", { tests: 1.5 }, /"tests" must be a non-negative/],
    ["a stringified count", { tests: "47" }, /"tests" must be a non-negative/],
    ["a short sha", { commit: "abc" }, /"commit" must be a hex SHA/],
    ["a non-hex sha", { commit: "zzzzzzz" }, /"commit" must be a hex SHA/],
    [
      "a local timestamp",
      { timestamp: "2026-08-13 20:18:07" },
      /"timestamp" must be a UTC ISO 8601/,
    ],
    [
      "an offset timestamp",
      { timestamp: "2026-08-13T20:18:07+01:00" },
      /"timestamp" must be a UTC ISO 8601/,
    ],
    [
      "an impossible date",
      { timestamp: "2026-13-45T99:99:99Z" },
      /"timestamp" must be a UTC ISO 8601/,
    ],
  ])("rejects %s", (_label, input, message) => {
    expect(() => parseQualityReport(input)).toThrow(message);
  });

  it("accepts a full 40-character sha", () => {
    const commit = "29f64709e31c1b23f80459fe0d4da69f2fd53b64";
    expect(parseQualityReport({ commit }).commit).toBe(commit);
  });

  it("accepts fractional seconds in the timestamp", () => {
    const timestamp = "2026-08-13T20:18:07.123Z";
    expect(parseQualityReport({ timestamp }).timestamp).toBe(timestamp);
  });

  it("rejects unknown fields rather than ignoring them", () => {
    expect(() => parseQualityReport({ coverage: 91 })).toThrow(
      /unknown field\(s\): coverage/,
    );
  });

  it.each([null, [], "text", 7])("rejects %s as a report", (input) => {
    expect(() => parseQualityReport(input)).toThrow(/expected a JSON object/);
  });
});

describe("public/quality.json", () => {
  const path = join(process.cwd(), "public", "quality.json");

  // Asserts something real in both states rather than skipping when the file
  // is absent. A skipped test is a test nobody notices has stopped running,
  // which is the false confidence this site is an argument against. Today
  // there is no file and null is correct; once CI writes one in Phase 5 the
  // other branch takes over without this test being edited.
  it("matches the expected shape when present, and reads as null when not", () => {
    if (!existsSync(path)) {
      expect(readQualityReport()).toBeNull();
      return;
    }

    const raw: unknown = JSON.parse(readFileSync(path, "utf8"));
    expect(() => parseQualityReport(raw, "public/quality.json")).not.toThrow();

    const report = readQualityReport();
    expect(report).not.toBeNull();
    // A file that exists but carries nothing means CI produced no numbers,
    // which is a broken pipeline rather than an empty one.
    expect(Object.values(report ?? {}).some((v) => v !== undefined)).toBe(true);
  });
});
