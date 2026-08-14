import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * Every internal link on the site, with prefetching turned off.
 *
 * Why: Next's client prefetches an RSC payload for links it sees, but under
 * `output: 'export'` the file it writes and the URL it asks for disagree.
 * For /resume/ the build emits
 *
 *     out/resume/__next.resume/__PAGE__.txt      (a directory, then the file)
 *
 * while the browser requests
 *
 *     /resume/__next.resume.__PAGE__.txt         (dot-separated, one file)
 *
 * A host that maps request paths to real files — GitHub Pages, or `serve`
 * locally — cannot satisfy that, so every prefetch 404s. It is invisible in
 * normal use because navigation falls back to a full page load, which is why
 * it survived until a test started reading the console.
 *
 * Disabling prefetch is the boring fix rather than post-processing the export
 * into the names the client happens to want. On a nine-page static site with
 * no data fetching, speculative payload requests buy nothing that would
 * justify shipping 404s to every visitor.
 *
 * Centralised here so the reasoning lives in one place and the day Next fixes
 * the mismatch, one prop comes off.
 */
export function SiteLink(props: ComponentProps<typeof Link>) {
  return <Link prefetch={false} {...props} />;
}
