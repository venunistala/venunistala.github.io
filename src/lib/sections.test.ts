import { describe, expect, it } from "vitest";
import {
  REQUIRED_SECTION,
  assertRequiredSections,
  scanHeadings,
  splitRequiredSection,
} from "./sections";

const REQUIRED_HEADING = `## ${REQUIRED_SECTION}`;

describe("scanHeadings", () => {
  it("reads level and normalized text in document order", () => {
    expect(scanHeadings("# One\n\ntext\n\n### Two")).toEqual([
      { line: 0, level: 1, text: "one" },
      { line: 4, level: 3, text: "two" },
    ]);
  });

  it("tolerates closing hashes and trailing space", () => {
    expect(scanHeadings("##  Spaced out  ##").map((h) => h.text)).toEqual([
      "spaced out",
    ]);
  });

  // A case study may well contain a shell transcript or a diff. A comment
  // inside one is not a section heading.
  it("ignores headings inside fenced code blocks", () => {
    const body = ["```sh", "# not a heading", "```", "## real heading"].join(
      "\n",
    );
    expect(scanHeadings(body).map((h) => h.text)).toEqual(["real heading"]);
  });

  it("handles tilde fences and does not close on the other marker", () => {
    const body = [
      "~~~",
      "# hidden",
      "```",
      "# still hidden",
      "~~~",
      "# shown",
    ].join("\n");
    expect(scanHeadings(body).map((h) => h.text)).toEqual(["shown"]);
  });
});

describe("assertRequiredSections", () => {
  it("passes when the section is present", () => {
    expect(() =>
      assertRequiredSections(`## What I built\n\n${REQUIRED_HEADING}`, "x.mdx"),
    ).not.toThrow();
  });

  it("throws, naming the file, when it is absent", () => {
    expect(() => assertRequiredSections("## What I built", "x.mdx")).toThrow(
      /x\.mdx is missing its required/,
    );
  });

  // The heading should fail for being absent, never for being typed with a
  // different apostrophe or in different case.
  it("accepts a curly apostrophe", () => {
    expect(() =>
      assertRequiredSections("## What it still doesn’t catch", "x.mdx"),
    ).not.toThrow();
  });

  it("is case insensitive", () => {
    expect(() =>
      assertRequiredSections("## WHAT IT STILL DOESN'T CATCH", "x.mdx"),
    ).not.toThrow();
  });

  it("is not satisfied by the heading inside a code fence", () => {
    const body = ["```md", REQUIRED_HEADING, "```"].join("\n");
    expect(() => assertRequiredSections(body, "x.mdx")).toThrow(/missing/);
  });
});

describe("splitRequiredSection", () => {
  it("splits the section out with its heading", () => {
    const body = `## What I built\n\nbuilt it.\n\n${REQUIRED_HEADING}\n\nmisses this.`;
    const { before, section, after } = splitRequiredSection(body);

    expect(before).toBe("## What I built\n\nbuilt it.");
    expect(section).toBe(`${REQUIRED_HEADING}\n\nmisses this.`);
    expect(after).toBe("");
  });

  // Returned in three parts so the section can be boxed in place. Hoisting it
  // to the end would silently reorder what the author wrote.
  it("preserves document order when the section is not last", () => {
    const body = `## First\n\na\n\n${REQUIRED_HEADING}\n\nb\n\n## Last\n\nc`;
    const { before, section, after } = splitRequiredSection(body);

    expect(before).toBe("## First\n\na");
    expect(section).toBe(`${REQUIRED_HEADING}\n\nb`);
    expect(after).toBe("## Last\n\nc");
  });

  it("stops at a higher-level heading, not just an equal one", () => {
    const body = `${REQUIRED_HEADING}\n\nb\n\n# Top`;
    expect(splitRequiredSection(body).section).toBe(`${REQUIRED_HEADING}\n\nb`);
  });

  it("keeps nested subsections inside the section", () => {
    const body = `${REQUIRED_HEADING}\n\n### Detail\n\nb`;
    expect(splitRequiredSection(body).section).toContain("### Detail");
  });

  it("returns the whole body and a null section when absent", () => {
    expect(splitRequiredSection("## Only this")).toEqual({
      before: "## Only this",
      section: null,
      after: "",
    });
  });
});
