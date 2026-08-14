import { rm } from "node:fs/promises";
import { AXE_RESULTS_DIR } from "./checks";

/**
 * Clear the previous run's axe results before this one starts.
 *
 * Without this, a route that was renamed or removed leaves its result file
 * behind and CI totals it into quality.json — a number describing a run that
 * no longer happened. Playwright cleans its own outputDir but has no reason to
 * know about this one.
 */
export default async function globalSetup(): Promise<void> {
  await rm(AXE_RESULTS_DIR, { recursive: true, force: true });
}
