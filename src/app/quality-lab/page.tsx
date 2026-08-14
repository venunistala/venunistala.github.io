import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quality lab",
  description: "An instrumented substrate built to be tested against.",
};

export default function QualityLabPage() {
  return (
    <>
      <h1>Quality lab</h1>
      <p>
        Placeholder. This route was planned as the instrumented substrate built
        to be tested and automated against, presented as a live system with its
        own constraints rather than as a finished product.
      </p>
      <p>
        That reading is an assumption, not something you confirmed. If this page
        is meant to be something else, the concept needs correcting before Phase
        3 renders it.
      </p>
    </>
  );
}
