import { describe, expect, it } from "vitest";
import {
  normalizeArticleFamily,
  normalizeArticleFamilyCard,
  isArticleFamilyDocType,
} from "../normalize";

describe("isArticleFamilyDocType", () => {
  it("accepts editorial document types", () => {
    expect(isArticleFamilyDocType("post")).toBe(true);
    expect(isArticleFamilyDocType("opinion")).toBe(true);
    expect(isArticleFamilyDocType("analysis")).toBe(true);
    expect(isArticleFamilyDocType("sponsored")).toBe(true);
  });

  it("rejects unknown types", () => {
    expect(isArticleFamilyDocType("author")).toBe(false);
  });
});

describe("normalizeArticleFamily", () => {
  it("returns null when slug or id is missing", () => {
    expect(normalizeArticleFamily(null)).toBeNull();
    expect(
      normalizeArticleFamily({ _type: "post", _id: "abc", slug: "" }),
    ).toBeNull();
    expect(
      normalizeArticleFamily({ _type: "post", _id: "", slug: "hello" }),
    ).toBeNull();
  });

  it("normalizes a post with publishedAt date fallback", () => {
    const result = normalizeArticleFamily({
      _type: "post",
      _id: "post-1",
      slug: "hello-world",
      title: "Hello",
      publishedAt: "2024-01-15T10:00:00.000Z",
    });

    expect(result).toMatchObject({
      _id: "post-1",
      _type: "post",
      slug: "hello-world",
      title: "Hello",
      href: "/post/hello-world?id=post-1",
      publishedAt: "2024-01-15T10:00:00.000Z",
      date: "2024-01-15T10:00:00.000Z",
    });
  });

  it("parses sponsor attribution with default sponsor name", () => {
    const result = normalizeArticleFamily({
      _type: "sponsored",
      _id: "sp-1",
      slug: "sponsored-post",
      sponsorAttribution: {
        disclosure: "Paid partnership",
      },
    });

    expect(result?.sponsorAttribution).toEqual({
      sponsorName: "Sponsor",
      sponsorUrl: null,
      disclosure: "Paid partnership",
    });
  });

  it("coerces nullable editorial notes to strings", () => {
    const result = normalizeArticleFamily({
      _type: "analysis",
      _id: "a-1",
      slug: "analysis-post",
      analysisFocus: 42,
      disclosure: undefined,
    });

    expect(result?.analysisFocus).toBe("42");
    expect(result?.disclosure).toBeNull();
  });

  it("filters null and invalid tag entries from Sanity dereferences", () => {
    const result = normalizeArticleFamily({
      _type: "post",
      _id: "post-tags",
      slug: "tagged-post",
      tags: [
        null,
        { title: "Iran", slug: "iran" },
        { title: "Missing slug" },
        { slug: "no-title" },
      ],
    });

    expect(result?.tags).toEqual([{ title: "Iran", slug: "iran" }]);
  });
});

describe("normalizeArticleFamilyCard", () => {
  it("returns the same shape as normalizeArticleFamily", () => {
    const raw = {
      _type: "post",
      _id: "post-2",
      slug: "card-slug",
      title: "Card title",
    };

    expect(normalizeArticleFamilyCard(raw)).toEqual(
      normalizeArticleFamily(raw),
    );
  });
});
