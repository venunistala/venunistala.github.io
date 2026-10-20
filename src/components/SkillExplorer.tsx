"use client";

import { useState } from "react";

export type SkillCategory = {
  label: string;
  tools: readonly string[];
};

/**
 * The skills grid, explorable by category.
 *
 * Filtering highlights; it never removes. Every tool stays in the document
 * (findable, printable, readable by assistive technology) — choosing a
 * category emphasises its tools and dims the rest. "All" restores the flat
 * grid.
 */
export function SkillExplorer({
  categories,
}: {
  categories: readonly SkillCategory[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const chipClass = (label: string) => {
    const base =
      "border px-2.5 py-1 font-mono text-[0.75rem] transition-all duration-300";
    if (active === null) return `${base} border-rule text-ink`;
    return active === label
      ? `${base} border-ink bg-ink text-paper`
      : `${base} border-rule text-muted opacity-50`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        role="group"
        aria-label="Filter skills by category"
        className="flex flex-wrap gap-2"
      >
        <button
          type="button"
          aria-pressed={active === null}
          onClick={() => setActive(null)}
          className={`border px-3 py-1.5 font-sans text-xs transition-colors ${
            active === null
              ? "border-ink bg-ink text-paper"
              : "border-rule text-muted hover:border-ink hover:text-ink"
          }`}
        >
          All
        </button>
        {categories.map(({ label }) => (
          <button
            key={label}
            type="button"
            aria-pressed={active === label}
            onClick={() => setActive(active === label ? null : label)}
            className={`border px-3 py-1.5 font-sans text-xs transition-colors ${
              active === label
                ? "border-ink bg-ink text-paper"
                : "border-rule text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {categories.map(({ label, tools }) => (
          <div key={label} className="flex flex-col gap-2">
            <p className="font-mono text-[0.6875rem] tracking-[0.07em] text-muted uppercase">
              {label}
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {tools.map((tool) => (
                <li key={tool} className={chipClass(label)}>
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
