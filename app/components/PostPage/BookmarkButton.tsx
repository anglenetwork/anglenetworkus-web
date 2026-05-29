"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { scheduleIdleTask } from "@/app/lib/schedule-idle";

interface BookmarkButtonProps {
  articleId: string;
  articleSlug: string;
  variant?: "default" | "compact";
}

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`${label} timed out after ${ms}ms`)),
        ms,
      ),
    ),
  ]);
}

export default function BookmarkButton({
  articleId,
  articleSlug,
  variant = "default",
}: BookmarkButtonProps) {
  const { push } = useRouter();

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

  // Load status per-article (deferred; never blocks initial paint)
  useEffect(() => {
    return scheduleIdleTask(() => {
      void (async () => {
        setStatusLoading(true);

        try {
          const res = await withTimeout(
            fetch(
              `/api/bookmarks/status?articleId=${encodeURIComponent(articleId)}`,
              {
                method: "GET",
                cache: "no-store",
              },
            ),
            8000,
            "bookmark status",
          );

          const json = (await res.json().catch(() => ({}))) as {
            bookmarked?: boolean;
          };

          if (!mounted.current) return;

          setIsBookmarked(Boolean(json?.bookmarked));
        } catch {
          if (!mounted.current) return;
          setIsBookmarked(false);
        } finally {
          if (mounted.current) setStatusLoading(false);
        }
      })();
    });
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
        "bookmark toggle",
      );

      if (res.status === 401) {
        // revert optimistic + go sign in
        setIsBookmarked(!optimistic);
        push("/signin");
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
          { cache: "no-store" },
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

  const isCompact = variant === "compact";
  const buttonClass = cn(
    isCompact ? "size-6 rounded-sm shadow-none" : "size-10 rounded-full",
    isBookmarked ? "text-yellow-500" : "text-black",
    isToggling && "opacity-60",
  );
  const iconClass = isCompact ? "size-3" : "size-5";

  return (
    <Button
      variant="socialIcon"
      size="icon"
      onClick={handleToggleBookmark}
      disabled={isToggling}
      aria-busy={isToggling || statusLoading}
      title={statusLoading ? "Checking bookmark..." : undefined}
      className={buttonClass}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Star className={`${iconClass} ${isBookmarked ? "fill-current" : ""}`} />
    </Button>
  );
}
