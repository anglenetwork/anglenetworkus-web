import { FirstSection, NewsTicker } from "./components/Landing/index";
import {
  HomepageBelowFoldBottom,
  HomepageBelowFoldTop,
} from "./components/Landing/homepage-below-fold";
import EditorialRailsSection from "./components/article-family/EditorialRailsSection";
import dynamic from "next/dynamic";
import { toPlainText } from "next-sanity";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import * as demo from "@/sanity/lib/demo";
import { getCachedSettings } from "@/app/lib/cached-settings";
import { jsonLdScriptContent } from "@/app/lib/article-family/structured-data";
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
  homepageMostReadFallbackQuery,
  homepageHeroFrontlineQuery,
  homepageHeroJustInQuery,
  homepageHeroMainHeadlineQuery,
  homepageHeroRelatedByCategoryQuery,
  homepageHeroRightHeadlineQuery,
  highlightedStoriesByCategoryQuery,
  newsTickerQuery,
  postsByCategoryStandardPostsLimitedQuery,
  postsByIdsLightweightQuery,
} from "@/sanity/lib/queries";
import {
  getMostReadPosts,
  orderDocumentsByIds,
} from "@/app/lib/article-family/metrics";
import { logDevMetricsFallback } from "@/app/lib/article-family/metrics-dev-log";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";
import type { ArticleFamilyCard } from "@/app/lib/article-family/types";
import { getFourthSectionData, getSecondSectionData } from "./lib/homepage";
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

