import { describe, expect, it } from "vitest";
import {
  buildWikimediaThumbLeaf,
  getWikimediaThumbnail,
  isWikimediaSvgFilename,
  minWikimediaNewThumbWidth,
  parseWikimediaCommonsUrl,
  resolveWikimediaNewThumbWidth,
  snapWikimediaThumbnailWidth,
} from "./image-optimization";
import { wikimediaThumbnailCases } from "./image-optimization.fixtures";

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
    expect(buildWikimediaThumbLeaf("Strait_of_Hormuz-svg-en.svg", 1280)).toBe(
      "1280px-Strait_of_Hormuz-svg-en.svg.png",
    );
  });

  it("keeps raster filenames unchanged", () => {
    expect(buildWikimediaThumbLeaf("photo.jpg", 800)).toBe("800px-photo.jpg");
  });
});

describe("resolveWikimediaNewThumbWidth", () => {
  it("floors SVG full URLs to 1280 even for small listing requests", () => {
    expect(
      resolveWikimediaNewThumbWidth("Strait_of_Hormuz-svg-en.svg", 200),
    ).toBe(1280);
  });

  it("floors raster full URLs to 960 even for small listing requests", () => {
    expect(resolveWikimediaNewThumbWidth("King_Charles_photo.jpg", 200)).toBe(
      960,
    );
  });

  it("respects larger requested widths", () => {
    expect(resolveWikimediaNewThumbWidth("photo.jpg", 1920)).toBe(1920);
  });
});

describe("minWikimediaNewThumbWidth", () => {
  it("uses 1280 for SVG and 960 for raster", () => {
    expect(minWikimediaNewThumbWidth("map.svg")).toBe(1280);
    expect(minWikimediaNewThumbWidth("photo.jpg")).toBe(960);
  });
});

describe("parseWikimediaCommonsUrl", () => {
  it("parses full file and thumb URLs to the same source identity", () => {
    const full = parseWikimediaCommonsUrl(
      "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg",
    );
    const thumb = parseWikimediaCommonsUrl(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Anthropic_logo.svg/2560px-Anthropic_logo.svg.png",
    );
    expect(full).toEqual({ hash: "7", filename: "78/Anthropic_logo.svg" });
    expect(thumb).toEqual(full);
  });
});

describe("getWikimediaThumbnail", () => {
  it.each(wikimediaThumbnailCases)("$name", ({ input, maxWidth, expected }) => {
    expect(getWikimediaThumbnail(input, maxWidth)).toBe(expected);
  });

  it("resolves Commons Special:FilePath URLs", () => {
    const thumb = getWikimediaThumbnail(
      "https://commons.wikimedia.org/wiki/Special:FilePath/%2820260628%29_Heatwave_Berlin_161124058.jpg",
      800,
    );
    expect(thumb).toContain("upload.wikimedia.org/wikipedia/commons/thumb/");
    expect(thumb).toContain("960px-");
  });
});
