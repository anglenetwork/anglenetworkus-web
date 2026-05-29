import { client } from "@/sanity/lib/client";
import {
  searchEditorialAllRelevanceQuery,
  searchEditorialAllNewestQuery,
  searchEditorialPostRelevanceQuery,
  searchEditorialPostNewestQuery,
  searchEditorialOpinionRelevanceQuery,
  searchEditorialOpinionNewestQuery,
  searchEditorialAnalysisRelevanceQuery,
  searchEditorialAnalysisNewestQuery,
  searchEditorialSponsoredRelevanceQuery,
  searchEditorialSponsoredNewestQuery,
  searchEditorialCountAllQuery,
  searchEditorialCountPostQuery,
  searchEditorialCountOpinionQuery,
  searchEditorialCountAnalysisQuery,
  searchEditorialCountSponsoredQuery,
} from "@/sanity/lib/queries";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";
import type { ArticleFamilySearchResult } from "@/app/lib/article-family/types";
import {
  parsePage,
  parseSort,
  parseType,
  tokenizeTerm,
  type SortParam,
  type TypeParam,
} from "@/app/lib/search/editorial-search";

export const EDITORIAL_SEARCH_PAGE_SIZE = 10;

export type EditorialSearchResult = {
  query: string;
  sort: SortParam;
  type: TypeParam;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  results: ArticleFamilySearchResult[];
};

function listQueryFor(sort: SortParam, type: TypeParam): string {
  if (sort === "newest") {
    switch (type) {
      case "post":
        return searchEditorialPostNewestQuery;
      case "opinion":
        return searchEditorialOpinionNewestQuery;
      case "analysis":
        return searchEditorialAnalysisNewestQuery;
      case "sponsored":
        return searchEditorialSponsoredNewestQuery;
      default:
        return searchEditorialAllNewestQuery;
    }
  }
  switch (type) {
    case "post":
      return searchEditorialPostRelevanceQuery;
    case "opinion":
      return searchEditorialOpinionRelevanceQuery;
    case "analysis":
      return searchEditorialAnalysisRelevanceQuery;
    case "sponsored":
      return searchEditorialSponsoredRelevanceQuery;
    default:
      return searchEditorialAllRelevanceQuery;
  }
}

function countQueryFor(type: TypeParam) {
  switch (type) {
    case "post":
      return searchEditorialCountPostQuery;
    case "opinion":
      return searchEditorialCountOpinionQuery;
    case "analysis":
      return searchEditorialCountAnalysisQuery;
    case "sponsored":
      return searchEditorialCountSponsoredQuery;
    default:
      return searchEditorialCountAllQuery;
  }
}

export async function runEditorialSearch(args: {
  q: string;
  sort?: SortParam | string | null;
  type?: TypeParam | string | null;
  page?: number | string | null;
}): Promise<EditorialSearchResult> {
  const qRaw = args.q.trim();
  const sort = parseSort(args.sort ?? null);
  const type = parseType(args.type ?? null);
  const page = parsePage(args.page ?? null);

  if (!qRaw) {
    return {
      query: "",
      sort,
      type,
      page: 1,
      pageSize: EDITORIAL_SEARCH_PAGE_SIZE,
      total: 0,
      totalPages: 0,
      results: [],
    };
  }

  const term = tokenizeTerm(qRaw);
  const start = (page - 1) * EDITORIAL_SEARCH_PAGE_SIZE;
  const end = start + EDITORIAL_SEARCH_PAGE_SIZE;

  const listQuery = listQueryFor(sort, type);
  const countQ = countQueryFor(type);

  const [rows, totalRaw] = await Promise.all([
    client.fetch(listQuery, { term, start, end }),
    client.fetch(countQ, { term }),
  ]);

  const total = typeof totalRaw === "number" ? totalRaw : 0;
  const totalPages =
    total === 0 ? 0 : Math.max(1, Math.ceil(total / EDITORIAL_SEARCH_PAGE_SIZE));

  const results = (Array.isArray(rows) ? rows : [])
    .map((r: unknown) => normalizeArticleFamilyCard(r))
    .filter((x): x is ArticleFamilySearchResult => x != null);

  return {
    query: qRaw,
    sort,
    type,
    page,
    pageSize: EDITORIAL_SEARCH_PAGE_SIZE,
    total,
    totalPages,
    results,
  };
}
