import type { ArticleFamilyCard } from "./types";

export { isArticleFamilyDocType } from "./normalize-doc-type";
export { normalizeArticleFamily } from "./normalize-core";
import { normalizeArticleFamily } from "./normalize-core";

export function normalizeArticleFamilyCard(
  raw: unknown,
): ArticleFamilyCard | null {
  return normalizeArticleFamily(raw) as ArticleFamilyCard | null;
}
