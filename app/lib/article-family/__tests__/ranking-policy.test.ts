import { describe, it, expect } from "vitest";
import {
  EDITORIAL_RANKING_TYPES,
  HOMEPAGE_FOURTH_SECTION_MOST_READ_LIMIT,
  POST_ONLY_RANKING_TYPES,
  DEFAULT_EDITORIAL_RANKING_WINDOW,
  RANKING_TIEBREAK_RULE,
  isEditorialRankingType,
  shouldIncludeInEditorialRanking,
  shouldIncludeInMostReadPosts,
} from "../ranking-policy";

describe("ranking-policy constants", () => {
  it("exports exact policy values", () => {
    expect(EDITORIAL_RANKING_TYPES).toEqual(["post", "opinion", "analysis"]);
    expect(POST_ONLY_RANKING_TYPES).toEqual(["post"]);
    expect(DEFAULT_EDITORIAL_RANKING_WINDOW).toBe("7d");
    expect(HOMEPAGE_FOURTH_SECTION_MOST_READ_LIMIT).toBe(5);
    expect(RANKING_TIEBREAK_RULE).toBe("last_viewed_at_then_published_at");
  });
});

describe("ranking-policy helpers", () => {
  it("never treats sponsored as editorial ranking", () => {
    expect(isEditorialRankingType("sponsored")).toBe(false);
    expect(shouldIncludeInEditorialRanking("sponsored")).toBe(false);
    expect(shouldIncludeInMostReadPosts("sponsored")).toBe(false);
  });

  it("includes editorial types for editorial ranking", () => {
    expect(shouldIncludeInEditorialRanking("post")).toBe(true);
    expect(shouldIncludeInEditorialRanking("opinion")).toBe(true);
    expect(shouldIncludeInEditorialRanking("analysis")).toBe(true);
  });

  it("limits most-read posts to post only", () => {
    expect(shouldIncludeInMostReadPosts("post")).toBe(true);
    expect(shouldIncludeInMostReadPosts("opinion")).toBe(false);
  });
});
