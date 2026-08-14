#!/usr/bin/env node
/**
 * Write public/quality.json from the output of a real run.
 *
 * The governing rule, from the brief: if a number cannot be produced by a real
 * run, omit the field rather than defaulting it. Every branch here either
 * derives a value from a report file on disk or leaves the field out. Nothing
 * falls back to zero, because a zero that means "not measured" is
 * indistinguishable on the page from a zero that was measured — which is the
 * failure this whole site is an argument against.
 *
 * Deliberately not validated here. src/lib/quality.ts validates on read, so a
 * malformed file fails the very next build. Duplicating the rules in the
 * writer would let the two drift and give two answers to one question.
 */
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const RESULTS = join(ROOT, "reports");
const TARGET = join(ROOT, "public", "quality.json");

const omitted = [];

function readJson(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    console.warn(`  ! ${path} is not readable JSON: ${error.message}`);
    return null;
  }
}

/** Total tests across both suites, or undefined if either half is missing. */
function countTests() {
  const playwright = readJson(join(RESULTS, "playwright.json"));
  const vitest = readJson(join(RESULTS, "vitest.json"));

  const stats = playwright?.stats;
  const e2e =
    stats === undefined
      ? undefined
      : (stats.expected ?? 0) +
        (stats.unexpected ?? 0) +
        (stats.flaky ?? 0) +
        (stats.skipped ?? 0);
  const unit =
    typeof vitest?.numTotalTests === "number"
      ? vitest.numTotalTests
      : undefined;

  if (e2e === undefined || unit === undefined) {
    // Reporting only the half we have would publish a total that is simply
    // wrong, presented with the same confidence as a correct one.
    omitted.push(
      `tests (e2e=${e2e ?? "missing"}, unit=${unit ?? "missing"} — need both)`,
    );
    return undefined;
  }
  return e2e + unit;
}

/** Summed from what the axe scans actually recorded, never inferred. */
function countAxeViolations() {
  const dir = join(RESULTS, "axe");
  if (!existsSync(dir)) {
    omitted.push("axeViolations (no axe results on disk)");
    return undefined;
  }
  const files = readdirSync(dir).filter((name) => name.endsWith(".json"));
  if (files.length === 0) {
    omitted.push("axeViolations (axe results directory is empty)");
    return undefined;
  }
  let total = 0;
  for (const file of files) {
    const result = readJson(join(dir, file));
    if (typeof result?.violations !== "number") {
      omitted.push(`axeViolations (${file} has no violations count)`);
      return undefined;
    }
    total += result.violations;
  }
  console.log(`  axe: ${files.length} route scans totalling ${total}`);
  return total;
}

function commitSha() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
    }).trim();
  } catch {
    omitted.push("commit (no GITHUB_SHA and git rev-parse failed)");
    return undefined;
  }
}

const report = {};
const tests = countTests();
if (tests !== undefined) report.tests = tests;

const axeViolations = countAxeViolations();
if (axeViolations !== undefined) report.axeViolations = axeViolations;

const commit = commitSha();
if (commit !== undefined) report.commit = commit;

// The one field always producible: the moment this run wrote its report.
report.timestamp = new Date().toISOString().replace(/\.\d+Z$/, "Z");

mkdirSync(join(ROOT, "public"), { recursive: true });
writeFileSync(TARGET, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(`\nWrote public/quality.json:`);
console.log(JSON.stringify(report, null, 2));
if (omitted.length > 0) {
  console.log(`\nOmitted rather than defaulted:`);
  for (const reason of omitted) console.log(`  - ${reason}`);
}
