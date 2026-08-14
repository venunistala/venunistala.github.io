import { SiteLink } from "@/components/SiteLink";
import { QualityStrip } from "@/components/QualityStrip";
import { getAllCaseStudies } from "@/lib/content";

export default function Home() {
  const studies = getAllCaseStudies();

  return (
    <>
      {/* No hero. The identity block and the evidence beneath it are set at
          the same weight on purpose: the claim and the thing that backs it
          are read together, rather than the claim being announced and the
          evidence filed below the fold. */}
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[2rem] leading-tight tracking-[-0.012em] text-balance">
          Venu Nistala
        </h1>
        <p className="font-sans text-muted">SDET and test platform engineer.</p>
      </div>

      {/* Renders nothing until CI writes public/quality.json in Phase 5. An
          empty strip is the correct state when there is no run to report. */}
      <QualityStrip />

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
          <table className="w-full min-w-[46rem] border-collapse text-left align-top">
            <caption className="sr-only">
              Case studies, ordered by slug. Each links to its full write-up.
            </caption>
            <thead>
              <tr className="border-b border-rule">
                {["Title", "Role", "Period", "Summary"].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="py-2 pe-6 font-mono text-[0.6875rem] font-normal tracking-[0.07em] text-muted uppercase"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studies.map(({ meta }) => (
                <tr
                  key={meta.slug}
                  className="border-b border-rule align-baseline"
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
                      className="font-serif text-base text-ink underline decoration-rule underline-offset-4 hover:decoration-trace"
                    >
                      {meta.title}
                    </SiteLink>
                  </th>
                  <td className="py-3 pe-6 font-sans text-sm">{meta.role}</td>
                  <td className="py-3 pe-6 font-mono text-[0.8125rem] whitespace-nowrap">
                    {meta.period}
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
    </>
  );
}
