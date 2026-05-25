"use client";

import { useEffect } from "react";

/**
 * Client component to preload the cover image for faster LCP
 * Only preloads if the image URL is provided
 */
export function PreloadCoverImage({ imageUrl }: { imageUrl: string | null }) {
  useEffect(() => {
    if (!imageUrl) return;

    // Check if link already exists
    const existingLink = document.querySelector(
      `link[rel="preload"][as="image"][href="${imageUrl}"]`,
    );
    if (existingLink) return;

    // Create preload link
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = imageUrl;
    link.setAttribute("fetchpriority", "high");
    document.head.appendChild(link);

    // Cleanup on unmount
    return () => {
      const linkToRemove = document.querySelector(
        `link[rel="preload"][as="image"][href="${imageUrl}"]`,
      );
      if (linkToRemove) {
        linkToRemove.remove();
      }
    };
  }, [imageUrl]);

  return null;
}
