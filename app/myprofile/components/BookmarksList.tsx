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
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3">
          <Skeleton className="h-5 w-16 bg-slate-200" />
          <Skeleton className="h-10 w-full sm:w-48 bg-slate-200 rounded-lg" />
        </div>

        {/* Bookmarks List Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <article
              key={i}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 pb-6 border-b border-slate-200 last:border-b-0"
            >
              {/* Cover Image Skeleton */}
              <div className="flex-shrink-0 w-full sm:w-48">
                <Skeleton className="w-full h-40 sm:h-32 rounded-lg bg-slate-200" />
              </div>

              {/* Article Info Skeleton */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Skeleton className="h-6 w-full mb-2 bg-slate-200" />
                  <Skeleton className="h-4 w-3/4 mb-1 bg-slate-200" />
                  <Skeleton className="h-3 w-1/2 bg-slate-200" />
                </div>
                <Skeleton className="h-8 w-20 mt-3 sm:mt-0 bg-slate-200 rounded" />
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
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3">
        <label
          htmlFor="sort"
          className="text-sm font-medium text-slate-700 whitespace-nowrap font-sans"
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
                  | "oldest-articles"
              )
            }
            className="appearance-none w-full sm:w-auto bg-white border border-slate-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-slate-900 cursor-pointer hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 font-sans"
          >
            <option value="saved-recently">Saved Recently</option>
            <option value="latest-articles">Latest Articles</option>
            <option value="oldest-articles">Oldest Articles</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600 pointer-events-none" />
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="space-y-6">
        {displayedBookmarks.length > 0 ? (
          displayedBookmarks.map((bookmark) => (
            <article
              key={bookmark.id}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 pb-6 border-b border-slate-200 last:border-b-0"
            >
              {/* Cover Image */}
              <div className="flex-shrink-0 w-full sm:w-48">
                {bookmark.article_cover ? (
                  <Link
                    href={
                      bookmark.article_slug
                        ? `/post/${bookmark.article_slug}`
                        : "#"
                    }
                  >
                    <img
                      src={bookmark.article_cover.src}
                      alt={bookmark.article_cover.alt}
                      className="w-full h-40 sm:h-32 object-cover rounded-lg bg-slate-100"
                    />
                  </Link>
                ) : (
                  <div className="w-full h-40 sm:h-32 rounded-lg bg-slate-100" />
                )}
              </div>

              {/* Article Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link
                    href={
                      bookmark.article_slug
                        ? `/post/${bookmark.article_slug}`
                        : "#"
                    }
                    className="block hover:opacity-70 transition-opacity"
                  >
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 line-clamp-2 mb-2 font-sans">
                      {bookmark.article_title || "Untitled Article"}
                    </h3>
                    {bookmark.article_date && (
                      <p className="text-xs sm:text-sm text-slate-500 font-sans mb-1">
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
                    <p className="text-xs text-slate-500 font-sans">
                      Bookmarked on{" "}
                      {new Date(bookmark.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </Link>
                </div>
                <button
                  onClick={() => handleRemoveBookmark(bookmark.id)}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors w-fit text-xs sm:text-sm font-medium mt-3 sm:mt-0 font-sans"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 font-sans">
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
