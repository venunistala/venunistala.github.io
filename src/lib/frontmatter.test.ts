import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "./frontmatter";

const valid = {
  title: "Cutting flake from a release gate",
  slug: "a-slug",
  role: "SDET",
  period: "2023-2024",
  stack: ["Playwright", "TypeScript"],
  summary: "One or two sentences.",
};

describe("parseFrontmatter", () => {
  it("returns a typed object for valid input", () => {
    expect(parseFrontmatter(valid, "a-slug")).toEqual(valid);
  });

  it("trims surrounding whitespace on strings", () => {
    const parsed = parseFrontmatter(
      { ...valid, title: "  Padded title  " },
      "a-slug",
    );
    expect(parsed.title).toBe("Padded title");
  });

  it.each(["title", "slug", "role", "period", "summary"] as const)(
    "rejects a missing %s",
    (field) => {
      const { [field]: _omitted, ...rest } = valid;
      expect(() => parseFrontmatter(rest, "a-slug")).toThrow(
        new RegExp(`"${field}" must be a string`),
      );
    },
  );

  it("rejects an empty string, which YAML happily produces", () => {
    expect(() => parseFrontmatter({ ...valid, role: "   " }, "a-slug")).toThrow(
      /"role" must not be empty/,
    );
  });

  it("rejects a non-string where a string is required", () => {
    expect(() => parseFrontmatter({ ...valid, title: 42 }, "a-slug")).toThrow(
      /"title" must be a string, got number/,
    );
  });

  // A typo'd key would otherwise read as a missing field and render as a hole
  // in the page, so it is rejected rather than ignored.
  it("rejects unknown fields", () => {
    expect(() =>
      parseFrontmatter({ ...valid, sumary: "typo" }, "a-slug"),
    ).toThrow(/unknown field\(s\): sumary/);
  });

  // If these disagree there is no non-arbitrary way to decide which owns the
  // URL, so neither wins.
  it("rejects a slug that disagrees with the filename", () => {
    expect(() => parseFrontmatter(valid, "different-slug")).toThrow(
      /"slug" is "a-slug" but the file is named "different-slug\.mdx"/,
    );
  });

  describe("stack", () => {
    it("rejects a non-list", () => {
      expect(() =>
        parseFrontmatter({ ...valid, stack: "Playwright" }, "a-slug"),
      ).toThrow(/"stack" must be a list, got string/);
    });

    it("rejects an empty list", () => {
      expect(() => parseFrontmatter({ ...valid, stack: [] }, "a-slug")).toThrow(
        /"stack" must list at least one entry/,
      );
    });

    it("names the offending index when an entry is not a string", () => {
      expect(() =>
        parseFrontmatter({ ...valid, stack: ["ok", 7] }, "a-slug"),
      ).toThrow(/"stack\[1\]" must be a string, got number/);
    });
  });

  it.each([null, undefined, "a string", ["a", "list"], 42])(
    "rejects %s in place of a frontmatter block",
    (input) => {
      expect(() => parseFrontmatter(input, "a-slug")).toThrow(
        /expected a block of key\/value pairs/,
      );
    },
  );

  it("names the source file in the error", () => {
    expect(() =>
      parseFrontmatter({}, "a-slug", "content/work/a-slug.mdx"),
    ).toThrow(/Invalid frontmatter in content\/work\/a-slug\.mdx/);
  });
});
