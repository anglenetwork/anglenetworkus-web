"use client";

import { useEffect } from "react";
import { scheduleIdleTask } from "@/app/lib/schedule-idle";

interface TagViewTrackerProps {
  tagSlug: string;
}

export default function TagViewTracker({ tagSlug }: TagViewTrackerProps) {
  useEffect(() => {
    return scheduleIdleTask(() => {
      void fetch("/api/track-tag-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: tagSlug }),
      }).catch((error) => {
        console.error("Failed to track tag view:", error);
      });
    });
  }, [tagSlug]);

  return null;
}
