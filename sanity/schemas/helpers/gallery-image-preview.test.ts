import { describe, expect, it } from "vitest";
import {
  buildGalleryImagePreviewSubtitle,
  buildGalleryImagePreviewTitle,
  resolveGalleryImageIndex,
} from "./gallery-image-preview";

describe("resolveGalleryImageIndex", () => {
  it("uses context.path index when available", () => {
    expect(
      resolveGalleryImageIndex(
        { source: "asset" },
        { path: ["imageGallery", 2] },
      ),
    ).toBe(3);
  });

  it("finds external gallery item by url", () => {
    expect(
      resolveGalleryImageIndex(
        { source: "external", externalUrl: "https://example.com/a.jpg" },
        {
          document: {
            imageGallery: [
              { source: "external", externalUrl: "https://example.com/b.jpg" },
              { source: "external", externalUrl: "https://example.com/a.jpg" },
            ],
          },
        },
      ),
    ).toBe(2);
  });

  it("returns null when no match exists", () => {
    expect(
      resolveGalleryImageIndex(
        { source: "external", externalUrl: "https://example.com/missing.jpg" },
        { document: { imageGallery: [] } },
      ),
    ).toBeNull();
  });
});

describe("buildGalleryImagePreviewTitle", () => {
  it("prefers numbered title when index is known", () => {
    expect(buildGalleryImagePreviewTitle(2, "Caption", "Alt")).toBe("Image 2");
  });

  it("falls back to caption then alt", () => {
    expect(buildGalleryImagePreviewTitle(null, "Caption", "Alt")).toBe(
      "Caption",
    );
    expect(buildGalleryImagePreviewTitle(null, null, "Alt")).toBe("Alt");
    expect(buildGalleryImagePreviewTitle(null, null, null)).toBe(
      "Gallery Image",
    );
  });
});

describe("buildGalleryImagePreviewSubtitle", () => {
  it("builds external subtitle with optional caption", () => {
    expect(buildGalleryImagePreviewSubtitle("external", 1, "Hero image")).toBe(
      "External URL • Hero image",
    );
  });

  it("returns asset label when caption is absent", () => {
    expect(buildGalleryImagePreviewSubtitle("asset", null, null)).toBe(
      "Uploaded Asset",
    );
  });
});
