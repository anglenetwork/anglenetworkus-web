import { describe, expect, it, vi } from "vitest";

vi.mock("@/sanity/lib/api", () => ({
  projectId: "test-project",
  dataset: "test",
}));

vi.mock("@/sanity/lib/image-url", () => {
  const builder = {
    url: () => "https://cdn.sanity.io/images/test-project/test/x.jpg",
    width() {
      return builder;
    },
    height() {
      return builder;
    },
    fit() {
      return builder;
    },
    quality() {
      return builder;
    },
  };
  return {
    urlForImage: () => builder,
  };
});

import { normalizeExternalImageUrl } from "./normalize";
import { resolveEditorialImage } from "./resolve";

describe("normalizeExternalImageUrl", () => {
  it("normalizes protocol-relative and bare host URLs", () => {
    expect(
      normalizeExternalImageUrl("//cdn.sanity.io/images/x.jpg")?.href,
    ).toBe("https://cdn.sanity.io/images/x.jpg");
    expect(
      normalizeExternalImageUrl("cdn.sanity.io/images/x.jpg")?.hostname,
    ).toBe("cdn.sanity.io");
  });
});

describe("resolveEditorialImage", () => {
  it("returns unoptimized true for non-whitelisted external with auto policy", () => {
    const result = resolveEditorialImage(
      {
        source: "external",
        externalUrl: "https://example.com/photo.jpg",
        alt: "Alt",
      },
      { fallbackAlt: "Fallback", externalUnoptimized: "auto" },
    );
    expect(result).toMatchObject({
      src: "https://example.com/photo.jpg",
      alt: "Alt",
      unoptimized: true,
    });
  });

  it("returns unoptimized false for non-whitelisted external when policy is false", () => {
    const result = resolveEditorialImage(
      {
        source: "external",
        externalUrl: "https://example.com/photo.jpg",
      },
      { fallbackAlt: "Fallback", externalUnoptimized: false },
    );
    expect(result?.unoptimized).toBe(false);
  });

  it("optimizes whitelisted external URLs with auto policy", () => {
    const result = resolveEditorialImage(
      {
        source: "external",
        externalUrl: "https://images.unsplash.com/photo-1",
      },
      { fallbackAlt: "Fallback", externalUnoptimized: "auto" },
    );
    expect(result?.unoptimized).toBe(false);
  });

  it("clamps Unsplash width query to maxWidth for listings", () => {
    const result = resolveEditorialImage(
      {
        source: "external",
        externalUrl:
          "https://images.unsplash.com/photo-1?w=1600&q=80&auto=format&fit=crop",
      },
      { fallbackAlt: "Fallback", maxWidth: 720, externalUnoptimized: "auto" },
    );
    expect(result?.src).toContain("w=720");
    expect(result?.src).not.toContain("w=1600");
    expect(result?.unoptimized).toBe(false);
  });

  it("uses Wikimedia thumbnails and always unoptimizes", () => {
    const result = resolveEditorialImage(
      {
        source: "external",
        externalUrl:
          "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",
      },
      { fallbackAlt: "Fallback", wikimediaWidth: 800 },
    );
    expect(result?.src).toContain("/thumb/");
    expect(result?.unoptimized).toBe(true);
  });

  it("repairs broken Wikimedia SVG thumb URLs", () => {
    const result = resolveEditorialImage(
      {
        source: "external",
        externalUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Strait_of_Hormuz-svg-en.svg/1280px-Strait_of_Hormuz-svg-en.svg",
      },
      { fallbackAlt: "Fallback", wikimediaWidth: 1200 },
    );
    expect(result?.src).toBe(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Strait_of_Hormuz-svg-en.svg/1280px-Strait_of_Hormuz-svg-en.svg.png",
    );
    expect(result?.unoptimized).toBe(true);
  });

  it("includes attribution when requested", () => {
    const result = resolveEditorialImage(
      {
        source: "external",
        externalUrl: "https://images.unsplash.com/photo-1",
        caption: "Scene",
        creditAuthor: "Jane",
        creditSource: "Reuters",
        licenseOrRights: "All rights reserved",
      },
      { fallbackAlt: "Fallback", includeAttribution: true },
    );
    expect(result).toMatchObject({
      caption: "Scene",
      credit: "Jane/Reuters",
      licenseOrRights: "All rights reserved",
    });
  });

  it("maps Sanity lqip to blurDataURL for asset images", () => {
    const result = resolveEditorialImage(
      {
        source: "asset",
        image: {
          asset: { _ref: "image-abc123" },
        },
        lqip: "data:image/jpeg;base64,/9j/4AAQ",
      },
      { fallbackAlt: "Fallback" },
    );
    expect(result?.blurDataURL).toBe("data:image/jpeg;base64,/9j/4AAQ");
    expect(result?.unoptimized).toBe(false);
  });

  it("does not set blur for external URLs", () => {
    const result = resolveEditorialImage(
      {
        source: "external",
        externalUrl: "https://images.unsplash.com/photo-1",
        lqip: "data:image/jpeg;base64,/9j/4AAQ",
      },
      { fallbackAlt: "Fallback", externalUnoptimized: "auto" },
    );
    expect(result?.blurDataURL).toBeUndefined();
  });

  it("omits attribution by default", () => {
    const result = resolveEditorialImage(
      {
        source: "external",
        externalUrl: "https://images.unsplash.com/photo-1",
        caption: "Scene",
      },
      { fallbackAlt: "Fallback" },
    );
    expect(result?.caption).toBeUndefined();
    expect(result?.credit).toBeUndefined();
  });
});
