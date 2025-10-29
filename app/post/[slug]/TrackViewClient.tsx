"use client";

import { useEffect, useState } from "react";

export default function TrackViewClient({ postId }: { postId: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    console.log("TrackViewClient mounted with postId:", postId);

    if (!postId || typeof window === "undefined") {
      console.log("TrackViewClient: Missing postId or server-side rendering");
      return;
    }

    console.log("TrackViewClient: Tracking view for postId:", postId);

    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
      keepalive: true,
    })
      .then((response) => {
        console.log("TrackViewClient: API response:", response.status);
        return response.json();
      })
      .then((data) => console.log("TrackViewClient: API data:", data))
      .catch((error) => console.error("TrackViewClient: API error:", error));
  }, [postId, mounted]);

  if (!mounted) {
    return null;
  }

  return null;
}
