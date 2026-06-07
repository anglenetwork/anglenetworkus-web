"use client";

import { Button } from "@/components/ui/button";
import ArticleFamilyCard from "@/app/components/article-family/ArticleFamilyCard";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import {
  searchEmptyMessage,
  searchErrorMessage,
  searchPaginationButton,
  searchPaginationLabel,
} from "@/app/lib/typography/search-page";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SearchResultsLoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="mb-4 h-6 w-1/3 rounded bg-gray-200" />
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-6 pb-8">
            <div className="h-32 w-40 shrink-0 rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-1/4 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type SearchResultsListProps = {
  results: CardModel[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function SearchResultsList({
  results,
  page,
  totalPages,
  onPageChange,
}: SearchResultsListProps) {
  return (
    <>
      <ul className="m-0 list-none space-y-4 p-0 md:space-y-6">
        {results.map((article) => (
          <li
            key={article._id}
            className="max-md:[&_.search-result-excerpt]:hidden"
          >
            <ArticleFamilyCard
              article={article}
              layout="compact"
              variant="search"
            />
          </li>
        ))}
      </ul>

      {totalPages > 1 ? (
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={page <= 1}
            className={searchPaginationButton}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="mr-2 size-5" />
            Prev
          </Button>
          <span className={searchPaginationLabel}>
            Page {page} of {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={page >= totalPages}
            className={searchPaginationButton}
            onClick={() => onPageChange(page + 1)}
          >
            Next
            <ChevronRight className="ml-2 size-5" />
          </Button>
        </div>
      ) : null}
    </>
  );
}

type SearchResultsErrorProps = {
  message: string;
  onRetry: () => void;
};

export function SearchResultsError({
  message,
  onRetry,
}: SearchResultsErrorProps) {
  return (
    <div className="py-12 text-center">
      <p className={searchErrorMessage}>{message}</p>
      <Button type="button" onClick={onRetry} className="px-4 py-2">
        Try again
      </Button>
    </div>
  );
}

export function SearchResultsEmpty() {
  return (
    <div className="py-12 text-center">
      <p className={searchEmptyMessage}>
        No articles matched your search. Try different keywords or check
        spelling.
      </p>
    </div>
  );
}
