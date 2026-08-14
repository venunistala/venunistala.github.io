import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How this site is tested",
  description:
    "The pipeline that gates this site, and the defects it cannot see.",
};

export default function HowThisSiteIsTestedPage() {
  return (
    <>
      <h1>How this site is tested</h1>
      <p>
        Placeholder. This page describes the gate this site ships behind, and
        gives equal space to what that gate provably cannot see.
      </p>
      <p>
        It will be written once the pipeline is real. Half the facts it needs —
        test counts, the axe scan result, the commit and run that produced them
        — come from CI, which does not exist until Phase 5. Writing it now would
        mean describing a pipeline from intent rather than from output, which is
        the thing this page exists to argue against.
      </p>
    </>
  );
}
