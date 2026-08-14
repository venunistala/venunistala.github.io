import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

// Type faces are deliberately not chosen here. Phase 1 selects a display, body
// and mono family and states why each suits this subject; Phase 3 wires them
// in. Until then the page renders in the platform's own UI stack rather than
// inheriting a scaffold's default as if it were a decision.

export const metadata: Metadata = {
  title: {
    default: "Venu Nistala",
    template: "%s — Venu Nistala",
  },
  description: "SDET and test platform engineer.",
};

// Trailing slashes match next.config.ts, so navigation never costs a redirect
// hop that a test would then have to account for.
const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/quality-lab/", label: "Quality lab" },
  { href: "/how-this-site-is-tested/", label: "How this site is tested" },
  { href: "/resume/", label: "Résumé" },
] as const;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {/* Phase 2 is structural. Every class here is layout only — colour,
            type and spacing are derived from the token system in Phase 3. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:p-3"
        >
          Skip to content
        </a>

        <header className="flex flex-wrap items-baseline gap-x-6 gap-y-2 px-6 py-4">
          <Link href="/">Venu Nistala</Link>
          <nav aria-label="Primary">
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main id="main" className="flex flex-1 flex-col gap-8 px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
