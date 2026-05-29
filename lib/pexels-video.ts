export const PROMO_VIDEO_SRC =
  "https://videos.pexels.com/video-files/4622514/4622514-uhd_2560_1440_24fps.mp4";

/**
 * Derive a Pexels preview poster URL from a videos.pexels.com MP4 URL.
 * Example: .../video-files/4622514/4622514-uhd_....mp4 → images.pexels.com/videos/4622514/pictures/preview-0.jpeg
 */
export function getPexelsVideoId(videoSrc: string): string | null {
  const match = videoSrc.match(/\/video-files\/(\d+)\//);
  return match?.[1] ?? null;
}

export function getPexelsVideoPosterUrl(videoSrc: string): string | null {
  const id = getPexelsVideoId(videoSrc);
  if (!id) return null;
  return `https://images.pexels.com/videos/${id}/pictures/preview-0.jpeg`;
}
