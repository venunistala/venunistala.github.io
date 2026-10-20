import type { Metadata } from "next";
import { SiteLink } from "@/components/SiteLink";

export const metadata: Metadata = {
  title: "Résumé",
  description:
    "Venu Gopal Nistala — Test Automation Lead. Factual record of roles, skills, projects, education, and certifications.",
};

const SKILLS: { label: string; items: string }[] = [
  {
    label: "Test automation",
    items: "Selenium WebDriver, WebDriverIO, Cucumber, TestNG, Robot Framework",
  },
  { label: "Languages", items: "Java, TypeScript, Python, C#" },
  {
    label: "DevOps & CI/CD",
    items: "Azure DevOps, Jenkins, Docker, YAML, BrowserStack",
  },
  {
    label: "Performance & monitoring",
    items: "JMeter, Grafana, InfluxDB, Elasticsearch, Dynatrace",
  },
  { label: "API & integration", items: "REST, SOAP, SoapUI, Postman" },
  { label: "Data & databases", items: "SQL, JSON, XML" },
  {
    label: "Other tools",
    items:
      "Maven, Git, Jira, Katalon Studio, Agile methodologies, accessibility testing",
  },
];

const HIGHLIGHTS = [
  "Reduced regression execution time by 60% through optimized CI/CD orchestration and data locking utilities for parallel execution.",
  "Defined and implemented a test automation strategy supporting 10+ product teams, improving consistency and reusability.",
  "Migrated legacy test case management for 32+ teams from HP ALM to Jira with Java utilities in under three months.",
];

const EMPLOYMENT = [
  {
    role: "Test Automation Lead",
    employer: "Accenture, Canada",
    period: "July 2021 – Current",
  },
  {
    role: "Quality Assurance Analyst",
    employer: "Tecsys R&D, Canada",
    period: "Feb 2021 – July 2021",
  },
];

const PROJECTS = [
  {
    href: "/work/esdc-automation-framework/",
    title: "One automation framework for many product teams — ESDC",
  },
  {
    href: "/work/edc-ceba-test-data-governance/",
    title: "Test data governance for the CEBA program — EDC",
  },
  {
    href: "/work/lcbo-alm-to-jira-migration/",
    title: "Moving 32+ teams off HP ALM to Jira — LCBO",
  },
  {
    href: "/work/tecsys-continuous-validation/",
    title: "Continuous validation and live reporting — Tecsys R&D",
  },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={title} className="flex flex-col gap-3">
      <h2
        id={title}
        className="border-b border-rule pb-2 font-sans text-xs font-semibold tracking-[0.11em] text-muted uppercase"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ResumePage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[2rem] leading-tight tracking-[-0.012em] text-balance">
          Résumé
        </h1>
        <p className="font-sans text-muted">
          Venu Gopal Nistala — Test Automation Lead, Mississauga, Ontario.
        </p>
        <p className="font-mono text-[0.8125rem]">
          <SiteLink
            href="mailto:venugopalnistala95@gmail.com"
            className="underline decoration-rule underline-offset-4 hover:decoration-trace"
          >
            venugopalnistala95@gmail.com
          </SiteLink>{" "}
          ·{" "}
          <SiteLink
            href="https://www.linkedin.com/in/venugopalnistala"
            className="underline decoration-rule underline-offset-4 hover:decoration-trace"
          >
            linkedin.com/in/venugopalnistala
          </SiteLink>
        </p>
      </div>

      <Section title="Professional summary">
        <p className="max-w-[68ch] font-sans text-sm">
          Test Automation Lead with 5+ years of experience delivering scalable
          automation solutions across enterprise-level programs in Agile
          ecosystems. Builds optimized automation frameworks and integrates them
          into CI/CD pipelines to accelerate regression cycles and improve
          release quality. Designs reusable utilities and dynamic data
          governance models that reduce test flakiness and execution time.
          Experienced in leading multi-team automation enablement, defining
          branching strategies, and driving end-to-end test automation with
          dashboard-driven test governance. Interested in AI-assisted testing,
          DevOps integration, and data-centric automation.
        </p>
      </Section>

      <Section title="Career highlights">
        <ul className="flex max-w-[68ch] list-disc flex-col gap-2 ps-5 font-sans text-sm">
          {HIGHLIGHTS.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </Section>

      <Section title="Technical skills">
        <dl className="flex flex-col gap-2 font-sans text-sm">
          {SKILLS.map(({ label, items }) => (
            <div key={label} className="flex gap-3">
              <dt className="w-[11rem] shrink-0 font-mono text-[0.8125rem] text-muted">
                {label}
              </dt>
              <dd className="max-w-[56ch]">{items}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Employment">
        <dl className="flex flex-col gap-2 font-sans text-sm">
          {EMPLOYMENT.map(({ role, employer, period }) => (
            <div key={role} className="flex gap-3">
              <dt className="w-[11rem] shrink-0 font-mono text-[0.8125rem] text-muted">
                {period}
              </dt>
              <dd>
                {role} — {employer}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Selected projects">
        <ul className="flex flex-col gap-2 font-sans text-sm">
          {PROJECTS.map(({ href, title }) => (
            <li key={href}>
              <SiteLink
                href={href}
                className="font-serif text-base text-ink underline decoration-rule underline-offset-4 hover:decoration-trace"
              >
                {title}
              </SiteLink>
            </li>
          ))}
        </ul>
        <p className="font-sans text-sm text-muted">
          Each write-up states what the work blocks — and what it still does not
          catch.
        </p>
      </Section>

      <Section title="Education">
        <p className="font-sans text-sm">
          Master of Engineering in Electrical and Computer Engineering, April
          2020 — Carleton University, Canada
        </p>
      </Section>

      <Section title="Certifications">
        <ul className="flex list-disc flex-col gap-2 ps-5 font-sans text-sm">
          <li>AI-900 — Azure AI Fundamentals, 2024</li>
          <li>AZ-900 — Azure Fundamentals, 2022</li>
        </ul>
      </Section>
    </>
  );
}
