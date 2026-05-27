import { preload } from "react-dom";

/**
 * Hints the article cover URL before hydration (React 19 server preload).
 * Uses the same src as ArticleMedia / ImageRenderer for LCP.
 */
export function ArticleCoverPreload({ src }: { src: string | null }) {
  if (!src) return null;
  preload(src, { as: "image", fetchPriority: "high" });
  return null;
}
