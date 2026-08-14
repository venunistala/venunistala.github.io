import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Factual record.",
};

export default function ResumePage() {
  return (
    <>
      <h1>Résumé</h1>
      <p>
        Placeholder. Nothing appears on this page until it comes from the master
        résumé — no role, date, metric or employer is inferred or filled in from
        context.
      </p>
    </>
  );
}
