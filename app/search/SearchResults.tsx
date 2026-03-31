"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { SearchBar } from "../components/ui/search-bar";
import { Button } from "../components/ui/button";
import ArticleFamilyCard from "../components/article-family/ArticleFamilyCard";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SortParam = "relevance" | "newest";
type TypeParam = "all" | "post" | "opinion" | "analysis";

type SearchApiResponse = {
  query: string;
  sort: SortParam;
  type: TypeParam;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  results: CardModel[];
};

function parseSort(sp: URLSearchParams): SortParam {
  return sp.get("sort") === "newest" ? "newest" : "relevance";
}

function parseType(sp: URLSearchParams): TypeParam {
  const t = (sp.get("type") || "all").toLowerCase();
  if (t === "post" || t === "opinion" || t === "analysis") return t;
  return "all";
}

function parsePage(sp: URLSearchParams): number {
  const n = parseInt(sp.get("page") || "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function buildSearchPath(sp: URLSearchParams, updates: Record<string, string | null>) {
  const next = new URLSearchParams(sp.toString());
  for (const [k, v] of Object.entries(updates)) {
    if (v === null || v === "") next.delete(k);
    else next.set(k, v);
  }
  const qs = next.toString();
  return qs ? `/search?${qs}` : "/search";
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = (searchParams.get("q") || "").trim();
  const sort = parseSort(searchParams);
  const type = parseType(searchParams);
  const page = parsePage(searchParams);

  const [payload, setPayload] = useState<SearchApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useCallback(
    (updates: Record<string, string | null>) => {
      router.push(buildSearchPath(searchParams, updates));
    },
    [router, searchParams]
  );

  const handleSort = (next: SortParam) => {
    navigate({
      sort: next,
      page: null,
    });
  };

  const handleType = (next: TypeParam) => {
    navigate({
      type: next,
      page: null,
    });
  };

  const handlePage = (nextPage: number) => {
    navigate({
      page: nextPage <= 1 ? null : String(nextPage),
    });
  };

  const handleNewSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(
      `/search?q=${encodeURIComponent(trimmed)}&sort=relevance&type=all&page=1`
    );
  };

  useEffect(() => {
    if (!q) {
      setPayload(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const sp = new URLSearchParams();
    sp.set("q", q);
    sp.set("sort", sort);
    sp.set("type", type);
    if (page > 1) sp.set("page", String(page));

    fetch(`/api/search?${sp.toString()}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json() as Promise<SearchApiResponse>;
      })
      .then((data) => {
        if (!cancelled) setPayload(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Search failed");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [q, sort, type, page]);

  const total = payload?.total ?? 0;
  const totalPages = payload?.totalPages ?? 0;
  const results = payload?.results ?? [];
  const pageSize = payload?.pageSize ?? 10;
  const startIdx = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIdx = total === 0 ? 0 : Math.min(page * pageSize, total);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <SearchBar
            placeholder="Search news, opinion, and analysis"
            ariaLabel="Search editorial content"
            onSubmit={handleNewSearch}
          />
        </div>

        {!q ? (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4 font-sans">Search</h1>
            <p className="text-muted-foreground font-sans">
              Enter a search term above to find articles.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h1 className="text-base text-foreground font-sans">
                {error ? (
                  <span className="text-red-600">Search could not be completed.</span>
                ) : isLoading ? (
                  <>Searching…</>
                ) : total > 0 ? (
                  <>
                    Displaying {startIdx}–{endIdx} of {total} results for{" "}
                    <span className="font-semibold">{q}</span>
                  </>
                ) : (
                  <>No editorial results for &ldquo;{q}&rdquo;</>
                )}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground font-sans">
                  Type
                </span>
                {(
                  [
                    ["all", "All"],
                    ["post", "News"],
                    ["opinion", "Opinion"],
                    ["analysis", "Analysis"],
                  ] as const
                ).map(([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    variant={type === value ? "default" : "outline"}
                    className="rounded-lg font-sans"
                    onClick={() => handleType(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground font-sans">
                  Sort
                </span>
                <Button
                  type="button"
                  variant={sort === "relevance" ? "default" : "outline"}
                  className="rounded-lg font-sans"
                  onClick={() => handleSort("relevance")}
                >
                  Relevance
                </Button>
                <Button
                  type="button"
                  variant={sort === "newest" ? "default" : "outline"}
                  className="rounded-lg font-sans"
                  onClick={() => handleSort("newest")}
                >
                  Newest
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-8 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="space-y-8">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex gap-6 border-b border-border pb-8"
                    >
                      <div className="h-32 w-40 bg-gray-200 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <Button
                  type="button"
                  onClick={() => router.refresh()}
                  className="px-4 py-2"
                >
                  Try again
                </Button>
              </div>
            ) : total === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground font-sans">
                  No articles matched your search. Try different keywords or
                  check spelling.
                </p>
              </div>
            ) : (
              <>
                <ul className="space-y-8 list-none p-0 m-0">
                  {results.map((article) => (
                    <li
                      key={article._id}
                      className="border-t border-neutral-200 pt-8 first:border-t-0 first:pt-0"
                    >
                      <ArticleFamilyCard
                        article={article}
                        layout="compact"
                        showPostTypeBadge
                        showAuthor
                        showExcerpt
                        showTypeMetadataInCompact
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
                      className="rounded-xl px-6 py-6 font-sans text-base font-medium bg-transparent text-neutral-900"
                      onClick={() => handlePage(page - 1)}
                    >
                      <ChevronLeft className="mr-2 h-5 w-5" />
                      Prev
                    </Button>
                    <span className="text-sm text-muted-foreground font-sans">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={page >= totalPages}
                      className="rounded-xl px-6 py-6 font-sans text-base font-medium bg-transparent text-neutral-900"
                      onClick={() => handlePage(page + 1)}
                    >
                      Next
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
