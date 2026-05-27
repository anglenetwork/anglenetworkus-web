"use client";

import { useEffect } from "react";

/**
 * Optional early hint for the cover image URL.
 * Does not set fetchpriority="high" — ArticleMedia / next/image owns LCP priority.
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
