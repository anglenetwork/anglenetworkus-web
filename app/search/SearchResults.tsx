"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { SearchBar } from "../components/ui/search-bar";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ArticleFamilyCard from "../components/article-family/ArticleFamilyCard";
import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  X,
} from "lucide-react";
import {
  parsePage,
  parseSort,
  parseType,
  type SortParam,
  type TypeParam,
} from "@/app/lib/search/editorial-search";
import { cn } from "@/lib/utils";

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

const TYPE_OPTIONS = [
  ["all", "All"],
  ["post", "News"],
  ["opinion", "Opinion"],
  ["analysis", "Analysis"],
  ["sponsored", "Sponsored"],
] as const;

const TYPE_POSTS_LABEL: Record<TypeParam, string> = {
  all: "All",
  post: "News",
  opinion: "Opinion",
  analysis: "Analysis",
  sponsored: "Sponsored",
};

function desktopFilterLinkClass(isActive: boolean) {
  return cn(
    "rounded-lg font-sans",
    "xl:h-auto xl:min-h-0 xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0 xl:text-base xl:shadow-none",
    isActive
      ? "xl:font-bold xl:text-red-600 xl:underline xl:underline-offset-4 hover:xl:bg-transparent hover:xl:text-red-600"
      : "xl:font-normal xl:text-foreground xl:no-underline xl:underline-offset-4 hover:xl:bg-transparent hover:xl:text-foreground hover:xl:underline",
  );
}

