import { Suspense } from "react";
import type { EditorialSearchResult } from "@/app/lib/search/run-editorial-search";
import { SearchResultsClient } from "./search-results-client";
import { SearchResultsLoadingSkeleton } from "./search-results-list";

function SearchResultsFallback() {
  return (
    <div className="animate-pulse">
      <div className="mb-8 h-12 rounded-lg bg-news-border" />
      <SearchResultsLoadingSkeleton />
    </div>
  );
}

type SearchResultsProps = {
  payload: EditorialSearchResult | null;
  error: string | null;
};

export default function SearchResults({ payload, error }: SearchResultsProps) {
  return (
    <Suspense fallback={<SearchResultsFallback />}>
      <SearchResultsClient payload={payload} error={error} />
    </Suspense>
  );
}
