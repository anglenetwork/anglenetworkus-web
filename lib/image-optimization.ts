import { isWikimediaHostname } from "@/lib/editorial-image/policy";

/**
 * Image optimization utilities for external images
 * Helps reduce network payload by using optimized image URLs when available
 */

/**
 * Wikimedia Commons supports thumbnail URLs via their API
 * Correct format: https://upload.wikimedia.org/wikipedia/commons/thumb/{hash}/{filename}/{width}px-{filename}
 *
 * This function converts a full-size Wikimedia URL to a thumbnail URL
 * @param originalUrl - The original Wikimedia Commons image URL
 * @param maxWidth - Maximum width for the thumbnail (default: 1200px)
 * @returns Optimized thumbnail URL or original URL if conversion fails
 */
export function getWikimediaThumbnail(
  originalUrl: string,
  maxWidth: number = 1200,
): string {
  // Limit maxWidth to reasonable sizes to avoid huge downloads
  // Wikimedia supports up to 2048px, but we'll cap at 1200px for performance
  const cappedWidth = Math.min(maxWidth, 1200);
  try {
    const url = new URL(originalUrl);

    if (!isWikimediaHostname(url.hostname)) {
      return originalUrl;
    }

    const pathParts = url.pathname.split("/").filter((p) => p); // Remove empty strings

    // Find the 'commons' index
    const commonsIndex = pathParts.findIndex((part) => part === "commons");
    if (commonsIndex === -1) {
      return originalUrl;
    }

    // Check if already a thumbnail
    // Format: /wikipedia/commons/thumb/{hash}/{filename}/{width}px-{filename}
    if (pathParts[commonsIndex + 1] === "thumb") {
      // Already a thumbnail - extract and update width
      const thumbParts = pathParts.slice(commonsIndex + 2); // Skip 'commons', 'thumb'
      if (thumbParts.length >= 2) {
        const lastPart = thumbParts[thumbParts.length - 1];
        const widthMatch = lastPart.match(/^(\d+)px-(.+)$/);
        if (widthMatch) {
          // Replace width in existing thumbnail
          thumbParts[thumbParts.length - 1] =
            `${cappedWidth}px-${widthMatch[2]}`;
          url.pathname =
            "/" +
            pathParts.slice(0, commonsIndex + 2).join("/") +
            "/" +
            thumbParts.join("/");
          return url.toString();
        }
      }
      return originalUrl; // Already optimized but can't parse, return as-is
    }

    // Convert full-size to thumbnail
    // Path structure: /wikipedia/commons/{hash}/{filename}
    // We need: /wikipedia/commons/thumb/{hash}/{filename}/{width}px-{filename}
    const hash = pathParts[commonsIndex + 1];
    const filename = pathParts.slice(commonsIndex + 2).join("/");

    if (!hash || !filename) {
      return originalUrl;
    }

    // Extract just the filename without path for the thumbnail suffix
    const filenameOnly = filename.split("/").pop() || filename;

    // Build thumbnail URL with correct format
    // Format: /wikipedia/commons/thumb/{hash}/{filename}/{width}px-{filename}
    const thumbnailPath = `/wikipedia/commons/thumb/${hash}/${filename}/${cappedWidth}px-${filenameOnly}`;
    url.pathname = thumbnailPath;

    // Validate the constructed URL
    try {
      const testUrl = new URL(url.toString());
      return testUrl.toString();
    } catch {
      // If URL construction fails, return original
      return originalUrl;
    }
  } catch (error) {
    // If URL parsing fails, return original
    return originalUrl;
  }
}

/**
 * Gets an optimized image URL based on the source
 * @param originalUrl - The original image URL
 * @param maxWidth - Maximum width for optimization
 * @returns Optimized URL
 */
function getOptimizedImageUrl(
  originalUrl: string,
  maxWidth: number = 1200,
): string {
  try {
    const url = new URL(originalUrl);

    if (isWikimediaHostname(url.hostname)) {
      return getWikimediaThumbnail(originalUrl, maxWidth);
    }

    // For other external images, return as-is (Next.js will optimize if enabled)
    return originalUrl;
  } catch {
    return originalUrl;
  }
}
