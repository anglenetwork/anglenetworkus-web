import { describe, expect, it } from "vitest";
import { getVideoEmbedSrc } from "../video-utils";

describe("getVideoEmbedSrc", () => {
  it("builds an embed URL for a YouTube watch URL", () => {
    expect(getVideoEmbedSrc("https://www.youtube.com/watch?v=abc123")).toBe(
      "https://www.youtube.com/embed/abc123",
    );
  });

  it("builds an embed URL for a YouTube short URL", () => {
    expect(getVideoEmbedSrc("https://youtu.be/abc123")).toBe(
      "https://www.youtube.com/embed/abc123",
    );
  });

  it("builds an embed URL for a Vimeo URL", () => {
    expect(getVideoEmbedSrc("https://vimeo.com/987654")).toBe(
      "https://player.vimeo.com/video/987654",
    );
  });

  it("returns null for invalid or unsupported URLs", () => {
    expect(getVideoEmbedSrc("not a url")).toBeNull();
    expect(getVideoEmbedSrc("https://example.com/watch?v=abc123")).toBeNull();
    expect(getVideoEmbedSrc(null)).toBeNull();
  });
});
