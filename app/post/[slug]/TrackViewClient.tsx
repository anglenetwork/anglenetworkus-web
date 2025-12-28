"use client";

import { useEffect, useState } from "react";

export default function TrackViewClient({ postId }: { postId: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!postId || typeof window === "undefined") {
      return;
    }

    fetch("/api/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
      keepalive: true,
    }).catch((error) => console.error("TrackViewClient: API error:", error));
  }, [postId, mounted]);

  if (!mounted) {
    return null;
  }

  return null;
}
