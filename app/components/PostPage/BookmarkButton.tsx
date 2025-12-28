"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookmarkButtonProps {
  articleId: string;
  articleSlug: string;
}

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`${label} timed out after ${ms}ms`)),
        ms
      )
    ),
  ]);
}

export default function BookmarkButton({
  articleId,
  articleSlug,
}: BookmarkButtonProps) {
  const router = useRouter();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Load status per-article (never blocks the button)
  useEffect(() => {
    const run = async () => {
      setStatusLoading(true);

      try {
        const res = await withTimeout(
          fetch(
            `/api/bookmarks/status?articleId=${encodeURIComponent(articleId)}`,
            {
              method: "GET",
              cache: "no-store",
            }
          ),
          8000,
          "bookmark status"
        );

        const json = (await res.json().catch(() => ({}))) as any;

        if (!mounted.current) return;

        // If not authenticated, just show not-bookmarked (don't redirect on status)
        setIsBookmarked(Boolean(json?.bookmarked));
      } catch {
        if (!mounted.current) return;
        setIsBookmarked(false);
      } finally {
        if (mounted.current) setStatusLoading(false);
      }
    };

    run();
  }, [articleId]);

  const handleToggleBookmark = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (isToggling) return;

    setIsToggling(true);

    // optimistic flip
    const optimistic = !isBookmarked;
    setIsBookmarked(optimistic);

    try {
      const res = await withTimeout(
        fetch("/api/bookmarks/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify({ articleId, articleSlug }),
        }),
        12000,
        "bookmark toggle"
      );

      if (res.status === 401) {
        // revert optimistic + go sign in
        setIsBookmarked(!optimistic);
        router.push("/signin");
        return;
      }

      const json = (await res.json().catch(() => ({}))) as any;

      if (!res.ok) {
        throw new Error(json?.error || "Toggle failed");
      }

      if (typeof json?.bookmarked === "boolean") {
        setIsBookmarked(json.bookmarked);
      } else {
        // fallback: re-check
        const st = await fetch(
          `/api/bookmarks/status?articleId=${encodeURIComponent(articleId)}`,
          { cache: "no-store" }
        );
        const sj = (await st.json().catch(() => ({}))) as any;
        setIsBookmarked(Boolean(sj?.bookmarked));
      }
    } catch {
      // revert on error
      setIsBookmarked(!optimistic);
    } finally {
      if (mounted.current) setIsToggling(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleBookmark}
      disabled={isToggling}
      aria-busy={isToggling || statusLoading}
      title={statusLoading ? "Checking bookmark..." : undefined}
      className={`h-10 w-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 shadow-sm ${
        isBookmarked ? "text-yellow-500 fill-yellow-500" : "text-black"
      } ${isToggling ? "opacity-60" : ""}`}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Star className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
    </Button>
  );
}
