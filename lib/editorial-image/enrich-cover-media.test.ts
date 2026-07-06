import { afterEach, describe, expect, it, vi } from "vitest";

const canonicalizeUnsplashUrlMock = vi.fn(async (href: string) =>
  href.replace("unsplash.com", "images.unsplash.com"),
);

vi.mock("./unsplash-cdn", () => ({
  canonicalizeUnsplashUrl: (href: string) => canonicalizeUnsplashUrlMock(href),
  isUnsplashNonCdnUrl: (href: string) => href.includes("unsplash.com/photos"),
}));

import { enrichCoverMediaInTree } from "./enrich-cover-media";

const legacyUrl = "https://unsplash.com/photos/abc123/download?force=true";
const cdnUrl =
  "https://images.unsplash.com/photo-123?w=800&q=80&auto=format&fit=crop";

describe("enrichCoverMediaInTree", () => {
  afterEach(() => {
    canonicalizeUnsplashUrlMock.mockClear();
  });

  it("dedupes parallel canonicalization for repeated legacy URLs", async () => {
    const input = {
      posts: [
        { cover: { externalUrl: legacyUrl, source: "external" } },
        { cover: { externalUrl: legacyUrl, source: "external" } },
        { cover: { externalUrl: legacyUrl, source: "external" } },
      ],
    };

    const result = (await enrichCoverMediaInTree(input)) as typeof input;

    expect(canonicalizeUnsplashUrlMock).toHaveBeenCalledTimes(1);
    expect(result.posts[0].cover?.externalUrl).toContain("images.unsplash.com");
    expect(result.posts[1].cover?.externalUrl).toContain("images.unsplash.com");
    expect(result.posts[2].cover?.externalUrl).toContain("images.unsplash.com");
  });

  it("skips work when all cover URLs are already on the CDN", async () => {
    const input = {
      posts: [{ cover: { externalUrl: cdnUrl, source: "external" } }],
    };

    const result = await enrichCoverMediaInTree(input);

    expect(canonicalizeUnsplashUrlMock).not.toHaveBeenCalled();
    expect(result).toBe(input);
  });

  it("enriches imageGallery entries and preserves nested shape", async () => {
    const input = {
      title: "Section",
      rows: [
        {
          imageGallery: [
            { externalUrl: legacyUrl, source: "external" },
            { externalUrl: cdnUrl, source: "external" },
          ],
        },
      ],
    };

    const result = (await enrichCoverMediaInTree(input)) as typeof input;

    expect(canonicalizeUnsplashUrlMock).toHaveBeenCalledTimes(1);
    expect(result.title).toBe("Section");
    expect(result.rows[0].imageGallery[0].externalUrl).toContain(
      "images.unsplash.com",
    );
    expect(result.rows[0].imageGallery[1].externalUrl).toBe(cdnUrl);
  });
});
