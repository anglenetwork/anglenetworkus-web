import { FirstSection } from "./components/Landing/FirstSection/firstSection";
import { NewsTicker } from "./components/Landing/NewsTicker/NewsTicker";
import { HomepageBelowFoldLazy } from "./components/Landing/homepage-below-fold-lazy";
import { HOMEPAGE_BELOW_FOLD_SECTION_GAP } from "./components/Landing/homepage-below-fold-spacing";
import EditorialRailsSection from "./components/article-family/EditorialRailsSection";
import { JsonLdScript } from "./components/seo/json-ld-script";
import dynamic from "next/dynamic";
import { toPlainText } from "next-sanity";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import * as demo from "@/sanity/lib/demo";
import { getCachedSettings } from "@/app/lib/cached-settings";
import {
  buildHomepageMetadata,
  finalizePublicMetadata,
  resolveSiteName,
} from "@/app/lib/seo/metadata-builders";
import { buildWebsiteJsonLd } from "@/app/lib/seo/json-ld";
import {
  buildNewsMediaOrganizationJsonLd,
  organizationJsonLdId,
} from "@/app/lib/seo/publisher";
import { getPublicSiteUrl } from "@/app/lib/seo/site-url";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import {
  homepageHeroFrontlineQuery,
  homepageHeroJustInQuery,
  homepageHeroMainHeadlineQuery,
  homepageHeroRelatedByCategoryQuery,
  homepageHeroRightHeadlineQuery,
  highlightedStoriesByCategoryQuery,
  newsTickerQuery,
  postsByCategoryStandardPostsLimitedQuery,
} from "@/sanity/lib/queries";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";
import type { ArticleFamilyCard } from "@/app/lib/article-family/types";
import {
  getSeventhSectionData,
  getSecondSectionData,
  getThirdSectionData,
} from "./lib/homepage";
import { getFourthSectionData } from "./lib/homepage-fourth-section";
import {
  HOMEPAGE_FIFTH_SECTION_CATEGORIES,
  HOMEPAGE_FIFTH_SECTION_LEFT_FETCH_LIMIT,
  HOMEPAGE_FIFTH_SECTION_RIGHT_FETCH_LIMIT,
} from "./lib/homepage-fifth-section";
import { SitePageWidth } from "@/app/components/layout/site-page-width";

type HeroPostWithCategory = {
  _id: string;
  slug?: string | null;
  category?: { slug?: string | null } | null;
};

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

function PromoSectionPlaceholder() {
  return (
    <div
      className="relative h-96 w-full overflow-hidden rounded-md bg-news-secondary"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-br from-news-secondary via-news-secondary to-black" />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}

const PromoSection = dynamic(
  () =>
    import("./components/ui/thirdSection").then((mod) => ({
      default: mod.ThirdSection,
    })),
  { ssr: true, loading: () => <PromoSectionPlaceholder /> },
);

export async function generateMetadata() {
  const settings = await getCachedSettings();
  return finalizePublicMetadata(
    buildHomepageMetadata(settings, demo.title, toPlainText(demo.description)),
  );
}

export default async function Page() {
  const settings = await getCachedSettings();
  const siteUrl = getPublicSiteUrl();
  const siteName = resolveSiteName(settings, demo.title);
  const orgId = organizationJsonLdId(siteUrl);
  const og = resolveOpenGraphImage(
    settings?.ogImage as Parameters<typeof resolveOpenGraphImage>[0],
  );
  const organizationLd = buildNewsMediaOrganizationJsonLd({
    siteName,
    siteUrl,
    logoUrl: og?.url ?? null,
    id: orgId,
  });
  const websiteLd = buildWebsiteJsonLd({
    siteName,
    siteUrl,
    organizationId: orgId,
  });
  //LANDING PAGE DATA FETCHING
  // 1) Fetch hero slices for FirstSection (server-side filtered/ranked in GROQ)
  const [justInPosts, mainHeadlinePosts, frontlinePosts, rightHeadlinePosts] =
    await Promise.all([
      sanityFetchStatic({
        query: homepageHeroJustInQuery,
        tag: "homepage.hero.just-in",
      }),
      sanityFetchStatic({
        query: homepageHeroMainHeadlineQuery,
        tag: "homepage.hero.main-headline",
      }),
      sanityFetchStatic({
        query: homepageHeroFrontlineQuery,
        tag: "homepage.hero.frontline",
      }),
      sanityFetchStatic({
        query: homepageHeroRightHeadlineQuery,
        tag: "homepage.hero.right-headline",
      }),
    ]);

  const mainStoryPost = (
    Array.isArray(mainHeadlinePosts) ? mainHeadlinePosts[0] : null
  ) as HeroPostWithCategory | null;
  const mainStoryCategorySlug = mainStoryPost?.category?.slug ?? null;
  const relatedCategoryPosts =
    mainStoryCategorySlug && mainStoryPost?._id
      ? await sanityFetchStatic({
          query: homepageHeroRelatedByCategoryQuery,
          params: {
            categorySlug: mainStoryCategorySlug,
            excludePostId: mainStoryPost._id,
          },
          tag: "homepage.hero.related-category",
        })
      : [];

  // 3) Fetch posts for SixthSection (1 featured per column: US, Politics, Business)
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
    newsTickerPosts,
    secondSectionData,
    thirdSectionData,
    fourthSectionData,
    seventhSectionData,
    fifthSectionLeftRaw,
    fifthSectionRightRaw,
  ] = await Promise.all([
    sanityFetchStatic({
      query: newsTickerQuery,
    }),
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

  return (
    <>
      <JsonLdScript data={organizationLd} />
      <JsonLdScript data={websiteLd} />
      <SitePageWidth className="bg-news-surface">
        <NewsTicker posts={newsTickerPosts as any} />
        <div className={`${HOMEPAGE_BELOW_FOLD_SECTION_GAP} pb-10 md:pb-14`}>
          <FirstSection
            justInNews={justInPosts as any}
            mainStory={mainHeadlinePosts as any}
            relatedCategoryPosts={relatedCategoryPosts as any}
            moreTopHeadlines={frontlinePosts as any}
            sideStories={rightHeadlinePosts as any}
          />
          <HomepageBelowFoldLazy
            secondSection={{
              variant: "news",
              categoriesData: secondSectionData as any,
            }}
            thirdSection={{ articles: thirdSectionData }}
            fourthSection={fourthSectionData}
            fifthSection={{
              leftColumnPosts: fifthSectionLeftCards,
              rightColumnPosts: fifthSectionRightCards,
              leftCategory: HOMEPAGE_FIFTH_SECTION_CATEGORIES.left,
              rightCategory: HOMEPAGE_FIFTH_SECTION_CATEGORIES.right,
            }}
            sixthSection={
              sixthSectionLeftArticle?.slug &&
              sixthSectionCenterArticle?.slug &&
              sixthSectionRightArticle?.slug
                ? {
                    leftArticle: sixthSectionLeftArticle as any,
                    centerArticle: sixthSectionCenterArticle as any,
                    rightArticle: sixthSectionRightArticle as any,
                  }
                : null
            }
            seventhSection={{ categoriesData: seventhSectionData as any }}
            opinion={<EditorialRailsSection />}
          />
          {/* <PromoSection /> */}
        </div>
      </SitePageWidth>
    </>
  );
}
