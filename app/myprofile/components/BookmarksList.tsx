"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, ChevronDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  bookmarksEmptyBody,
  bookmarksEmptyTitle,
  bookmarksListAction,
  bookmarksListMeta,
  bookmarksListTitle,
  bookmarksSectionCount,
  bookmarksSectionSubtitle,
  bookmarksSortLabel,
  bookmarksSortSelect,
  profileButtonSecondary,
  profileSubscriptionEyebrow,
} from "@/app/lib/typography/myprofile-page";

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function bookmarkCountLabel(count: number) {
  if (count === 0) return "No saved articles";
  if (count === 1) return "1 saved article";
  return `${count} saved articles`;
}

const EMPTY_BOOKMARKS: BookmarkListItem[] = [];

type SortOption = "saved-recently" | "latest-articles" | "oldest-articles";

function BookmarkCard({
  bookmark,
  onRemove,
}: {
  bookmark: BookmarkListItem;
  onRemove: (id: number) => void;
}) {
  const href = bookmarkHref(bookmark);

  return (
    <Card className="border border-border/60 bg-card/50 p-4 transition-colors hover:border-neutral-300">
      <div className="flex gap-4">
        <Link href={href} className="shrink-0">
          {bookmark.article_cover ? (
            <div className="relative size-16 overflow-hidden rounded-md xl:size-20">
              <Image
                src={bookmark.article_cover.src}
                alt={
                  bookmark.article_cover.alt ||
                  bookmark.article_title ||
                  "Article image"
                }
                fill
                unoptimized
                sizes="80px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="size-16 rounded-md bg-neutral-100 xl:size-20" />
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
          <div>
            <Link
              href={href}
              className="block transition-opacity hover:opacity-70"
            >
              <h3 className={cn(bookmarksListTitle, "mb-1")}>
                {bookmark.article_title || "Untitled Article"}
              </h3>
            </Link>
            <p className={bookmarksListMeta}>
              {bookmark.article_date && (
                <span>{formatDate(bookmark.article_date)}</span>
              )}
              {bookmark.article_date && (
                <span className="mx-1.5 text-neutral-300">·</span>
              )}
              <span>Saved {formatDate(bookmark.created_at)}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(bookmark.id)}
            className={cn(
              "flex w-fit items-center gap-1.5",
              bookmarksListAction,
            )}
          >
            <Trash2 className="size-3.5" aria-hidden />
            Remove
          </button>
        </div>
      </div>
    </Card>
  );
}

interface BookmarksListProps {
  initialBookmarks?: BookmarkListItem[];
}

export function BookmarksList({
  initialBookmarks = EMPTY_BOOKMARKS,
}: BookmarksListProps) {
  const [bookmarks, setBookmarks] =
    useState<BookmarkListItem[]>(initialBookmarks);
  const [sortBy, setSortBy] = useState<SortOption>("saved-recently");
  const [displayedCount, setDisplayedCount] = useState(10);

  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setDisplayedCount(10);
  };

  const sortedBookmarks = useMemo(() => {
    const sorted = [...bookmarks];

    switch (sortBy) {
      case "saved-recently":
        return sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
      case "latest-articles":
        return sorted.sort((a, b) => {
          const dateA = a.article_date
            ? new Date(a.article_date).getTime()
            : new Date(a.created_at).getTime();
          const dateB = b.article_date
            ? new Date(b.article_date).getTime()
            : new Date(b.created_at).getTime();
          return dateB - dateA;
        });
      case "oldest-articles":
        return sorted.sort((a, b) => {
          const dateA = a.article_date
            ? new Date(a.article_date).getTime()
            : new Date(a.created_at).getTime();
          const dateB = b.article_date
            ? new Date(b.article_date).getTime()
            : new Date(b.created_at).getTime();
          return dateA - dateB;
        });
      default:
        return sorted;
    }
  }, [bookmarks, sortBy]);

  const displayedBookmarks = useMemo(
    () => sortedBookmarks.slice(0, displayedCount),
    [sortedBookmarks, displayedCount],
  );

  const handleRemoveBookmark = async (bookmarkId: number) => {
    const bookmark = bookmarks.find((b) => b.id === bookmarkId);
    if (!bookmark) return;

    try {
      const res = await fetch("/api/bookmarks/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          articleId: bookmark.article_id,
          articleSlug: bookmark.article_slug,
        }),
      });

      if (!res.ok) throw new Error("Failed to remove bookmark");

      setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const hasMore = displayedCount < sortedBookmarks.length;
  const isEmpty = bookmarks.length === 0;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className={profileSubscriptionEyebrow}>Reading list</span>
          <h2 className={bookmarksSectionCount}>
            {bookmarkCountLabel(bookmarks.length)}
          </h2>
          {!isEmpty && (
            <p className={bookmarksSectionSubtitle}>
              Articles you&apos;ve saved for later
            </p>
          )}
        </div>

        {!isEmpty && (
          <div className="flex shrink-0 items-center gap-3">
            <label htmlFor="bookmarks-sort" className={bookmarksSortLabel}>
              Sort
            </label>
            <div className="relative">
              <select
                id="bookmarks-sort"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className={bookmarksSortSelect}
              >
                <option value="saved-recently">Saved recently</option>
                <option value="latest-articles">Latest articles</option>
                <option value="oldest-articles">Oldest articles</option>
              </select>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-neutral-400"
                aria-hidden
              />
            </div>
          </div>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center py-12 text-center">
          <Bookmark
            className="mb-4 size-10 text-neutral-300"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className={bookmarksEmptyTitle}>Nothing saved yet</p>
          <p className={cn(bookmarksEmptyBody, "mt-1 max-w-sm")}>
            Bookmark articles while reading to find them here later.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayedBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onRemove={handleRemoveBookmark}
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => setDisplayedCount((prev) => prev + 10)}
                variant="outline"
                className={profileButtonSecondary}
              >
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
