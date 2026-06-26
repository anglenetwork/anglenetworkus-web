import type { ArticleFamilyDocType } from "./types";

export function isArticleFamilyDocType(t: string): t is ArticleFamilyDocType {
  return (
    t === "post" || t === "opinion" || t === "analysis" || t === "sponsored"
  );
}
