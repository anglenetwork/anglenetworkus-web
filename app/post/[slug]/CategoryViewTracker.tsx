"use client";

import { useEffect } from "react";
import { scheduleIdleTask } from "@/app/lib/schedule-idle";

interface CategoryViewTrackerProps {
  categorySlug: string;
}

export default function CategoryViewTracker({
  categorySlug,
}: CategoryViewTrackerProps) {
  useEffect(() => {
    return scheduleIdleTask(() => {
      void fetch("/api/track-category-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categorySlug }),
      }).catch((error) => {
        console.error("Failed to track category view:", error);
      });
    });
  }, [categorySlug]);

  return null;
}
