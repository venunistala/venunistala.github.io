import Link from "next/link";
import { getAllCaseStudies } from "@/lib/content";

export default function Home() {
  const studies = getAllCaseStudies();

  return (
    <>
      <h1>Venu Nistala</h1>
      <p>SDET and test platform engineer.</p>

      {/* The quality gate strip belongs here, between the identity block and
          the work index. It cannot be built until quality.json exists, which
          is Phase 5 — rendering a placeholder would be exactly the defaulted
          number the design argues against. */}

      <section aria-labelledby="work" className="flex flex-col gap-4">
        <h2 id="work">Work</h2>

        <table className="text-left">
          <caption className="sr-only">
            Case studies, ordered by slug. Each links to its full write-up.
          </caption>
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Role</th>
              <th scope="col">Period</th>
              <th scope="col">Summary</th>
            </tr>
          </thead>
          <tbody>
            {studies.map(({ meta }) => (
              <tr key={meta.slug}>
                <th scope="row">
                  <Link href={`/work/${meta.slug}/`}>{meta.title}</Link>
                </th>
                <td>{meta.role}</td>
                <td>{meta.period}</td>
                <td>{meta.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