function fourthSectionCardsForCategory(
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

async function loadHomepageMostReadPosts() {
  try {
    const ranked = await getMostReadPosts({ limit: 24 });
    const hasActivity = ranked.some((r) => r.views7d > 0 || r.viewsAll > 0);
    if (!ranked.length || !hasActivity) {
      logDevMetricsFallback("homepage_most_read", "empty_or_no_activity");
      return await sanityFetchStatic({ query: homepageMostReadFallbackQuery });
    }
    const ids = ranked.map((r) => r.articleId).slice(0, 5);
    const raw = await sanityFetchStatic({
      query: postsByIdsLightweightQuery,
      params: { ids },
    });
    const ordered = orderDocumentsByIds(raw as { _id: string }[], ids);
    if (ordered.length === 0) {
      logDevMetricsFallback("homepage_most_read", "empty_or_no_activity");
    }
    return ordered.length > 0
      ? ordered
      : await sanityFetchStatic({
          query: homepageMostReadFallbackQuery,
        });
  } catch {
    logDevMetricsFallback("homepage_most_read", "infra_error");
    return await sanityFetchStatic({ query: homepageMostReadFallbackQuery });
  }
}

function PromoSectionPlaceholder() {
  return (
    <div
      className="relative h-96 w-full overflow-hidden rounded-md bg-neutral-900"
      aria-hidden
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black" />
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
  const [
    justInPosts,
    mainHeadlinePosts,
    frontlinePosts,
    rightHeadlinePosts,
    mostReadPosts,
  ] = await Promise.all([
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
    // 2) Most read posts (Supabase metrics + Sanity cards; fallback recency)
    loadHomepageMostReadPosts(),
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

  // 3) Fetch posts for ThirdSection (1 featured + 2 small per column)
  const [thirdSectionLeftPosts, thirdSectionRightPosts] = await Promise.all([
    sanityFetchStatic({
      query: highlightedStoriesByCategoryQuery,
      params: { categorySlug: "us" },
    }),
    sanityFetchStatic({
      query: highlightedStoriesByCategoryQuery,
      params: { categorySlug: "politics" },
    }),
  ]);

  // 4) Fetch latest posts for news ticker (component shows up to 4)
  const newsTickerPosts = await sanityFetchStatic({
    query: newsTickerQuery,
  });

  // 5) Below-the-fold: second + sixth sections (fourth fetched separately so category
  //    params cannot be mixed with other parallel Sanity calls).
  const [secondSectionData, sixthSectionData] = await Promise.all([
    getFourthSectionData(
      ["tech", "business", "entertainment", "lifestyle"],
      ["Tech", "Business", "Entertainment", "Lifestyle"],
    ),
    getSecondSectionData(),
  ]);

  // Newest `post` only per category (no analysis) — `/category/[slug]` still uses post+analysis.
  const [fourthSectionLeftRaw, fourthSectionRightRaw] = await Promise.all([
    sanityFetchStatic({
      query: postsByCategoryStandardPostsLimitedQuery,
      params: {
        categorySlug: HOMEPAGE_FIFTH_SECTION_CATEGORIES.left.slug,
        limit: HOMEPAGE_FIFTH_SECTION_LEFT_FETCH_LIMIT,
      },
      tag: "homepage.fifth-column.left",
    }),
    sanityFetchStatic({
      query: postsByCategoryStandardPostsLimitedQuery,
      params: {
        categorySlug: HOMEPAGE_FIFTH_SECTION_CATEGORIES.right.slug,
        limit: HOMEPAGE_FIFTH_SECTION_RIGHT_FETCH_LIMIT,
      },
      tag: "homepage.fifth-column.right",
    }),
  ]);

  const fourthSectionLeftCards = fourthSectionCardsForCategory(
    fourthSectionLeftRaw,
    HOMEPAGE_FIFTH_SECTION_CATEGORIES.left.slug,
    HOMEPAGE_FIFTH_SECTION_LEFT_FETCH_LIMIT,
  );
  const fourthSectionRightCards = fourthSectionCardsForCategory(
    fourthSectionRightRaw,
    HOMEPAGE_FIFTH_SECTION_CATEGORIES.right.slug,
    HOMEPAGE_FIFTH_SECTION_RIGHT_FETCH_LIMIT,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScriptContent(organizationLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScriptContent(websiteLd),
        }}
      />
      <SitePageWidth>
        <NewsTicker posts={newsTickerPosts as any} />
        <div className="space-y-10 md:space-y-14">
          <FirstSection
            justInNews={justInPosts as any}
            mainStory={mainHeadlinePosts as any}
            relatedCategoryPosts={relatedCategoryPosts as any}
            moreTopHeadlines={frontlinePosts as any}
            sideStories={rightHeadlinePosts as any}
            mostReadPosts={mostReadPosts as any}
          />
          <HomepageBelowFoldTop
            secondSection={{
              variant: "dark",
              categoriesData: secondSectionData as any,
            }}
            thirdSection={
              thirdSectionLeftPosts?.length > 0 &&
              thirdSectionRightPosts?.length > 0
                ? {
                    leftArticle: thirdSectionLeftPosts[0] as any,
                    leftSmallArticles: (
                      thirdSectionLeftPosts.slice(1, 3) as any[]
                    ).filter((p) => p.slug),
                    rightArticle: thirdSectionRightPosts[0] as any,
                    rightSmallArticles: (
                      thirdSectionRightPosts.slice(1, 3) as any[]
                    ).filter((p) => p.slug),
                  }
                : null
            }
          />
          <EditorialRailsSection />
          <HomepageBelowFoldBottom
            fourthSection={{
              leftColumnPosts: fourthSectionLeftCards,
              rightColumnPosts: fourthSectionRightCards,
              leftCategory: HOMEPAGE_FIFTH_SECTION_CATEGORIES.left,
              rightCategory: HOMEPAGE_FIFTH_SECTION_CATEGORIES.right,
            }}
            sixthSection={{ categoriesData: sixthSectionData as any }}
          />
          {/* <PromoSection /> */}
          {/* Light variant duplicate (FourthSection/seventhSection.tsx), not wired:
          <SecondSection variant="light" categoriesData={secondSectionData as any} />
          */}
        </div>
      </SitePageWidth>
    </>
  );
}
