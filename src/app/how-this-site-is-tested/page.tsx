import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How this site is tested",
  description:
    "The pipeline that gates this site, and the defects it cannot see.",
};

const STEPS = [
  {
    name: "format:check",
    detail: "Prettier. Style disagreements never reach a reviewer.",
  },
  {
    name: "lint",
    detail: "ESLint with zero warnings allowed. Warnings fail the run.",
  },
  {
    name: "typecheck",
    detail: "TypeScript strict. Types are load-bearing in this codebase.",
  },
  {
    name: "build",
    detail:
      "A standalone static export first, so a broken build fails with the compiler's own message rather than as a server that never came up.",
  },
  {
    name: "test",
    detail:
      "Vitest unit tests for the pure layers: frontmatter validation, section structure, quality-report parsing.",
  },
  {
    name: "Gate, run 1 — measure",
    detail:
      "Playwright builds the export, serves the exact files that would deploy, and runs every spec against them, including an axe scan of every route. The reports from this run are what CI totals into the quality report.",
  },
  {
    name: "Gate, run 2 — validate",
    detail:
      "The built export now embeds the quality report, so this run tests the strip itself — the first time it is ever rendered and scanned. The bytes this run leaves behind are the bytes that deploy; nothing is rebuilt after the last test touches it.",
  },
  {
    name: ".nojekyll check",
    detail:
      "Verifies the file survived into the export. GitHub Pages runs a Jekyll pass that strips directories starting with an underscore, which would silently remove the JavaScript bundles.",
  },
];

export default function HowThisSiteIsTestedPage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[2rem] leading-tight tracking-[-0.012em] text-balance">
          How this site is tested
        </h1>
        <p className="max-w-[68ch] font-sans text-sm text-muted">
          Every push to main runs the same gate. The deployed site is never
          rebuilt after its last test — what was tested is what ships.
        </p>
      </div>

      <section aria-labelledby="pipeline" className="flex flex-col gap-3">
        <h2
          id="pipeline"
          className="border-b border-rule pb-2 font-sans text-xs font-semibold tracking-[0.11em] text-muted uppercase"
        >
          The pipeline
        </h2>
        <ol className="flex max-w-[68ch] list-decimal flex-col gap-3 ps-5 font-sans text-sm">
          {STEPS.map(({ name, detail }) => (
            <li key={name}>
              <span className="font-mono text-[0.8125rem]">{name}</span>
              {" — "}
              {detail}
            </li>
          ))}
        </ol>
      </section>

      <section
        aria-label="What the gate cannot see"
        className="flex flex-col gap-4 border border-ink p-6"
      >
        <h2 className="font-sans text-sm font-semibold">
          What the gate cannot see
        </h2>
        <ul className="flex max-w-[68ch] list-disc flex-col gap-2 ps-5 font-sans text-sm">
          <li>
            The axe scan covers a subset of WCAG. A clean scan is not a usable
            site — it is the absence of the defects a scanner can detect.
          </li>
          <li>
            The specs assert what was written, not what was forgotten. A route
            nobody wrote a spec for is a route nobody checks.
          </li>
          <li>
            No test runs against production. The gate tests the export as built
            locally; the deployed environment can still differ.
          </li>
          <li>
            The quality report embedded in the export describes the run that
            produced it. It is a measurement of the past, not a guarantee of the
            next change.
          </li>
        </ul>
      </section>
    </>
  );
}
