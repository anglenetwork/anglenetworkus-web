import type { ArticleFamilyCard as CardModel } from "@/app/lib/article-family/types";

export function typeLabel(
  t: CardModel["_type"],
  showPostAsNews: boolean,
): string | null {
  switch (t) {
    case "post":
      return showPostAsNews ? "News" : null;
    case "opinion":
      return "Opinion";
    case "analysis":
      return "Analysis";
    case "sponsored":
      return "Sponsored";
    default:
      return null;
  }
}

/** Category-first kicker (homepage opinion rail). */
export function editorialKicker(
  article: CardModel,
  fallbackTypeLabel: string | null,
): string {
  const cat = article.category?.title?.trim();
  if (cat) return cat;
  if (article._type === "opinion") return "Opinion";
  if (article._type === "analysis") return "Analysis";
  return fallbackTypeLabel || "Trending";
}

export function searchResultSectionKicker(
  article: CardModel,
  label: string | null,
): { title: string; href?: string } | null {
  const categoryTitle = article.category?.title?.trim();
  const categorySlug = article.category?.slug?.trim();
  if (categoryTitle && categorySlug) {
    return { title: categoryTitle, href: `/category/${categorySlug}` };
  }
  if (!label) return null;

  const href =
    article._type === "opinion"
      ? "/opinion"
      : article._type === "analysis"
        ? "/analysis"
        : undefined;

  return { title: label, href };
}
