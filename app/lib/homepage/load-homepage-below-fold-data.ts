import "server-only";

import { enrichCoverMediaInTree } from "@/lib/editorial-image/enrich-cover-media";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  homepageFifthSectionBundleQuery,
  homepageSixthSectionBundleQuery,
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
    secondSectionData,
    thirdSectionData,
    fourthSectionData,
    seventhSectionData,
    sixthSectionBundle,
    fifthSectionBundle,
  ] = await Promise.all([
    getSecondSectionData(
      ["tech", "business", "entertainment"],
      ["Tech", "Business", "Entertainment"],
    ),
    getThirdSectionData(),
    getFourthSectionData(),
    getSeventhSectionData(),
    sanityFetchStatic({
      query: homepageSixthSectionBundleQuery,
      params: {
        leftSlug: "us",
        centerSlug: "politics",
        rightSlug: "business",
      },
      tag: "homepage.sixth-section.bundle",
    }),
    sanityFetchStatic({
      query: homepageFifthSectionBundleQuery,
      params: {
        leftSlug: HOMEPAGE_FIFTH_SECTION_CATEGORIES.left.slug,
        leftLimit: HOMEPAGE_FIFTH_SECTION_LEFT_FETCH_LIMIT,
        rightSlug: HOMEPAGE_FIFTH_SECTION_CATEGORIES.right.slug,
        rightLimit: HOMEPAGE_FIFTH_SECTION_RIGHT_FETCH_LIMIT,
      },
      tag: "homepage.fifth-section.bundle",
    }),
  ]);

  const sixthSectionLeftArticle = sixthSectionBundle?.leftPost ?? null;
  const sixthSectionCenterArticle = sixthSectionBundle?.centerPost ?? null;
  const sixthSectionRightArticle = sixthSectionBundle?.rightPost ?? null;

  const fifthSectionLeftCards = fifthSectionCardsForCategory(
    fifthSectionBundle?.leftPosts,
    HOMEPAGE_FIFTH_SECTION_CATEGORIES.left.slug,
    HOMEPAGE_FIFTH_SECTION_LEFT_FETCH_LIMIT,
  );
  const fifthSectionRightCards = fifthSectionCardsForCategory(
    fifthSectionBundle?.rightPosts,
    HOMEPAGE_FIFTH_SECTION_CATEGORIES.right.slug,
    HOMEPAGE_FIFTH_SECTION_RIGHT_FETCH_LIMIT,
  );

  return (await enrichCoverMediaInTree({
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
  })) as {
    secondSectionData: typeof secondSectionData;
    thirdSectionData: typeof thirdSectionData;
    fourthSectionData: typeof fourthSectionData;
    seventhSectionData: typeof seventhSectionData;
    fifthSection: {
      leftColumnPosts: typeof fifthSectionLeftCards;
      rightColumnPosts: typeof fifthSectionRightCards;
      leftCategory: (typeof HOMEPAGE_FIFTH_SECTION_CATEGORIES)["left"];
      rightCategory: (typeof HOMEPAGE_FIFTH_SECTION_CATEGORIES)["right"];
    };
    sixthSection: {
      leftArticle: typeof sixthSectionLeftArticle;
      centerArticle: typeof sixthSectionCenterArticle;
      rightArticle: typeof sixthSectionRightArticle;
    } | null;
  };
}
