import "server-only";

import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  highlightedStoriesByCategoryQuery,
  postsByCategoryStandardPostsLimitedQuery,
} from "@/sanity/lib/queries";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";
import type { ArticleFamilyCard } from "@/app/lib/article-family/types";
import {
  getSeventhSectionData,
  getSecondSectionData,
  getThirdSectionData,
} from "@/app/lib/homepage";
import { getFourthSectionData } from "@/app/lib/homepage-fourth-section";
import {
  HOMEPAGE_FIFTH_SECTION_CATEGORIES,
  HOMEPAGE_FIFTH_SECTION_LEFT_FETCH_LIMIT,
  HOMEPAGE_FIFTH_SECTION_RIGHT_FETCH_LIMIT,
} from "@/app/lib/homepage-fifth-section";

function fifthSectionCardsForCategory(
  raw: unknown,
  categorySlug: string,
  maxRows: number,
): ArticleFamilyCard[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, maxRows)
    .map((row) => normalizeArticleFamilyCard(row))
    .filter(
      (card): card is ArticleFamilyCard =>
        card != null &&
        !!card.slug &&
        !!card.href &&
        card.category?.slug === categorySlug,
    );
}

export async function loadHomepageBelowFoldData() {
  const [
    sixthSectionLeftPosts,
    sixthSectionCenterPosts,
    sixthSectionRightPosts,
  ] = await Promise.all([
    sanityFetchStatic({
      query: highlightedStoriesByCategoryQuery,
      params: { categorySlug: "us" },
    }),
    sanityFetchStatic({
      query: highlightedStoriesByCategoryQuery,
      params: { categorySlug: "politics" },
    }),
    sanityFetchStatic({
      query: highlightedStoriesByCategoryQuery,
      params: { categorySlug: "business" },
    }),
  ]);

  const sixthSectionLeftArticle = sixthSectionLeftPosts[0];
  const sixthSectionCenterArticle = sixthSectionCenterPosts[0];
  const sixthSectionRightArticle = sixthSectionRightPosts[0];

  const [
    secondSectionData,
    thirdSectionData,
    fourthSectionData,
    seventhSectionData,
    fifthSectionLeftRaw,
    fifthSectionRightRaw,
  ] = await Promise.all([
    getSecondSectionData(
      ["tech", "business", "entertainment"],
      ["Tech", "Business", "Entertainment"],
    ),
    getThirdSectionData(),
    getFourthSectionData(),
    getSeventhSectionData(),
    sanityFetchStatic({
      query: postsByCategoryStandardPostsLimitedQuery,
      params: {
        categorySlug: HOMEPAGE_FIFTH_SECTION_CATEGORIES.left.slug,
        limit: HOMEPAGE_FIFTH_SECTION_LEFT_FETCH_LIMIT,
      },
      tag: "homepage.fifth-section.left",
    }),
    sanityFetchStatic({
      query: postsByCategoryStandardPostsLimitedQuery,
      params: {
        categorySlug: HOMEPAGE_FIFTH_SECTION_CATEGORIES.right.slug,
        limit: HOMEPAGE_FIFTH_SECTION_RIGHT_FETCH_LIMIT,
      },
      tag: "homepage.fifth-section.right",
    }),
  ]);

  const fifthSectionLeftCards = fifthSectionCardsForCategory(
    fifthSectionLeftRaw,
    HOMEPAGE_FIFTH_SECTION_CATEGORIES.left.slug,
    HOMEPAGE_FIFTH_SECTION_LEFT_FETCH_LIMIT,
  );
  const fifthSectionRightCards = fifthSectionCardsForCategory(
    fifthSectionRightRaw,
    HOMEPAGE_FIFTH_SECTION_CATEGORIES.right.slug,
    HOMEPAGE_FIFTH_SECTION_RIGHT_FETCH_LIMIT,
  );

  return {
    secondSectionData,
    thirdSectionData,
    fourthSectionData,
    seventhSectionData,
    fifthSection: {
      leftColumnPosts: fifthSectionLeftCards,
      rightColumnPosts: fifthSectionRightCards,
      leftCategory: HOMEPAGE_FIFTH_SECTION_CATEGORIES.left,
      rightCategory: HOMEPAGE_FIFTH_SECTION_CATEGORIES.right,
    },
    sixthSection:
      sixthSectionLeftArticle?.slug &&
      sixthSectionCenterArticle?.slug &&
      sixthSectionRightArticle?.slug
        ? {
            leftArticle: sixthSectionLeftArticle,
            centerArticle: sixthSectionCenterArticle,
            rightArticle: sixthSectionRightArticle,
          }
        : null,
  };
}
