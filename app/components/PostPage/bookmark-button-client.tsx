"use client";

import * as React from "react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BookmarkButtonClientProps {
  articleId: string;
  articleSlug: string;
  initialBookmarked: boolean;
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

export default function BookmarkButtonClient({
  articleId,
  articleSlug,
  initialBookmarked,
  variant = "default",
}: BookmarkButtonClientProps) {
  const { push } = useRouter();

  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isToggling, setIsToggling] = useState(false);

  const mounted = useRef(true);

  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleToggleBookmark = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (isToggling) return;

    setIsToggling(true);

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
        setIsBookmarked(!optimistic);
        push("/signin");
        return;
      }

      const json = (await res.json().catch(() => ({}))) as {
        bookmarked?: boolean;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(json?.error || "Toggle failed");
      }

      if (typeof json?.bookmarked === "boolean") {
        setIsBookmarked(json.bookmarked);
      }
    } catch {
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
      aria-busy={isToggling}
      className={buttonClass}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Star className={`${iconClass} ${isBookmarked ? "fill-current" : ""}`} />
    </Button>
  );
}
