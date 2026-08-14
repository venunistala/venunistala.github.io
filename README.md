# venunistala.github.io

Personal portfolio for an SDET / test platform engineer, built as a static
export and deployed to GitHub Pages behind its own Playwright + axe gate.

**Status: Phase 0 (scaffold).** One placeholder route, one smoke test. Design,
content and CI are Phases 1–5.

## Commands

| Command          | What it does                                           |
| ---------------- | ------------------------------------------------------ |
| `pnpm dev`       | Dev server. Convenience only — nothing is tested here. |
| `pnpm build`     | Static export to `out/`.                               |
| `pnpm lint`      | ESLint.                                                |
| `pnpm typecheck` | `tsc --noEmit`.                                        |
| `pnpm test`      | Vitest (unit).                                         |
| `pnpm test:e2e`  | Builds the export, serves it, runs Playwright + axe.   |
| `pnpm format`    | Prettier.                                              |

Full gate: `pnpm lint && pnpm build && pnpm test && pnpm test:e2e`.

## Why the tests run against `out/`

`pnpm test:e2e` does not touch `next dev`. Playwright's `webServer` runs
`pnpm build && pnpm serve:out`, so every assertion is made against the exact
files that get uploaded to Pages. The dev server has different routing, no
export step, and different bundling — passing there would prove nothing about
what ships. `reuseExistingServer` is `false` and the port is 4321 rather than
3000, so a dev server left running can never silently be tested instead.

## `serve.json`

JSON takes no comments, so the reasoning lives here. The local server exists to
imitate GitHub Pages, and both keys are load-bearing:

- `trailingSlash: true` — pairs with `trailingSlash` in `next.config.ts`.
  Pages redirects `/work/foo` to `/work/foo/`; this makes the local server do
  the same, so link assertions behave identically in both places.
- `directoryListing: false` — Pages never renders a directory index. Without
  this, `/_next/static/chunks/` returns a browsable listing locally that would
  404 in production.

Do not add `cleanUrls: false`. With clean URLs off, a request for `/` stops
resolving to `index.html` and falls through to directory handling, which
`directoryListing: false` then rejects — every route 404s.

## Deployment

GitHub Pages, from `out/`, via Actions (Phase 5). `public/.nojekyll` must
survive every build or Pages' Jekyll pass strips `/_next/` for having a leading
underscore. There is deliberately no `basePath` or `assetPrefix`: this is a
user site served at the domain root, not a project site.
