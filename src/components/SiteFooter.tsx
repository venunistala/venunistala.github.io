import { SiteLink } from "@/components/SiteLink";

/**
 * The footer: identity, contact, and the one claim this site makes about
 * itself — every deploy passed the gate on the page it links to.
 */
export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-4xl px-6 pb-10">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-rule pt-5 font-mono text-[0.75rem] text-muted">
        <span>Venu Gopal Nistala — Mississauga, Ontario</span>
        <SiteLink
          href="mailto:venugopalnistala95@gmail.com"
          className="underline decoration-rule underline-offset-4 hover:text-trace hover:decoration-trace"
        >
          venugopalnistala95@gmail.com
        </SiteLink>
        <SiteLink
          href="https://www.linkedin.com/in/venugopalnistala"
          className="underline decoration-rule underline-offset-4 hover:text-trace hover:decoration-trace"
        >
          LinkedIn
        </SiteLink>
        <span className="ms-auto">
          Static export — shipped behind{" "}
          <SiteLink
            href="/how-this-site-is-tested/"
            className="underline decoration-rule underline-offset-4 hover:text-trace hover:decoration-trace"
          >
            its own test gate
          </SiteLink>
          .
        </span>
      </div>
    </footer>
  );
}
