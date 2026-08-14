import type { Metadata } from "next";
import Link from "next/link";
import { plexMono, plexSans, plexSerif } from "./fonts";
import "./globals.css";

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
    <html
      lang="en"
      className={`${plexSerif.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:border focus:border-rule focus:bg-paper focus:p-3 focus:font-mono focus:text-sm"
        >
          Skip to content
        </a>

        {/* The nav is set in mono and sized down deliberately. It is
            wayfinding, not identity — the name is not a masthead here. */}
        <header className="mx-auto flex w-full max-w-4xl flex-wrap items-baseline gap-x-6 gap-y-2 px-6 py-6 font-mono text-[0.8125rem]">
          {/* Nav links carry no resting underline. In a nav landmark, position
              already identifies them as links, and underlining five items in a
              row turns the header into a band of rules on a page whose whole
              visual language is rules. Content links keep theirs. */}
          <Link
            href="/"
            className="tracking-[0.06em] text-ink no-underline hover:text-trace hover:underline hover:decoration-trace hover:underline-offset-4"
          >
            venu nistala
          </Link>
          <nav aria-label="Primary">
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted no-underline hover:text-trace hover:underline hover:decoration-trace hover:underline-offset-4"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main
          id="main"
          className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 pt-4 pb-24"
        >
          {children}
        </main>
      </body>
    </html>
  );
}
