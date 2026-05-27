import { describe, it, expect } from "vitest";
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
