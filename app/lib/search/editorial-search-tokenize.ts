/** Whitespace-split terms; each token gets a prefix wildcard for GROQ `match`. */
export function tokenizeTerm(q: string): string {
  return q
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => `${t}*`)
    .join(" ");
}
