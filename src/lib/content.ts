import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { parseFrontmatter, type CaseStudyMeta } from "./frontmatter";
import { assertRequiredSections } from "./sections";

/**
 * Filesystem access for the content layer. Runs at build time only — the site
 * is a static export, so by the time anything is served this module has
 * already been reduced to HTML.
 *
 * Frontmatter is read here and nowhere else. next-mdx-remote can parse
 * frontmatter itself, but then the work index and the case study page would
 * derive the same fields by two different routes and could disagree.
 */

const WORK_DIR = join(process.cwd(), "content", "work");

export type CaseStudy = {
  readonly meta: CaseStudyMeta;
  /** MDX body with the frontmatter block removed. */
  readonly body: string;
};

function readCaseStudyFile(slug: string): CaseStudy {
  const source = join("content", "work", `${slug}.mdx`);
  const raw = readFileSync(join(WORK_DIR, `${slug}.mdx`), "utf8");
  const { data, content } = matter(raw);
  const meta = parseFrontmatter(data, slug, source);
  assertRequiredSections(content, source);
  return { meta, body: content };
}

/**
 * Slugs of every case study, sorted.
 *
 * Sorted rather than left in readdir order because readdir order is
 * filesystem-dependent, and a route list that differs between a developer's
 * machine and CI is a test that fails for no reason.
 */
export function getCaseStudySlugs(): string[] {
  return readdirSync(WORK_DIR)
    .filter((name) => name.endsWith(".mdx"))
    .map((name) => name.replace(/\.mdx$/, ""))
    .sort();
}

export function getCaseStudy(slug: string): CaseStudy {
  return readCaseStudyFile(slug);
}

/**
 * Every case study, ordered by slug.
 *
 * There is no ordering field in the frontmatter contract, so alphabetical is
 * the only deterministic option available. If the work index should read in a
 * curated order, that needs a new field — say so and I will add one rather
 * than inferring an order from `period` strings.
 */
export function getAllCaseStudies(): CaseStudy[] {
  return getCaseStudySlugs().map(readCaseStudyFile);
}
