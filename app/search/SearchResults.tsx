"use client";

import { useSearchParams } from "next/navigation";
import { SearchBar } from "../components/ui/search-bar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCoverImage, urlForImage } from "@/sanity/lib/utils";
import { ImageRenderer } from "../components/ui/image-renderer";
import { Button } from "../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Types for search results
interface SearchPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
  } | null;
  date: string;
  author?: {
    name: string;
    picture?: any;
  };
  category?: {
    title: string;
    slug: string;
  };
  tags?: Array<{
    name: string;
    slug: string;
  }>;
}

interface SearchTag {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  emoji?: string;
  color?: string;
  featured?: boolean;
}

interface SearchTopic {
  _id: string;
  title: string;
  slug: string;
  kind: string;
  description?: string;
  image?: any;
}

interface SearchResults {
  posts: SearchPost[];
  tags: SearchTag[];
  topics: SearchTopic[];
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Safely get the query parameter
  const query = searchParams?.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [searchResults, setSearchResults] = useState<SearchResults | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination and sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"newest" | "relevancy">("relevancy");
  const resultsPerPage = 10;

  // Helper function to get image URL from Sanity image
  const getImageUrl = (
    image: any,
    width: number = 400,
    height: number = 300
  ) => {
    if (!image) return null;
    const imageUrl = urlForImage(image);
    if (!imageUrl) {
      console.log("No image URL generated for:", image);
      return null;
    }
    return imageUrl.width(width).height(height).fit("max").quality(85).url();
  };

  // Pagination helper functions
  const getTotalResults = () => {
    if (!searchResults) return 0;
    return (
      (searchResults.posts?.length || 0) +
      (searchResults.tags?.length || 0) +
      (searchResults.topics?.length || 0)
    );
  };

  const getCurrentResults = () => {
    if (!searchResults) return [];
    const allResults = [
      ...(searchResults.posts || []).map((post) => ({
        ...post,
        type: "post" as const,
      })),
      ...(searchResults.tags || []).map((tag) => ({
        ...tag,
        type: "tag" as const,
      })),
      ...(searchResults.topics || []).map((topic) => ({
        ...topic,
        type: "topic" as const,
      })),
    ];

    // Results are already sorted server-side, just paginate
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return allResults.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(getTotalResults() / resultsPerPage);
  };

