import type { Metadata } from "next";
import { SiteLink } from "@/components/SiteLink";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Quality lab",
  description:
    "Field-tested patterns for test automation, drawn from real delivery work.",
};

const PATTERNS = [
  {
    title: "Lock–release coordination for shared test data",
    used: "ESDC — parallel end-to-end suites sharing credentials and data files.",
    body: "When parallel suites share credentials and data files with no coordination, failures stop meaning anything: a red build might be a product defect or a data collision. A lock–release approach to the shared resources removed the collisions by construction, cutting flakiness in parallel executions by 50% and letting regression time fall 60% once the CI/CD orchestration was optimised around it.",
    limit:
      "Coordination removes collisions; it does not validate the data. A row can be correctly locked and still be the wrong row.",
  },
  {
    title: "Test data governance over shared environments",
    used: "EDC CEBA — client and QA data coexisting in the same environments.",
    body: "A detailed test data strategy and governance model defined who owned what data across shared environments, so client and QA data stopped conflicting. Test data setup time fell 50%. The same principle was later formalised as pipelines that generate test data on demand rather than hand-maintaining it.",
    limit:
      "Governance prevents conflicts; it cannot prove the governed data is semantically correct for the test.",
  },
  {
    title: "Dashboard-driven test governance",
    used: "ESDC — Azure Dashboards tracking regression scope and automation coverage.",
    body: "Dashboards that track regression scope and automation coverage turn gaps into something stakeholders can see, rather than something discovered at release time. Combined with an automation strategy and branching strategy for a shared repository, they make drift visible and adoption the path of least resistance.",
    limit:
      "Dashboards report what the automation knows. Work tested outside the framework is invisible to them.",
  },
  {
    title: "Live reporting instead of manual updates",
    used: "Tecsys R&D — Jira Xray connected with Katalon Studio.",
    body: "Connecting test management with the execution tool makes regression results report themselves. Manual updates are not just slow — they lag reality, and the lag is invisible. Live reporting removes the lag by construction.",
    limit:
      "Live results show what the suites checked. Untested paths have no results to report, and a green board can quietly mean narrow coverage.",
  },
];

export default function QualityLabPage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[2rem] leading-tight tracking-[-0.012em] text-balance">
          Quality lab
        </h1>
        <p className="max-w-[68ch] font-sans text-sm text-muted">
          Patterns from real delivery work — each one earned on an engagement,
          each one kept honest about what it cannot do. The case studies in{" "}
          <SiteLink
            href="/#work"
            className="underline decoration-rule underline-offset-4 hover:decoration-trace"
          >
            Work
          </SiteLink>{" "}
          show these patterns in context.
        </p>
      </div>

      {PATTERNS.map(({ title, used, body, limit }, index) => (
        <Reveal key={title} delay={index * 60}>
          <section aria-labelledby={title} className="flex flex-col gap-2">
            <h2
              id={title}
              className="border-b border-rule pb-2 font-sans text-xs font-semibold tracking-[0.11em] text-muted uppercase"
            >
              {title}
            </h2>
            <p className="font-mono text-[0.75rem] text-muted">{used}</p>
            <p className="max-w-[68ch] font-sans text-sm">{body}</p>
            <p className="max-w-[68ch] font-sans text-sm text-muted">
              Limit: {limit}
            </p>
          </section>
        </Reveal>
      ))}
    </>
  );
}
