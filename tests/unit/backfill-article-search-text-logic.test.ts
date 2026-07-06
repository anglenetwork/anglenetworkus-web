import { describe, it, expect } from "vitest";
import {
  buildSearchText,
  isSearchTextEmpty,
  normalizeSearchText,
  portableTextToPlainText,
  resolveSearchTextBackfill,
} from "../../scripts/lib/backfill-article-search-text-logic.mjs";

describe("isSearchTextEmpty", () => {
  it("treats null, undefined, and whitespace as empty", () => {
    expect(isSearchTextEmpty(null)).toBe(true);
    expect(isSearchTextEmpty(undefined)).toBe(true);
    expect(isSearchTextEmpty("   ")).toBe(true);
    expect(isSearchTextEmpty("")).toBe(true);
  });

  it("treats trimmed content as non-empty", () => {
    expect(isSearchTextEmpty("custom keywords")).toBe(false);
    expect(isSearchTextEmpty("  manual  ")).toBe(false);
  });
});

describe("resolveSearchTextBackfill", () => {
  it("preserves manual searchText", () => {
    expect(
      resolveSearchTextBackfill({
        title: "Ignored for build",
        searchText: "editor keywords",
      }),
    ).toEqual({ action: "preserve" });
  });

  it("patches when searchText is empty and buildable", () => {
    const result = resolveSearchTextBackfill({
      title: "Headline",
      searchText: null,
    });
    expect(result.action).toBe("patch");
    expect(result.nextSearchText).toContain("Headline");
  });

  it("skips when searchText is empty and nothing to build", () => {
    expect(resolveSearchTextBackfill({ searchText: "" })).toEqual({
      action: "skip",
    });
  });
});

describe("buildSearchText", () => {
  it("combines core fields, body, taxonomy, and author", () => {
    const text = buildSearchText({
      title: "Trump policy shift",
      tickerTitle: "Trump shift",
      excerpt: "A major policy change",
      coverEpigraph: "White House briefing",
      body: [{ children: [{ text: "Congress reacted quickly." }] }],
      categoryName: "Politics",
      categoryNavTitle: "Politics",
      tags: [{ title: "Trump", aliases: ["Donald Trump"] }],
      authorName: "Jane Reporter",
    });

    expect(text).toContain("Trump policy shift");
    expect(text).toContain("Congress reacted quickly.");
    expect(text).toContain("Politics");
    expect(text).toContain("Donald Trump");
    expect(text).toContain("Jane Reporter");
  });

  it("includes sponsor attribution fields", () => {
    const text = buildSearchText({
      title: "Partner spotlight",
      sponsorName: "Acme Corp",
      sponsorDisclosure: "Paid partnership with Acme Corp.",
    });
    expect(text).toContain("Acme Corp");
    expect(text).toContain("Paid partnership");
  });

  it("includes opinion and analysis type-specific fields", () => {
    const opinion = buildSearchText({
      title: "Why reform matters",
      disclosure: "Author serves on an advisory board.",
      authorName: "Alex Columnist",
    });
    expect(opinion).toContain("advisory board");

    const analysis = buildSearchText({
      title: "Inflation outlook",
      analysisFocus: "Consumer prices",
      methodologyNote: "Based on BLS data.",
      sourcesNote: "Public filings.",
    });
    expect(analysis).toContain("Consumer prices");
    expect(analysis).toContain("BLS data");
  });

  it("deduplicates repeated values case-insensitively", () => {
    const text = buildSearchText({
      title: "Breaking News",
      excerpt: "breaking news",
      tickerTitle: "BREAKING NEWS",
    });
    const lines = text.split("\n");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe("Breaking News");
  });

  it("returns empty string when no searchable content exists", () => {
    expect(buildSearchText({})).toBe("");
  });
});

describe("portableTextToPlainText", () => {
  it("extracts child text and block caption/alt", () => {
    const plain = portableTextToPlainText([
      { children: [{ text: "Lead paragraph." }] },
      { caption: "Photo caption", alt: "Capitol dome" },
    ]);
    expect(plain).toContain("Lead paragraph.");
    expect(plain).toContain("Photo caption");
    expect(plain).toContain("Capitol dome");
  });
});

describe("normalizeSearchText", () => {
  it("collapses internal whitespace", () => {
    expect(normalizeSearchText(["  foo   bar  "])).toBe("foo bar");
  });
});
