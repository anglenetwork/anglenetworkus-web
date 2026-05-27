import { describe, it, expect } from "vitest";
import {
  searchEditorialAllRelevanceQuery,
  searchEditorialCountAllQuery,
  searchEditorialSponsoredRelevanceQuery,
} from "../../sanity/lib/queries";

describe("editorial search GROQ", () => {
  it("filters on searchText with local fallbacks", () => {
    expect(searchEditorialAllRelevanceQuery).toContain(
      "searchText match $term",
    );
    expect(searchEditorialAllRelevanceQuery).toContain("title match $term");
    expect(searchEditorialCountAllQuery).toContain("searchText match $term");
  });

  it("keeps all filter editorial-only (excludes sponsored)", () => {
    expect(searchEditorialAllRelevanceQuery).toContain(
      '_type in ["post", "opinion", "analysis"]',
    );
    expect(searchEditorialAllRelevanceQuery).not.toContain('"sponsored"');
    expect(searchEditorialCountAllQuery).not.toContain('_type == "sponsored"');
  });

  it("provides sponsored-only search queries", () => {
    expect(searchEditorialSponsoredRelevanceQuery).toContain(
      '_type == "sponsored"',
    );
    expect(searchEditorialSponsoredRelevanceQuery).toContain(
      "searchText match $term",
    );
  });

  it("scores only document-local fields including searchText", () => {
    const scoreSection =
      searchEditorialAllRelevanceQuery.match(
        /\| score\([\s\S]*?\)\s*\| order/,
      )?.[0] ?? "";

    expect(scoreSection).toContain("boost(searchText match $term, 20)");
    expect(scoreSection).toContain("boost(title match $term, 100)");
    expect(scoreSection).toContain("boost(cover.caption match $term, 55)");
    expect(scoreSection).not.toContain("coalesce(");
    expect(scoreSection).not.toContain("pt::text(body)");
    expect(scoreSection).not.toContain("category->name");
    expect(scoreSection).not.toContain("count(tags[]->aliases");
  });
});
