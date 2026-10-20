import type { Metadata } from "next";
import Script from "next/script";
import { SiteLink } from "@/components/SiteLink";
import { NavLinks } from "@/components/NavLinks";
import { SiteFooter } from "@/components/SiteFooter";
import { plexMono, plexSans, plexSerif } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Venu Nistala",
    template: "%s — Venu Nistala",
  },
  description:
    "Venu Nistala — Test Automation Lead. Frameworks, test data, and CI/CD quality gates.",
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
      {/* Marks the document as JS-capable before first paint. globals.css
          scopes the reveal animations' hidden state to `html.js`, so a
          no-JS render never hides content behind an animation that will
          not run. */}
      <Script id="js-gate" strategy="beforeInteractive">
        {"document.documentElement.classList.add('js')"}
      </Script>
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
          <SiteLink
            href="/"
            className="tracking-[0.06em] text-ink no-underline hover:text-trace hover:underline hover:decoration-trace hover:underline-offset-4"
          >
            venu nistala
          </SiteLink>
          <nav aria-label="Primary">
            <NavLinks links={NAV} />
          </nav>
        </header>

        <main
          id="main"
          className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 pt-4 pb-24"
        >
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
