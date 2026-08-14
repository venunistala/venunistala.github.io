import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx";
import { getAllCaseStudies, getCaseStudy } from "@/lib/content";
import { REQUIRED_SECTION, splitRequiredSection } from "@/lib/sections";

// Every case study URL is known at build time. dynamicParams=false makes an
// unknown slug a build-time error rather than a page that only 404s once it
// is deployed.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCaseStudies().map(({ meta }) => ({ slug: meta.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = getCaseStudy(slug);
  return { title: meta.title, description: meta.summary };
}

function Facts({
  role,
  period,
  stack,
}: {
  role: string;
  period: string;
  stack: readonly string[];
}) {
  // A description list, not a table: these are attributes of one thing, not
  // rows of comparable things. Mono throughout — these are the machine-
  // readable facts, lifted straight out of frontmatter.
  const rows = [
    { label: "Role", value: role },
    { label: "Period", value: period },
    { label: "Stack", value: stack.join(" · ") },
  ];
  return (
    <dl className="flex flex-col gap-1 border-y border-rule py-3 font-mono text-[0.8125rem]">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex gap-3">
          <dt className="w-[5.5rem] shrink-0 text-[0.6875rem] tracking-[0.07em] text-muted uppercase">
            {label}
          </dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const { meta, body } = getCaseStudy(slug);
  const { before, section, after } = splitRequiredSection(body);

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <p className="font-mono text-[0.75rem] text-muted">
          <Link
            href="/#work"
            className="underline decoration-rule underline-offset-4 hover:text-trace hover:decoration-trace"
          >
            work
          </Link>{" "}
          / {meta.slug}
        </p>

        <h1 className="font-serif text-[1.85rem] leading-tight tracking-[-0.012em] text-balance">
          {meta.title}
        </h1>

        <Facts role={meta.role} period={meta.period} stack={meta.stack} />

        <p className="max-w-[68ch] font-sans">{meta.summary}</p>
      </header>

      <div className="flex flex-col gap-4">
        <MDXRemote source={before} components={mdxComponents} />
      </div>

      {/* The limitations section is the only boxed element on the page, which
          makes it the heaviest thing on it. That is the argument, not a
          decoration: for a test engineer the boundary of your own gate is the
          credential, so the honest section gets the most weight rather than
          being set as fine print. The border is --ink, not --fail — nothing
          here failed. */}
      {section && (
        <section
          aria-label={REQUIRED_SECTION}
          className="flex flex-col gap-4 border border-ink p-6"
        >
          <MDXRemote source={section} components={mdxComponents} />
        </section>
      )}

      {after && (
        <div className="flex flex-col gap-4">
          <MDXRemote source={after} components={mdxComponents} />
        </div>
      )}
    </article>
  );
}
