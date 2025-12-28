"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Bookmark {
  id: number;
  article_id: string;
  article_slug: string | null;
  created_at: string;
  article_title: string | null;
  article_date: string | null;
  article_cover: {
    src: string;
    alt: string;
  } | null;
}

interface BookmarksListProps {}

export function BookmarksList({}: BookmarksListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<
    "saved-recently" | "latest-articles" | "oldest-articles"
  >("saved-recently");
  const [displayedCount, setDisplayedCount] = useState(10);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  // Reset pagination when sort changes
  useEffect(() => {
    setDisplayedCount(10);
  }, [sortBy]);

  // Sort bookmarks based on selected option
  const sortedBookmarks = useMemo(() => {
    const sorted = [...bookmarks];

    switch (sortBy) {
      case "saved-recently":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA; // Descending (newest first)
        });

      case "latest-articles":
        return sorted.sort((a, b) => {
          const dateA = a.article_date
            ? new Date(a.article_date).getTime()
            : new Date(a.created_at).getTime();
          const dateB = b.article_date
            ? new Date(b.article_date).getTime()
            : new Date(b.created_at).getTime();
          return dateB - dateA; // Descending (newest first)
        });

      case "oldest-articles":
        return sorted.sort((a, b) => {
          const dateA = a.article_date
            ? new Date(a.article_date).getTime()
            : new Date(a.created_at).getTime();
          const dateB = b.article_date
            ? new Date(b.article_date).getTime()
            : new Date(b.created_at).getTime();
          return dateA - dateB; // Ascending (oldest first)
        });

      default:
        return sorted;
    }
  }, [bookmarks, sortBy]);

  // Paginate sorted bookmarks
  const displayedBookmarks = useMemo(() => {
    return sortedBookmarks.slice(0, displayedCount);
  }, [sortedBookmarks, displayedCount]);

  const fetchBookmarks = async () => {
    try {
      const res = await fetch("/api/bookmarks/list", {
        method: "GET",
        cache: "no-store",
      });

      if (res.status === 401) {
        setBookmarks([]);
        return;
      }

      const json = (await res.json().catch(() => ({}))) as any;

      if (!res.ok) {
        console.error("Error fetching bookmarks:", json?.error);
        setBookmarks([]);
        return;
      }

      setBookmarks(json?.bookmarks || []);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId: number) => {
    // Find the bookmark to get article_id for the toggle API
    const bookmark = bookmarks.find((b) => b.id === bookmarkId);
    if (!bookmark) return;

    try {
      // Use the toggle API to remove the bookmark
      const res = await fetch("/api/bookmarks/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          articleId: bookmark.article_id,
          articleSlug: bookmark.article_slug,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to remove bookmark");
      }

      // Optimistic update
      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + 10);
  };

  if (bookmarks.length === 0) {
    return (
      <p className="text-muted-foreground font-sans">
        You haven't saved any bookmarks yet.
      </p>
    );
  }

  const hasMore = displayedCount < sortedBookmarks.length;

  return (
    <div className="space-y-4">
      {/* Sort Dropdown */}
      <div className="flex items-center gap-2 mb-8 justify-end">
        <label htmlFor="sort-select" className="text-sm font-medium font-sans">
          Sort by:
        </label>

        <Select
          value={sortBy}
          onValueChange={(
            value: "saved-recently" | "latest-articles" | "oldest-articles"
          ) => setSortBy(value)}
        >
          <SelectTrigger id="sort-select" className="w-auto font-sans">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent
            position="popper"
            sideOffset={6}
            className="z-50 w-[--radix-select-trigger-width] overflow-hidden rounded-md border bg-white text-black shadow-md
              [&_[data-state=checked]_svg]:hidden"
          >
            {/* ✅ Selected item is indicated by gray bg, and we override left padding
                (shadcn SelectItem uses pl-8 for the check icon space). */}
            <SelectItem
              value="saved-recently"
              className="font-sans pl-2 data-[state=checked]:bg-gray-100 data-[state=checked]:text-gray-900"
            >
              Saved Recently
            </SelectItem>

            <SelectItem
              value="latest-articles"
              className="font-sans pl-2 data-[state=checked]:bg-gray-100 data-[state=checked]:text-gray-900"
            >
              Latest Articles
            </SelectItem>

            <SelectItem
              value="oldest-articles"
              className="font-sans pl-2 data-[state=checked]:bg-gray-100 data-[state=checked]:text-gray-900"
            >
              Oldest Articles
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookmarks List */}
      {displayedBookmarks.map((bookmark, index) => (
        <div key={bookmark.id}>
          <div className="flex items-start gap-4">
            {/* Cover Image */}
            {bookmark.article_cover && (
              <Link
                href={
                  bookmark.article_slug ? `/post/${bookmark.article_slug}` : "#"
                }
                className="flex-shrink-0"
              >
                <div className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-lg">
                  <Image
                    src={bookmark.article_cover.src}
                    alt={bookmark.article_cover.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 96px, 128px"
                    unoptimized={
                      bookmark.article_cover.src.includes("wikimedia") ||
                      bookmark.article_cover.src.includes("//")
                    }
                  />
                </div>
              </Link>
            )}

            {/* Article Info */}
            <div className="flex-1 min-w-0">
              <Link
                href={
                  bookmark.article_slug ? `/post/${bookmark.article_slug}` : "#"
                }
                className="block hover:opacity-70 transition-opacity"
              >
                <h3 className="font-sans text-base font-medium mb-1 line-clamp-2">
                  {bookmark.article_title || "Untitled Article"}
                </h3>
                {bookmark.article_date && (
                  <p className="text-sm text-muted-foreground font-sans">
                    {new Date(bookmark.article_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                )}
                <p className="text-xs text-muted-foreground font-sans mt-1">
                  Bookmarked on{" "}
                  {new Date(bookmark.created_at).toLocaleDateString()}
                </p>
              </Link>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveBookmark(bookmark.id)}
              className="font-sans flex-shrink-0 text-white bg-red-500 hover:bg-red-600 hover:text-white"
            >
              Remove
            </Button>
          </div>
          {index < displayedBookmarks.length - 1 && (
            <Separator className="mt-4" />
          )}
        </div>
      ))}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="font-sans"
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