function buildSearchPath(
  sp: URLSearchParams,
  updates: Record<string, string | null>,
) {
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
  const sort = parseSort(searchParams.get("sort"));
  const type = parseType(searchParams.get("type"));
  const page = parsePage(searchParams.get("page"));

  const [payload, setPayload] = useState<SearchApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);
  const [pendingType, setPendingType] = useState<TypeParam>(type);

  const handleTypeFilterOpenChange = (open: boolean) => {
    setTypeFilterOpen(open);
    if (open) setPendingType(type);
  };

  const handleApplyTypeFilter = () => {
    handleType(pendingType);
    setTypeFilterOpen(false);
  };

  const navigate = useCallback(
    (updates: Record<string, string | null>) => {
      router.push(buildSearchPath(searchParams, updates));
    },
    [router, searchParams],
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
      `/search?q=${encodeURIComponent(trimmed)}&sort=relevance&type=all&page=1`,
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
  const typePostsLabel = TYPE_POSTS_LABEL[type];

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
        <>
          <div className="flex flex-col gap-6">
            {/* Compact filters (base through lg) */}
            <div className="flex w-full items-center justify-start gap-3 xl:hidden">
              <Dialog
                open={typeFilterOpen}
                onOpenChange={handleTypeFilterOpenChange}
              >
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 rounded-lg font-sans"
                  >
                    <ListFilter className="h-4 w-4" />
                    Filter
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom fixed inset-0 top-0 left-0 z-50 flex h-[100dvh] w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 p-0 font-sans shadow-lg [&>button]:hidden"
                  onOpenAutoFocus={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(`search-type-${pendingType}`)
                      ?.focus();
                  }}
                >
                  <div className="flex items-center px-6 py-4">
                    <div className="h-12 w-12 shrink-0" aria-hidden />
                    <DialogTitle className="flex-1 text-center font-semibold text-xl leading-none">
                      Filter by type
                    </DialogTitle>
                    <DialogClose className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close</span>
                    </DialogClose>
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col px-6 pt-2">
                    <RadioGroup
                      value={pendingType}
                      onValueChange={(value) =>
                        setPendingType(value as TypeParam)
                      }
                      className="gap-5 px-2"
                    >
                      {TYPE_OPTIONS.map(([value, label]) => (
                        <div
                          key={value}
                          className="flex items-center gap-4 py-1"
                        >
                          <RadioGroupItem
                            value={value}
                            id={`search-type-${value}`}
                            className="h-5 w-5 border-neutral-300 text-red-600 focus-visible:ring-red-600 data-[state=checked]:border-red-600 [&_svg]:fill-red-600"
                          />
                          <Label
                            htmlFor={`search-type-${value}`}
                            className={cn(
                              "cursor-pointer font-normal text-lg leading-snug",
                              pendingType === value && "text-red-600",
                            )}
                          >
                            {label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="px-6 pt-6 pb-8">
                    <Button
                      type="button"
                      className="h-12 w-full rounded-lg bg-red-600 font-sans text-base text-white hover:bg-red-700"
                      onClick={handleApplyTypeFilter}
                    >
                      Apply
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Select
                value={sort}
                onValueChange={(value) => handleSort(value as SortParam)}
              >
                <SelectTrigger
                  className="h-9 w-auto shrink-0 justify-start gap-2 rounded-lg px-3 font-sans [&>span]:hidden"
                  aria-label={`Sort, ${sort === "newest" ? "Newest" : "Relevance"} selected`}
                >
                  <ArrowDownUp className="h-4 w-4 shrink-0" />
                  Sort
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop filters (xl and up) */}
            <div className="hidden flex-col gap-8 xl:flex xl:flex-row xl:flex-wrap xl:items-center xl:justify-start">
              <div className="flex flex-row flex-wrap items-center gap-2">
                <span className="font-sans font-semibold text-muted-foreground text-sm">
                  Type
                </span>
                {TYPE_OPTIONS.map(([value, label]) => {
                  const isActive = type === value;
                  return (
                    <Button
                      key={value}
                      type="button"
                      variant={isActive ? "default" : "outline"}
                      className={desktopFilterLinkClass(isActive)}
                      onClick={() => handleType(value)}
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-sans font-semibold text-muted-foreground text-sm">
                  Sort
                </span>
                <Button
                  type="button"
                  variant={sort === "relevance" ? "default" : "outline"}
                  className={desktopFilterLinkClass(sort === "relevance")}
                  onClick={() => handleSort("relevance")}
                >
                  Relevance
                </Button>
                <Button
                  type="button"
                  variant={sort === "newest" ? "default" : "outline"}
                  className={desktopFilterLinkClass(sort === "newest")}
                  onClick={() => handleSort("newest")}
                >
                  Newest
                </Button>
              </div>
            </div>
            <p className="font-sans text-foreground text-sm">
              {error ? (
                <span className="text-red-600">
                  Search could not be completed.
                </span>
              ) : isLoading ? (
                <>
                  Searching for <span className="font-semibold">{q}</span> in{" "}
                  {typePostsLabel} posts
                </>
              ) : total > 0 ? (
                <>
                  Displaying {startIdx}–{endIdx} of {total} results for{" "}
                  <span className="font-semibold">{q}</span> in {typePostsLabel}{" "}
                  posts
                </>
              ) : (
                <>
                  No results for &ldquo;{q}&rdquo; in {typePostsLabel} posts
                </>
              )}
            </p>

            {isLoading ? (
              <div className="animate-pulse space-y-8">
                <div className="mb-4 h-6 w-1/3 rounded bg-gray-200" />
                <div className="space-y-8">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex gap-6 border-border border-b pb-8"
                    >
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
            ) : error ? (
              <div className="py-12 text-center">
                <p className="mb-4 text-red-500">{error}</p>
                <Button
                  type="button"
                  onClick={() => router.refresh()}
                  className="px-4 py-2"
                >
                  Try again
                </Button>
              </div>
            ) : total === 0 ? (
              <div className="py-12 text-center">
                <p className="font-sans text-muted-foreground">
                  No articles matched your search. Try different keywords or
                  check spelling.
                </p>
              </div>
            ) : (
              <>
                <ul className="m-0 list-none space-y-4 p-0 md:space-y-6">
                  {results.map((article) => (
                    <li
                      key={article._id}
                      className="border-neutral-200 border-t pt-4 first:border-t-0 first:pt-0 md:pt-6 max-md:[&_.search-result-excerpt]:hidden"
                    >
                      <ArticleFamilyCard
                        article={article}
                        layout="compact"
                        showPostTypeBadge
                        showAuthor
                        showExcerpt
                        hideExcerptOnMobile
                        hideAuthorOnMobile
                        hidePostTypeBadgeOnMobile
                        enlargeMobileThumb
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
                      className="rounded-xl bg-transparent px-6 py-6 font-medium font-sans text-base text-neutral-900"
                      onClick={() => handlePage(page - 1)}
                    >
                      <ChevronLeft className="mr-2 h-5 w-5" />
                      Prev
                    </Button>
                    <span className="font-sans text-muted-foreground text-sm">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={page >= totalPages}
                      className="rounded-xl bg-transparent px-6 py-6 font-medium font-sans text-base text-neutral-900"
                      onClick={() => handlePage(page + 1)}
                    >
                      Next
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
