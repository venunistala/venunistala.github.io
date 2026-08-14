import localFont from "next/font/local";

/**
 * IBM Plex, latin subset, served from files committed to this repo.
 *
 * next/font/local rather than next/font/google on purpose. Both self-host the
 * result, but the Google loader fetches at build time, which makes every build
 * depend on a network call to a third party. The gate has to be deterministic
 * offline, so the files are pinned in git and the build touches no network.
 *
 * Weights are limited to the ones the token system actually uses. Every extra
 * weight is bytes on a page that has no use for them.
 *
 * Licensed under the SIL Open Font License v1.1 — see src/fonts/LICENSE.
 */

export const plexSerif = localFont({
  src: [
    {
      path: "../fonts/ibm-plex-serif-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-plex-serif",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const plexSans = localFont({
  src: [
    {
      path: "../fonts/ibm-plex-sans-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ibm-plex-sans-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/ibm-plex-sans-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-plex-sans",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
});

export const plexMono = localFont({
  src: [
    {
      path: "../fonts/ibm-plex-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/ibm-plex-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-plex-mono",
  display: "swap",
  fallback: ["ui-monospace", "Consolas", "Menlo", "monospace"],
});
