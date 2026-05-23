export type SortParam = "relevance" | "newest";
export type TypeParam = "all" | "post" | "opinion" | "analysis" | "sponsored";

export function parseSort(raw: string | null): SortParam {
  const s = (raw || "relevance").toLowerCase();
  if (s === "relevancy") return "relevance";
  if (s === "newest") return "newest";
  return "relevance";
}

export function parseType(raw: string | null): TypeParam {
  const t = (raw || "all").toLowerCase();
  if (
    t === "post" ||
    t === "opinion" ||
    t === "analysis" ||
    t === "sponsored"
  ) {
    return t;
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
