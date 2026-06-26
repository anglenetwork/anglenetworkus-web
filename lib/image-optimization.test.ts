import { describe, expect, it } from "vitest";
import {
  buildWikimediaThumbLeaf,
  getWikimediaThumbnail,
  isWikimediaSvgFilename,
  snapWikimediaThumbnailWidth,
} from "./image-optimization";
import {
  wikimediaThumbnailCases,
} from "./image-optimization.fixtures";

describe("snapWikimediaThumbnailWidth", () => {
  it("snaps to the next pre-generated width when an exact size is unavailable", () => {
    expect(snapWikimediaThumbnailWidth(1200)).toBe(1280);
    expect(snapWikimediaThumbnailWidth(800)).toBe(800);
    expect(snapWikimediaThumbnailWidth(801)).toBe(960);
  });
});

describe("isWikimediaSvgFilename", () => {
  it("detects SVG sources but not rasterized svg.png leaves", () => {
    expect(isWikimediaSvgFilename("Strait_of_Hormuz-svg-en.svg")).toBe(true);
    expect(isWikimediaSvgFilename("Strait_of_Hormuz-svg-en.svg.png")).toBe(
      false,
    );
    expect(isWikimediaSvgFilename("photo.jpg")).toBe(false);
  });
});

describe("buildWikimediaThumbLeaf", () => {
  it("appends .png for SVG sources", () => {
    expect(
      buildWikimediaThumbLeaf("Strait_of_Hormuz-svg-en.svg", 1280),
    ).toBe("1280px-Strait_of_Hormuz-svg-en.svg.png");
  });

  it("keeps raster filenames unchanged", () => {
    expect(buildWikimediaThumbLeaf("photo.jpg", 800)).toBe("800px-photo.jpg");
  });
});

describe("getWikimediaThumbnail", () => {
  it.each(wikimediaThumbnailCases)(
    "$name",
    ({ input, maxWidth, expected }) => {
      expect(getWikimediaThumbnail(input, maxWidth)).toBe(expected);
    },
  );
});
