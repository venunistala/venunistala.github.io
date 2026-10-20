import { SiteLink } from "@/components/SiteLink";
import { QualityStrip } from "@/components/QualityStrip";
import { Reveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { getAllCaseStudies } from "@/lib/content";

const STATS = [
  { value: 5, suffix: "+", caption: "Years in test automation" },
  { value: 60, suffix: "%", caption: "Regression execution time reduced" },
  { value: 32, suffix: "+", caption: "Teams migrated from HP ALM to Jira" },
  {
    value: 10,
    suffix: "+",
    caption: "Product teams on one automation strategy",
  },
] as const;

export default function Home() {
  const studies = getAllCaseStudies();

  return (
    <>
      {/* The identity block: the claim, then the numbers that back it, then
          the way to read the evidence. The h1 text is pinned by the test
          gate — expectCleanRoute asserts it — so it stays exactly this. */}
      <div className="relative">
        {/* Decorative dot field, drawn with the rule colour at low density.
            Per the tokens' charter it identifies nothing: delete it and no
            meaning is lost. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-6 -top-6 h-[130%] opacity-60 [background-image:radial-gradient(var(--color-rule)_1px,transparent_1.5px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_20%,black,transparent)]"
        />
        <Reveal className="relative flex flex-col gap-4">
          <h1 className="font-serif text-[2.75rem] leading-[1.05] tracking-[-0.02em] text-balance sm:text-[3.5rem]">
            Venu Nistala
          </h1>
          <p className="font-sans text-lg text-muted">Test Automation Lead.</p>
          <p className="max-w-[62ch] font-sans text-muted">
            Five-plus years building scalable test automation for enterprise
            programs — frameworks, test-data systems, and CI/CD quality gates
            that make regression trustworthy.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <SiteLink
              href="/#work"
              className="border border-ink px-4 py-2 font-sans text-sm text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
            >
              View selected work
            </SiteLink>
            <SiteLink
              href="/resume/"
              className="border border-rule px-4 py-2 font-sans text-sm text-muted transition-colors duration-300 hover:border-ink hover:text-ink"
            >
              Read the résumé
            </SiteLink>
          </div>
        </Reveal>
      </div>

      {/* The numbers are animations of facts from the résumé, never new
          facts: 5+ years, 60% reduction, 32+ teams, 10+ product teams. This
          is intentionally not a description list — the home page may only
          ever contain the one description list the gate checks, the quality
          strip, so stats are plain markup here. */}
      <Reveal delay={120}>
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 border-y border-rule py-6 sm:grid-cols-4">
          {STATS.map(({ value, suffix, caption }) => (
            <div key={caption} className="flex flex-col gap-1">
              <p className="font-serif text-[2.25rem] leading-none">
                <Counter value={value} suffix={suffix} />
              </p>
              <p className="font-sans text-xs text-muted">{caption}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Renders nothing until CI writes public/quality.json in Phase 5. An
          empty strip is the correct state when there is no run to report. */}
      <QualityStrip />

      <Reveal>
        <section aria-labelledby="work" className="flex flex-col gap-3">
          <h2
            id="work"
            className="border-b border-rule pb-2 font-sans text-xs font-semibold tracking-[0.11em] text-muted uppercase"
          >
            Work
          </h2>

          {/* A table, not a card grid. The reference format for this discipline
              is a report. Scrolls in its own box so the page never does.

              The min-width matters: without it, a narrow viewport compresses the
              summary column until its text wraps to a dozen lines, and every row
              inherits that height as empty space beside a two-word title. The
              table keeps its proportions and scrolls sideways instead, which
              also means no column has to be hidden to make small screens work. */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] border-collapse text-left align-top">
              <caption className="sr-only">
                Case studies, ordered by slug. Each links to its full write-up.
              </caption>
              <thead>
                <tr className="border-b border-rule">
                  {["Title", "Role", "Period", "Stack", "Summary"].map(
                    (heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="py-2 pe-6 font-mono text-[0.6875rem] font-normal tracking-[0.07em] text-muted uppercase"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {studies.map(({ meta }) => (
                  <tr
                    key={meta.slug}
                    className="group border-b border-rule align-baseline transition-colors duration-300 hover:bg-ink/[0.035]"
                  >
                    {/* min-w on the title, not on the summary. Auto table
                        layout hands width to whichever column demands it, so a
                        min-width on the prose column starves the title into
                        wrapping one word per line. */}
                    <th
                      scope="row"
                      className="min-w-[15ch] py-3 pe-6 font-normal"
                    >
                      <SiteLink
                        href={`/work/${meta.slug}/`}
                        className="font-serif text-base text-ink underline decoration-rule underline-offset-4 transition-colors duration-300 group-hover:decoration-trace hover:decoration-trace"
                      >
                        {meta.title}
                      </SiteLink>
                    </th>
                    <td className="py-3 pe-6 font-sans text-sm">{meta.role}</td>
                    <td className="py-3 pe-6 font-mono text-[0.8125rem] whitespace-nowrap">
                      {meta.period}
                    </td>
                    <td className="py-3 pe-6">
                      <ul
                        aria-label={`Technologies in ${meta.title}`}
                        className="flex max-w-[20ch] flex-wrap gap-1.5"
                      >
                        {meta.stack.map((tool) => (
                          <li
                            key={tool}
                            className="border border-rule px-2 py-0.5 font-mono text-[0.6875rem] whitespace-nowrap text-muted transition-all duration-300 group-hover:border-ink/30 group-hover:text-ink"
                          >
                            {tool}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-3 font-sans text-sm text-muted">
                      {meta.summary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Reveal>
    </>
  );
}
