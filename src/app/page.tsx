// Phase 0 placeholder. Exactly one h1, no claims, no metrics — the real page
// is built in Phase 3 from the Phase 1 token system.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col justify-center gap-4 px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">Venu Nistala</h1>
      <p className="max-w-prose">SDET and test platform engineer.</p>
    </main>
  );
}
