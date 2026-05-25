"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
      <div>
        {/* Sort Dropdown Skeleton */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Skeleton className="h-5 w-16 bg-slate-200" />
          <Skeleton className="h-10 w-full rounded-lg bg-slate-200 sm:w-48" />
        </div>

        {/* Bookmarks List Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <article
              key={i}
              className="flex flex-col gap-4 border-slate-200 border-b pb-6 last:border-b-0 sm:flex-row sm:gap-6"
            >
              {/* Cover Image Skeleton */}
              <div className="w-full flex-shrink-0 sm:w-48">
                <Skeleton className="h-40 w-full rounded-lg bg-slate-200 sm:h-32" />
              </div>

              {/* Article Info Skeleton */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Skeleton className="mb-2 h-6 w-full bg-slate-200" />
                  <Skeleton className="mb-1 h-4 w-3/4 bg-slate-200" />
                  <Skeleton className="h-3 w-1/2 bg-slate-200" />
                </div>
                <Skeleton className="mt-3 h-8 w-20 rounded bg-slate-200 sm:mt-0" />
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + 10);
  };

  const hasMore = displayedCount < sortedBookmarks.length;

  return (
    <div>
      {/* Sort Dropdown */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label
          htmlFor="sort"
          className="whitespace-nowrap font-medium font-sans text-slate-700 text-sm"
        >
          Sort by:
        </label>
        <div className="relative w-full sm:w-auto">
          <select
            id="sort"
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as
                  | "saved-recently"
                  | "latest-articles"
                  | "oldest-articles",
              )
            }
            className="w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2 pr-8 font-medium font-sans text-slate-900 text-sm transition-colors hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 sm:w-auto"
          >
            <option value="saved-recently">Saved Recently</option>
            <option value="latest-articles">Latest Articles</option>
            <option value="oldest-articles">Oldest Articles</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 transform text-slate-600" />
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="space-y-6">
        {displayedBookmarks.length > 0 ? (
          displayedBookmarks.map((bookmark) => (
            <article
              key={bookmark.id}
              className="flex flex-col gap-4 border-slate-200 border-b pb-6 last:border-b-0 sm:flex-row sm:gap-6"
            >
              {/* Cover Image */}
              <div className="w-full flex-shrink-0 sm:w-48">
                {bookmark.article_cover ? (
                  <Link
                    href={
                      bookmark.article_slug
                        ? `/post/${bookmark.article_slug}`
                        : "#"
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- remote bookmark URLs; dimensions vary */}
                    <img
                      src={bookmark.article_cover.src}
                      alt={bookmark.article_cover.alt}
                      className="h-40 w-full rounded-lg object-cover sm:h-32"
                    />
                  </Link>
                ) : (
                  <div className="h-40 w-full rounded-lg bg-slate-100 sm:h-32" />
                )}
              </div>

              {/* Article Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={
                      bookmark.article_slug
                        ? `/post/${bookmark.article_slug}`
                        : "#"
                    }
                    className="block transition-opacity hover:opacity-70"
                  >
                    <h3 className="mb-2 line-clamp-2 font-sans font-semibold text-base text-slate-900 sm:text-lg">
                      {bookmark.article_title || "Untitled Article"}
                    </h3>
                    {bookmark.article_date && (
                      <p className="mb-1 font-sans text-slate-500 text-xs sm:text-sm">
                        {new Date(bookmark.article_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    )}
                    <p className="font-sans text-slate-500 text-xs">
                      Bookmarked on{" "}
                      {new Date(bookmark.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </Link>
                </div>
                <button
                  onClick={() => handleRemoveBookmark(bookmark.id)}
                  className="mt-3 flex w-fit items-center gap-2 font-medium font-sans text-red-600 text-xs transition-colors hover:text-red-700 sm:mt-0 sm:text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="font-sans text-slate-600">
              {bookmarks.length === 0
                ? "You haven't saved any bookmarks yet."
                : "No bookmarked articles yet"}
            </p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-6">
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
