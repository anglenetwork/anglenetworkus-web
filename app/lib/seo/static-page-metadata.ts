import type { Metadata } from "next";
import { buildCanonicalUrl } from "./canonical";
import { robotsIndexableArticle, robotsUtilityNoindex } from "./robots";

export function staticPageMetadata(
  title: string,
  description: string,
  path: string,
  options?: { private?: boolean },
): Metadata {
  const canonical = buildCanonicalUrl(path);
  return {
    title: { absolute: title },
    description,
    robots: options?.private
      ? robotsUtilityNoindex()
      : robotsIndexableArticle(),
    alternates: { canonical },
  };
}