  const getPageNumbers = () => {
    const totalPages = getTotalPages();
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < getTotalPages()) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Update local state when URL changes and perform search
  useEffect(() => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset pagination when search changes
    if (query.trim()) {
      performSearch(query.trim());
    } else {
      setSearchResults(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Reset pagination and re-search when sort changes
  useEffect(() => {
    setCurrentPage(1);
    if (query.trim()) {
      performSearch(query.trim(), sortBy);
    }
  }, [sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

  const performSearch = async (
    searchTerm: string,
    sortByParam?: "newest" | "relevancy"
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const sortParam = sortByParam || sortBy;
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchTerm)}&sort=${sortParam}`
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      setSearchResults(data.results);
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      try {
        router.push(`/search?q=${encodeURIComponent(newQuery.trim())}`);
      } catch (error) {
        console.error("Error navigating to search results:", error);
      }
    }
  };

  const currentResults = getCurrentResults();
  const totalResults = getTotalResults();
  const totalPages = getTotalPages();
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = Math.min(startIndex + resultsPerPage, totalResults);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            placeholder="Search news, articles, topics and more"
            ariaLabel="search bar"
            onSubmit={handleSearch}
          />
        </div>

        {query ? (
          <>
            {/* Header with sorting */}
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-base text-foreground font-secondary">
                Displaying {startIndex + 1}-{endIndex} results out of{" "}
                {totalResults} for{" "}
                <span className="font-semibold">{searchQuery}</span>
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-secondary">
                  Sorting by
                </span>
                <Button
                  variant={sortBy === "newest" ? "default" : "outline"}
                  onClick={() => setSortBy("newest")}
                  className="rounded-lg font-secondary"
                >
                  Newest
                </Button>
                <Button
                  variant={sortBy === "relevancy" ? "default" : "outline"}
                  onClick={() => setSortBy("relevancy")}
                  className="rounded-lg font-secondary"
                >
                  Relevancy
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-8">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-8">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex gap-6 border-b border-border pb-8"
                      >
                        <div className="h-[240px] w-[360px] bg-gray-200 rounded-lg"></div>
                        <div className="flex-1 space-y-4">
                          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">Error: {error}</p>
                <Button
                  onClick={() => performSearch(query)}
                  className="px-4 py-2"
                >
                  Try Again
                </Button>
              </div>
            ) : searchResults ? (
              <>
                {/* Search Results */}
                <div className="space-y-12">
                  {currentResults.length > 0 ? (
                    currentResults.map((result) => {
                      const getHref = () => {
                        const slug =
                          typeof result.slug === "object" &&
                          result.slug &&
                          "current" in result.slug
                            ? (result.slug as any).current
                            : result.slug;
                        if (result.type === "post") return `/post/${slug}`;
                        if (result.type === "tag") return `/tag/${slug}`;
                        if (result.type === "topic") return `/topic/${slug}`;
                        return "#";
                      };

                      return (
                        <Link key={result._id} href={getHref()}>
                          <article className="flex gap-6 border-t border-neutral-200 pt-8 transition-colors pb-4">
                            <div className="relative h-48 w-64 flex-shrink-0 overflow-hidden">
                              {(() => {
                                if (result.type === "post" && result.cover) {
                                  const coverData = getCoverImage(
                                    result.cover,
                                    result.title
                                  );
                                  if (coverData?.src) {
                                    return (
                                      <ImageRenderer
                                        src={coverData.src}
                                        alt={coverData.alt}
                                        width={640}
                                        height={480}
                                        fill
                                        unoptimized={coverData.unoptimized}
                                        className="object-cover"
                                      />
                                    );
                                  }
                                } else if (
                                  result.type === "topic" &&
                                  result.image
                                ) {
                                  const imageUrl = urlForImage(result.image);
                                  if (imageUrl) {
                                    const url = imageUrl
                                      .width(360)
                                      .height(240)
                                      .fit("max")
                                      .quality(85)
                                      .url();
                                    return (
                                      <ImageRenderer
                                        src={url}
                                        alt={result.image.alt || result.title}
                                        width={360}
                                        height={240}
                                        fill
                                        className="object-cover"
                                      />
                                    );
                                  }
                                }
                                return (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400">
                                      No Image
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>
                            <div className="flex flex-col">
                              <h2 className="mb-3 font-sans text-2xl font-medium leading-tight text-foreground">
                                {result.type === "tag"
                                  ? result.name
                                  : result.title}
                              </h2>
                              <time className="mb-4 font-secondary font-light text-sm text-muted-foreground text-neutral-400">
                                {result.type === "post" && result.date
                                  ? new Date(result.date).toLocaleDateString()
                                  : "No date"}
                              </time>
                              <p className="text-base font-regular font-secondary leading-relaxed text-foreground tracking-normal font-neutral-900">
                                {result.type === "post" && result.excerpt
                                  ? result.excerpt
                                  : result.type === "tag" && result.description
                                    ? result.description
                                    : result.type === "topic" &&
                                        result.description
                                      ? result.description
                                      : "No description available"}
                              </p>
                            </div>
                          </article>
                        </Link>
                      );
                    })
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        No results found for &ldquo;{query}&rdquo;. Try
                        different keywords or check your spelling.
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="rounded-xl px-6 py-6 font-secondary text-base font-medium bg-transparent text-neutral-900"
                    >
                      <ChevronLeft className="mr-2 h-5 w-5" />
                      Prev
                    </Button>

                    <div className="flex items-center gap-2">
                      {getPageNumbers().map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative px-4 py-2 text-xl font-medium transition-colors font-sans ${
                            currentPage === pageNum
                              ? "text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {pageNum}
                          {currentPage === pageNum && (
                            <span className="absolute bottom-0 left-0 right-0 h-1 bg-red-600" />
                          )}
                        </button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="rounded-xl px-6 py-6 font-secondary text-base font-medium bg-transparent text-neutral-900"
                    >
                      Next
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}
              </>
            ) : null}
          </>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Search</h1>
            <p className="text-muted-foreground">
              Enter a search term above to find articles, topics, and more.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
