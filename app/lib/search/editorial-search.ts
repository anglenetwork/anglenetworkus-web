import { FEED_SEARCH_EDITORIAL_TYPES } from "../article-family/feed-policies";

export type SortParam = "relevance" | "newest";
export type TypeParam = "all" | "post" | "opinion" | "analysis" | "sponsored";

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

/** Whitespace-split terms; each token gets a prefix wildcard for GROQ `match`. */
export function tokenizeTerm(q: string): string {
  return q
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => `${t}*`)
    .join(" ");
}
