import { SiteLink } from "@/components/SiteLink";
import { readQualityReport } from "@/lib/quality";

/**
 * The signature element.
 *
 * A single band bounded by hairlines, set entirely in mono because every
 * value in it was emitted by a machine. It states counts and provenance and
 * draws no conclusion — there is no badge, no tick and no "passing" shield.
 * A badge asserts; a number next to a SHA can be checked.
 *
 * Three rules are load-bearing:
 *
 *  - A missing field renders as absent. Not a dash, not "n/a", not zero. A
 *    defaulted number is indistinguishable from a real one at a glance, and
 *    a zero meaning "we did not measure" is the failure this site argues
 *    against.
 *  - The timestamp is the literal ISO string, never "3 days ago". Relative
 *    time is non-deterministic and would destabilise its own test.
 *  - The tail link names the limitation, not the achievement.
 */

type Cell = { label: string; value: string; verifiable?: boolean };

export function QualityStrip() {
  const report = readQualityReport();
  if (!report) return null;

  const cells: Cell[] = [];
  if (report.tests !== undefined) {
    cells.push({ label: "Tests", value: String(report.tests) });
  }
  if (report.axeViolations !== undefined) {
    cells.push({
      label: "Axe violations",
      value: String(report.axeViolations),
    });
  }
  if (report.commit !== undefined) {
    cells.push({ label: "Commit", value: report.commit, verifiable: true });
  }
  if (report.timestamp !== undefined) {
    cells.push({ label: "Run", value: report.timestamp, verifiable: true });
  }

  // A report that parsed but carries nothing renders nothing.
  if (cells.length === 0) return null;

  return (
    <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 border-y border-rule py-3 font-mono text-[0.8125rem]">
      {cells.map(({ label, value, verifiable }) => (
        <div key={label} className="flex items-baseline gap-2">
          <span className="text-[0.6875rem] tracking-[0.07em] text-muted uppercase">
            {label}
          </span>
          <span className={verifiable ? "text-trace" : "text-ink"}>
            {value}
          </span>
        </div>
      ))}
      <SiteLink
        href="/how-this-site-is-tested/"
        className="text-[0.6875rem] text-trace underline decoration-rule underline-offset-4 hover:decoration-trace ms-auto"
      >
        what this run does not prove →
      </SiteLink>
    </div>
  );
}
