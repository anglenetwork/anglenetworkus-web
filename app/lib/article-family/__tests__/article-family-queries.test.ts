import { describe, it, expect } from "vitest";
import {
  FEED_MIXED_EDITORIAL_TYPES,
  FEED_SPONSORED_ONLY_TYPES,
  FEED_TOPIC_CATEGORY_TAG_TYPES,
  GROQ_IN_BOOKMARK_HYDRATION_TYPES,
  GROQ_IN_MIXED_EDITORIAL_TYPES,
  GROQ_IN_TOPIC_CATEGORY_TAG_TYPES,
  GROQ_TYPE_ANALYSIS,
  GROQ_TYPE_OPINION,
  GROQ_TYPE_POST,
  GROQ_TYPE_SPONSORED,
} from "@/app/lib/article-family/feed-policies";
import {
  articleFamilyPageByIdQuery,
  articleFamilyPageByIdPreviewQuery,
  articleFamilyPageBySlugQuery,
  articleFamilyPageBySlugPreviewQuery,
  postPublishedSlugsQuery,
  feedEditorialEntriesQuery,
  authorPageQuery,
  sitemapAuthorSlugsQuery,
} from "@/sanity/lib/article-family-queries";

describe("article family page GROQ", () => {
  it("GROQ literals stay aligned with feed policy arrays", () => {
    const toGroqInList = (types: readonly string[]) =>
      types.map((type) => `"${type}"`).join(", ");

    expect(GROQ_TYPE_POST).toBe("post");
    expect(GROQ_TYPE_OPINION).toBe("opinion");
    expect(GROQ_TYPE_ANALYSIS).toBe("analysis");
    expect(GROQ_TYPE_SPONSORED).toBe("sponsored");
    expect(GROQ_IN_MIXED_EDITORIAL_TYPES).toBe(
      toGroqInList(FEED_MIXED_EDITORIAL_TYPES),
    );
    expect(GROQ_IN_TOPIC_CATEGORY_TAG_TYPES).toBe(
      toGroqInList(FEED_TOPIC_CATEGORY_TAG_TYPES),
    );
    expect(GROQ_IN_BOOKMARK_HYDRATION_TYPES).toBe(
      toGroqInList([
        ...FEED_MIXED_EDITORIAL_TYPES,
        ...FEED_SPONSORED_ONLY_TYPES,
      ]),
    );
  });

  it("public slug query enforces published guard", () => {
    expect(articleFamilyPageBySlugQuery).toContain('status == "published"');
    expect(articleFamilyPageBySlugQuery).toContain("publishedAt <= now()");
  });

  it("public id query enforces published guard", () => {
    expect(articleFamilyPageByIdQuery).toContain('status == "published"');
    expect(articleFamilyPageByIdQuery).toContain("publishedAt <= now()");
  });

  it("preview slug query omits published guard", () => {
    expect(articleFamilyPageBySlugPreviewQuery).not.toContain(
      'status == "published"',
    );
  });

  it("preview id query omits published guard", () => {
    expect(articleFamilyPageByIdPreviewQuery).not.toContain(
      'status == "published"',
    );
  });

  it("post published slugs query enforces published guard", () => {
    expect(postPublishedSlugsQuery).toContain('status == "published"');
    expect(postPublishedSlugsQuery).toContain("publishedAt <= now()");
  });

  it("feed editorial query includes post opinion analysis only", () => {
    expect(feedEditorialEntriesQuery).toContain('"post"');
    expect(feedEditorialEntriesQuery).toContain('"opinion"');
    expect(feedEditorialEntriesQuery).toContain('"analysis"');
    expect(feedEditorialEntriesQuery).not.toContain("sponsored");
    expect(feedEditorialEntriesQuery).toContain('status == "published"');
  });

  it("author page query uses published guard on articles", () => {
    expect(authorPageQuery).toContain('status == "published"');
    expect(authorPageQuery).toContain("author->slug.current == $slug");
  });

  it("sitemap author slugs requires published articles", () => {
    expect(sitemapAuthorSlugsQuery).toContain('status == "published"');
  });
});
