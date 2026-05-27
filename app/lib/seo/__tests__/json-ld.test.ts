import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildArticleImagesJsonLd,
  buildArticleJsonLd,
  buildAuthorSameAsUrls,
  buildWebsiteJsonLd,
} from "../json-ld";
import { buildPublisherJsonLd } from "../publisher";

vi.mock("@/app/lib/seo/site-url", () => ({
  getPublicSiteUrl: () => "https://example.com",
}));

vi.mock("@/sanity/lib/utils", () => ({
  getCoverImage: vi.fn((cover: { externalUrl?: string } | null) => {
    if (!cover) return null;
    if (cover.externalUrl) {
      return { src: cover.externalUrl, alt: "alt", unoptimized: true };
    }
    return {
      src: "https://cdn.sanity.io/images/test.jpg",
      alt: "alt",
      unoptimized: false,
    };
  }),
}));

describe("buildArticleImagesJsonLd", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("emits ImageObject when Sanity dimensions are present", () => {
    const result = buildArticleImagesJsonLd(
      {
        source: "asset",
        image: { asset: { _ref: "x" } },
        dimensions: { width: 1200, height: 800 },
      },
      "Hero",
      "https://example.com",
    );
    expect(result).toEqual([
      {
        "@type": "ImageObject",
        url: "https://cdn.sanity.io/images/test.jpg",
        width: 1200,
        height: 800,
      },
    ]);
  });

  it("falls back to URL string for external cover without dimensions", () => {
    const result = buildArticleImagesJsonLd(
      {
        source: "external",
        externalUrl: "https://images.unsplash.com/photo-1",
      },
      "Hero",
      "https://example.com",
    );
    expect(result).toEqual(["https://images.unsplash.com/photo-1"]);
  });

  it("falls back to URL string when dimensions are missing on Sanity asset", () => {
    const result = buildArticleImagesJsonLd(
      { source: "asset", image: { asset: { _ref: "x" } } },
      "Hero",
      "https://example.com",
    );
    expect(result).toEqual(["https://cdn.sanity.io/images/test.jpg"]);
  });
});

describe("buildArticleJsonLd", () => {
  const publisher = buildPublisherJsonLd({
    siteName: "Example News",
    siteUrl: "https://example.com",
  });

  it("includes author url when author slug is present", () => {
    const ld = buildArticleJsonLd(
      {
        _id: "1",
        _type: "post",
        title: "Story",
        tickerTitle: "",
        excerpt: null,
        slug: "story",
        href: "/post/story",
        cover: null,
        body: null,
        author: { name: "Jane Doe", slug: "jane-doe" },
        publishedAt: "2026-01-01T00:00:00.000Z",
        updatedAt: null,
        date: "2026-01-01T00:00:00.000Z",
        seo: null,
      },
      { publisher },
    );
    expect(ld.author).toEqual({
      "@type": "Person",
      name: "Jane Doe",
      url: "https://example.com/author/jane-doe",
    });
  });
});

describe("buildWebsiteJsonLd", () => {
  it("includes SearchAction", () => {
    const ld = buildWebsiteJsonLd({
      siteName: "Example",
      siteUrl: "https://example.com",
      organizationId: "https://example.com/#organization",
    });
    expect(ld.potentialAction).toMatchObject({
      "@type": "SearchAction",
      target: {
        urlTemplate: "https://example.com/search?q={search_term_string}",
      },
    });
  });
});

describe("buildAuthorSameAsUrls", () => {
  it("normalizes twitter handle to URL", () => {
    expect(buildAuthorSameAsUrls({ twitter: "@reporter" })).toEqual([
      "https://twitter.com/reporter",
    ]);
  });
});
