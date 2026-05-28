import { describe, expect, it } from "vitest";
import {
  getPexelsVideoId,
  getPexelsVideoPosterUrl,
  PROMO_VIDEO_SRC,
} from "./pexels-video";

describe("pexels-video", () => {
  it("extracts video id from Pexels MP4 URL", () => {
    expect(getPexelsVideoId(PROMO_VIDEO_SRC)).toBe("4622514");
    expect(getPexelsVideoId("https://example.com/video.mp4")).toBeNull();
  });

  it("builds preview poster URL", () => {
    expect(getPexelsVideoPosterUrl(PROMO_VIDEO_SRC)).toBe(
      "https://images.pexels.com/videos/4622514/pictures/preview-0.jpeg",
    );
  });
});
