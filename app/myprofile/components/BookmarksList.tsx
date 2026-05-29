"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bookmarksListTitle } from "@/app/lib/typography/myprofile-page";

export type BookmarkListItem = {
  id: number;
  article_id: string;
  article_slug: string | null;
  created_at: string;
  article_title: string | null;
  article_type: string | null;
  article_href: string | null;
  article_date: string | null;
  article_cover: {
    src: string;
    alt: string;
  } | null;
};

function bookmarkHref(bookmark: BookmarkListItem): string {
  if (bookmark.article_href) return bookmark.article_href;
  if (bookmark.article_slug) return `/post/${bookmark.article_slug}`;
  return "#";
}

const EMPTY_BOOKMARKS: BookmarkListItem[] = [];

interface BookmarksListProps {
  initialBookmarks?: BookmarkListItem[];
}

export function BookmarksList({
  initialBookmarks = EMPTY_BOOKMARKS,
}: BookmarksListProps) {
  const [bookmarks, setBookmarks] =
    useState<BookmarkListItem[]>(initialBookmarks);
  const [sortBy, setSortBy] = useState<
    "saved-recently" | "latest-articles" | "oldest-articles"
  >("saved-recently");
  const [displayedCount, setDisplayedCount] = useState(10);

  const handleSortChange = (
    value: "saved-recently" | "latest-articles" | "oldest-articles",
  ) => {
    setSortBy(value);
    setDisplayedCount(10);
  };

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

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + 10);
  };

  const hasMore = displayedCount < sortedBookmarks.length;

  return (
    <div>
      {/* Sort Dropdown */}
      <div className="mb-8 flex flex-row items-center gap-3">
        <label
          htmlFor="sort"
          className="whitespace-nowrap font-medium font-sans text-slate-700 text-sm"
        >
          Sort by:
        </label>
        <div className="relative w-auto">
          <select
            id="sort"
            value={sortBy}
            onChange={(e) =>
              handleSortChange(
                e.target.value as
                  | "saved-recently"
                  | "latest-articles"
                  | "oldest-articles",
              )
            }
            className="w-auto cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-4 py-2 pr-8 font-medium font-sans text-slate-900 text-sm transition-colors hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            <option value="saved-recently">Saved Recently</option>
            <option value="latest-articles">Latest Articles</option>
            <option value="oldest-articles">Oldest Articles</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 transform text-slate-600" />
        </div>
      </div>

      {/* Bookmarks List */}
      <div className="space-y-6">
        {displayedBookmarks.length > 0 ? (
          displayedBookmarks.map((bookmark) => (
            <article
              key={bookmark.id}
              className="flex flex-row gap-6 border-slate-200 border-b pb-6 last:border-b-0"
            >
              {/* Cover Image */}
              <div className="w-24 flex-shrink-0 xl:w-48">
                {bookmark.article_cover ? (
                  <Link href={bookmarkHref(bookmark)}>
                    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg">
                      <Image
                        src={bookmark.article_cover.src}
                        alt={
                          bookmark.article_cover.alt ||
                          bookmark.article_title ||
                          "Article image"
                        }
                        fill
                        unoptimized
                        sizes="(max-width: 1280px) 96px, 192px"
                        className="object-cover"
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="aspect-[3/2] w-full rounded-lg bg-slate-100" />
                )}
              </div>

              {/* Article Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={bookmarkHref(bookmark)}
                    className="block transition-opacity hover:opacity-70"
                  >
                    <h3 className={bookmarksListTitle}>
                      {bookmark.article_title || "Untitled Article"}
                    </h3>
                    {bookmark.article_date && (
                      <p className="mb-1 font-sans text-slate-500 text-sm">
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
                    <p className="mb-4 font-sans text-slate-500 text-xs xl:mb-0">
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
                  type="button"
                  onClick={() => handleRemoveBookmark(bookmark.id)}
                  className="mt-0 flex w-fit items-center gap-2 font-medium font-sans text-red-600 text-sm transition-colors hover:text-red-700"
                >
                  <Trash2 className="size-4" />
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
