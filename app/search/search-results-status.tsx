import type { TypeParam } from "@/app/lib/search/editorial-search";
import {
  searchResultsStatus,
  searchResultsStatusEmphasis,
} from "@/app/lib/typography/search-page";
import { TYPE_POSTS_LABEL } from "./search-results-shared";

type SearchResultsStatusProps = {
  query: string;
  type: TypeParam;
  error: string | null;
  isPending: boolean;
  total: number;
  startIdx: number;
  endIdx: number;
};

export function SearchResultsStatus({
  query,
  type,
  error,
  isPending,
  total,
  startIdx,
  endIdx,
}: SearchResultsStatusProps) {
  const typePostsLabel = TYPE_POSTS_LABEL[type];

  return (
    <p className={searchResultsStatus}>
      {error ? (
        <span className="font-medium text-news-primary">
          Search could not be completed.
        </span>
      ) : isPending ? (
        <>
          Searching for{" "}
          <span className={searchResultsStatusEmphasis}>{query}</span> in{" "}
          {typePostsLabel} posts
        </>
      ) : total > 0 ? (
        <>
          Displaying {startIdx}–{endIdx} of {total} results for{" "}
          <span className={searchResultsStatusEmphasis}>{query}</span> in{" "}
          {typePostsLabel} posts
        </>
      ) : (
        <>
          No results for &ldquo;
          <span className={searchResultsStatusEmphasis}>{query}</span>
          &rdquo; in {typePostsLabel} posts
        </>
      )}
    </p>
  );
}
