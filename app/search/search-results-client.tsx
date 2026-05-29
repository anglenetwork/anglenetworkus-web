"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useReducer, useTransition } from "react";
import { SearchBar } from "@/app/components/ui/search-bar";
import type { EditorialSearchResult } from "@/app/lib/search/run-editorial-search";
import {
  parsePage,
  parseSort,
  parseType,
  type TypeParam,
} from "@/app/lib/search/editorial-search";
import { SearchDesktopFilters } from "./search-desktop-filters";
import { SearchMobileFilters } from "./search-mobile-filters";
import {
  SearchResultsEmpty,
  SearchResultsError,
  SearchResultsList,
  SearchResultsLoadingSkeleton,
} from "./search-results-list";
import { SearchResultsStatus } from "./search-results-status";
import {
  buildSearchPath,
  createSearchHandlers,
} from "./search-results-shared";

type FilterUiState = {
  typeFilterOpen: boolean;
  pendingType: TypeParam;
};

type FilterUiAction =
  | { type: "dialog_open_change"; open: boolean; currentType: TypeParam }
  | { type: "set_pending_type"; value: TypeParam }
  | { type: "close_dialog" };

function filterUiReducer(
  state: FilterUiState,
  action: FilterUiAction,
): FilterUiState {
  switch (action.type) {
    case "dialog_open_change":
      return action.open
        ? { typeFilterOpen: true, pendingType: action.currentType }
        : { ...state, typeFilterOpen: false };
    case "set_pending_type":
      return { ...state, pendingType: action.value };
    case "close_dialog":
      return { ...state, typeFilterOpen: false };
    default:
      return state;
  }
}

type SearchResultsClientProps = {
  payload: EditorialSearchResult | null;
  error: string | null;
};

export function SearchResultsClient({
  payload,
  error,
}: SearchResultsClientProps) {
  const searchParams = useSearchParams();
  const { get } = searchParams;
  const { push, refresh } = useRouter();
  const [isPending, startTransition] = useTransition();

  const q = (get("q") || "").trim();
  const sort = parseSort(get("sort"));
  const type = parseType(get("type"));
  const page = parsePage(get("page"));

  const [filterUi, dispatchFilterUi] = useReducer(filterUiReducer, {
    typeFilterOpen: false,
    pendingType: type,
  });

  const navigate = useCallback(
    (updates: Record<string, string | null>) => {
      startTransition(() => {
        push(buildSearchPath(searchParams, updates));
      });
    },
    [push, searchParams],
  );

  const { handleSort, handleType, handlePage } = createSearchHandlers(
    navigate,
    () => dispatchFilterUi({ type: "close_dialog" }),
  );

  const handleApplyTypeFilter = () => {
    handleType(filterUi.pendingType);
  };

  const handleNewSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    push(
      `/search?q=${encodeURIComponent(trimmed)}&sort=relevance&type=all&page=1`,
    );
  };

  const total = payload?.total ?? 0;
  const totalPages = payload?.totalPages ?? 0;
  const results = payload?.results ?? [];
  const pageSize = payload?.pageSize ?? 10;
  const startIdx = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIdx = total === 0 ? 0 : Math.min(page * pageSize, total);
  const showLoading = isPending && !!q;

  return (
    <div className="min-h-screen bg-background">
      <div className="mb-8">
        <SearchBar
          placeholder="Search news, opinion, and analysis"
          ariaLabel="Search editorial content"
          onSubmit={handleNewSearch}
        />
      </div>

      {!q ? (
        <div className="py-12 text-center">
          <h1 className="mb-4 font-bold font-sans text-2xl">Search</h1>
          <p className="font-sans text-muted-foreground">
            Enter a search term above to find articles.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <SearchMobileFilters
            sort={sort}
            typeFilterOpen={filterUi.typeFilterOpen}
            pendingType={filterUi.pendingType}
            onDialogOpenChange={(open) =>
              dispatchFilterUi({
                type: "dialog_open_change",
                open,
                currentType: type,
              })
            }
            onPendingTypeChange={(value) =>
              dispatchFilterUi({ type: "set_pending_type", value })
            }
            onApplyTypeFilter={handleApplyTypeFilter}
            onSortChange={handleSort}
          />
          <SearchDesktopFilters
            sort={sort}
            type={type}
            onSortChange={handleSort}
            onTypeChange={handleType}
          />
          <SearchResultsStatus
            query={q}
            type={type}
            error={error}
            isPending={showLoading}
            total={total}
            startIdx={startIdx}
            endIdx={endIdx}
          />

          {showLoading ? (
            <SearchResultsLoadingSkeleton />
          ) : error ? (
            <SearchResultsError message={error} onRetry={() => refresh()} />
          ) : total === 0 ? (
            <SearchResultsEmpty />
          ) : (
            <SearchResultsList
              results={results}
              page={page}
              totalPages={totalPages}
              onPageChange={handlePage}
            />
          )}
        </div>
      )}
    </div>
  );
}
