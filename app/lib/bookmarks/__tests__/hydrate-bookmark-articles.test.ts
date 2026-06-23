import { describe, expect, it } from "vitest";
import {
  expandSanityIdsForLookup,
  indexBookmarkArticlesByPublishedId,
  publishedSanityDocumentId,
  resolveBookmarkArticleTitle,
} from "../bookmark-article-helpers";

describe("hydrate bookmark articles helpers", () => {
  it("normalizes draft ids to published ids", () => {
    expect(publishedSanityDocumentId("drafts.abc123")).toBe("abc123");
    expect(publishedSanityDocumentId("abc123")).toBe("abc123");
  });

  it("expands ids for published and draft Sanity lookups", () => {
    expect(expandSanityIdsForLookup(["abc123"])).toEqual([
      "abc123",
      "drafts.abc123",
    ]);
    expect(expandSanityIdsForLookup(["drafts.abc123"])).toEqual([
      "drafts.abc123",
      "abc123",
    ]);
  });

  it("indexes articles by published id", () => {
    const map = indexBookmarkArticlesByPublishedId([
      {
        _id: "drafts.post-1",
        _type: "post",
        title: "Draft headline",
        slug: "draft-headline",
        date: "2026-01-01",
        cover: null,
      },
    ]);

    expect(map["post-1"]?.title).toBe("Draft headline");
  });

  it("prefers Sanity title and falls back to stored bookmark title", () => {
    expect(
      resolveBookmarkArticleTitle("Live headline", "Stored headline"),
    ).toBe("Live headline");
    expect(resolveBookmarkArticleTitle("Untitled", "Stored headline")).toBe(
      "Stored headline",
    );
    expect(resolveBookmarkArticleTitle(null, "Stored headline")).toBe(
      "Stored headline",
    );
    expect(resolveBookmarkArticleTitle(null, null)).toBeNull();
  });
});
