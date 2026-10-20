"use client";

import { usePathname } from "next/navigation";
import { SiteLink } from "@/components/SiteLink";

/**
 * Primary nav with the current section marked.
 *
 * `aria-current` carries the state for assistive technology; the underline
 * carries it visually. Colour is never the only signal — the active link is
 * also the one link in the nav that rests underlined.
 */
export function NavLinks({
  links,
}: {
  links: readonly { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1">
      {links.map(({ href, label }) => {
        const active =
          href !== "/#work" && pathname !== null && pathname.startsWith(href);
        return (
          <li key={href}>
            <SiteLink
              href={href}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "text-ink underline decoration-trace underline-offset-4"
                  : "text-muted no-underline hover:text-trace hover:underline hover:decoration-trace hover:underline-offset-4"
              }
            >
              {label}
            </SiteLink>
          </li>
        );
      })}
    </ul>
  );
}
