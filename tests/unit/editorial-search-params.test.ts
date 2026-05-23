import { describe, it, expect } from "vitest";
import {
  parsePage,
  parseSort,
  parseType,
  tokenizeTerm,
} from "../../app/lib/search/editorial-search";

describe("editorial search params", () => {
  it("tokenizeTerm adds prefix wildcards per word", () => {
    expect(tokenizeTerm("trump policy")).toBe("trump* policy*");
    expect(tokenizeTerm("  trump   ")).toBe("trump*");
  });

  it("parseSort normalizes relevancy alias", () => {
    expect(parseSort("relevancy")).toBe("relevance");
    expect(parseSort("newest")).toBe("newest");
    expect(parseSort(null)).toBe("relevance");
  });

  it("parseType accepts article-family scopes", () => {
    expect(parseType("post")).toBe("post");
    expect(parseType("sponsored")).toBe("sponsored");
    expect(parseType("bogus")).toBe("all");
  });

  it("parsePage clamps invalid values to page 1", () => {
    expect(parsePage("0")).toBe(1);
    expect(parsePage("abc")).toBe(1);
    expect(parsePage("3")).toBe(3);
  });
});
