import { FEED_SEARCH_EDITORIAL_TYPES } from "../article-family/feed-policies";
import type { SortParam, TypeParam } from "./editorial-search-types";

const editorialSearchTypes = new Set<string>(FEED_SEARCH_EDITORIAL_TYPES);

export function parseSort(raw: string | null): SortParam {
  const s = (raw || "relevance").toLowerCase();
  if (s === "relevancy") return "relevance";
  if (s === "newest") return "newest";
  return "relevance";
}

export function parseType(raw: string | null): TypeParam {
  const t = (raw || "all").toLowerCase();
  if (editorialSearchTypes.has(t) || t === "sponsored") {
    return t as Exclude<TypeParam, "all">;
  }
  return "all";
}

export function parsePage(raw: string | null): number {
  const n = parseInt(raw || "1", 10);
  return Number.isFinite(n) && n >= 1 ? n : 1;
}
