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
  searchEditorialCountAllQuery,
  searchEditorialCountPostQuery,
  searchEditorialCountOpinionQuery,
  searchEditorialCountAnalysisQuery,
} from "@/sanity/lib/queries";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";
import type { ArticleFamilySearchResult } from "@/app/lib/article-family/types";

const PAGE_SIZE = 10;

type SortParam = "relevance" | "newest";
type TypeParam = "all" | "post" | "opinion" | "analysis";

function parseSort(raw: string | null): SortParam {
  const s = (raw || "relevance").toLowerCase();
  if (s === "relevancy") return "relevance";
  if (s === "newest") return "newest";
  return "relevance";
}

function parseType(raw: string | null): TypeParam {
  const t = (raw || "all").toLowerCase();
  if (t === "post" || t === "opinion" || t === "analysis") return t;
  return "all";
}

function parsePage(raw: string | null): number {
  const n = parseInt(raw || "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function tokenizeTerm(q: string): string {
  return q
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => `${t}*`)
    .join(" ");
}

function listQueryFor(sort: SortParam, type: TypeParam): string {
  if (sort === "newest") {
    switch (type) {
      case "post":
        return searchEditorialPostNewestQuery;
      case "opinion":
        return searchEditorialOpinionNewestQuery;
      case "analysis":
        return searchEditorialAnalysisNewestQuery;
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
    default:
      return searchEditorialCountAllQuery;
  }
}

/**
 * Editorial article search: post, opinion, analysis (sponsored excluded).
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
