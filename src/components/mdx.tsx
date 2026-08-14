import type { ComponentPropsWithoutRef } from "react";

/**
 * Token styling for compiled MDX output.
 *
 * A component map rather than descendant selectors on a wrapper class. The
 * brief's warning about section-level and element-level rules cancelling each
 * other is avoided structurally here: nothing in this file selects by
 * ancestry, so there is no cascade for a container rule to win or lose
 * against. Each element carries its own classes and that is the only place
 * they come from.
 */

const MEASURE = "max-w-[68ch]";

export const mdxComponents = {
  // Section headers read as report labels, not as display type. The serif is
  // reserved for what a human asserts — the case study's title — and does not
  // continue down into its sections.
  // Spacing note: the containers that hold this output are flex columns with
  // `gap`, so `gap` owns the base rhythm. These margins add the extra breathing
  // room a section break wants, and `first:mt-0` stops them doubling up with
  // the container's own padding at the top of a box. Margins on flex items do
  // not collapse, so the total is predictable rather than emergent.
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-4 border-b border-rule pb-2 font-sans text-xs font-semibold tracking-[0.11em] text-muted uppercase first:mt-0"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-2 font-serif text-lg leading-snug first:mt-0"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className={`${MEASURE} font-sans`} {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-trace underline decoration-rule underline-offset-2 hover:decoration-trace"
      {...props}
    />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className={`${MEASURE} flex list-disc flex-col gap-2 ps-5`}
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className={`${MEASURE} flex list-decimal flex-col gap-2 ps-5`}
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="font-sans" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className={`${MEASURE} border-s-2 border-rule ps-4 text-muted`}
      {...props}
    />
  ),
  // Inline values and code are machine output, so they take the mono voice.
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code className="font-mono text-[0.9em]" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    // Wide content scrolls in its own box; the page body never scrolls sideways.
    <pre
      className="overflow-x-auto border border-rule p-4 font-mono text-[0.8125rem]"
      {...props}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="border-rule" {...props} />
  ),
};
