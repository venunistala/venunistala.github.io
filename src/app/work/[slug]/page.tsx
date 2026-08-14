import type { Metadata } from "next";
import { getAllCaseStudies, getCaseStudy } from "@/lib/content";

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

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const { meta } = getCaseStudy(slug);

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <p>
          <span className="sr-only">Section: </span>work / {meta.slug}
        </p>
        <h1>{meta.title}</h1>

        {/* Machine-readable facts from frontmatter, set apart from the prose.
            A description list rather than a table: these are attributes of one
            thing, not rows of comparable things. */}
        <dl className="flex flex-col gap-1">
          <div className="flex gap-3">
            <dt>Role</dt>
            <dd>{meta.role}</dd>
          </div>
          <div className="flex gap-3">
            <dt>Period</dt>
            <dd>{meta.period}</dd>
          </div>
          <div className="flex gap-3">
            <dt>Stack</dt>
            <dd>{meta.stack.join(" · ")}</dd>
          </div>
        </dl>

        <p>{meta.summary}</p>
      </header>
    </article>
  );
}
