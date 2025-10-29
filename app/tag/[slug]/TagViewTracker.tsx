"use client";

import { useEffect } from "react";

interface TagViewTrackerProps {
  tagSlug: string;
}

export default function TagViewTracker({ tagSlug }: TagViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch("/api/track-tag-view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug: tagSlug }),
        });
      } catch (error) {
        console.error("Failed to track tag view:", error);
      }
    };

    trackView();
  }, [tagSlug]);

  return null; // This component doesn't render anything
}
