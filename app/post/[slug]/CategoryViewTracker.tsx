"use client";

import { useEffect } from "react";

interface CategoryViewTrackerProps {
  categorySlug: string;
}

export default function CategoryViewTracker({
  categorySlug,
}: CategoryViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch("/api/track-category-view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ categorySlug }),
        });
      } catch (error) {
        console.error("Failed to track category view:", error);
      }
    };

    trackView();
  }, [categorySlug]);

  return null; // This component doesn't render anything
}
