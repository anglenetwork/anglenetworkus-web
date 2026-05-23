import { NextRequest, NextResponse } from "next/server";
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

const PAGE_SIZE = 10;

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

/**
 * Article search: post, opinion, analysis, sponsored.
 * `type=all` returns editorial types only (post, opinion, analysis).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const qRaw = (searchParams.get("q") || "").trim();
    const sort = parseSort(searchParams.get("sort"));
    const type = parseType(searchParams.get("type"));
    const page = parsePage(searchParams.get("page"));

    if (!qRaw) {
      return NextResponse.json({
        query: "",
        sort,
        type,
        page: 1,
        pageSize: PAGE_SIZE,
        total: 0,
        totalPages: 0,
        results: [] as ArticleFamilySearchResult[],
      });
    }

    const term = tokenizeTerm(qRaw);
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    const listQuery = listQueryFor(sort, type);
    const countQ = countQueryFor(type);

    const [rows, totalRaw] = await Promise.all([
      client.fetch(listQuery, { term, start, end }),
      client.fetch(countQ, { term }),
    ]);

    const total = typeof totalRaw === "number" ? totalRaw : 0;
    const totalPages =
      total === 0 ? 0 : Math.max(1, Math.ceil(total / PAGE_SIZE));

    const results = (Array.isArray(rows) ? rows : [])
      .map((r: unknown) => normalizeArticleFamilyCard(r))
      .filter((x): x is ArticleFamilySearchResult => x != null);

    return NextResponse.json({
      query: qRaw,
      sort,
      type,
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages,
      results,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
