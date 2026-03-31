import {
  FirstSection,
  NewsTicker,
  SecondSection,
} from "./components/Landing/index";
import EditorialRailsSection from "./components/article-family/EditorialRailsSection";
import { ThirdSection } from "./components/ui/thirdSection";
import dynamic from "next/dynamic";
import { toPlainText } from "next-sanity";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import * as demo from "@/sanity/lib/demo";
import { getCachedSettings } from "@/app/lib/cached-settings";
import {
  buildPublisherForJsonLd,
  jsonLdScriptContent,
} from "@/app/lib/article-family/structured-data";
import {
  buildHomepageMetadata,
  resolveSiteName,
} from "@/app/lib/seo/metadata-builders";
import { buildWebsiteJsonLd } from "@/app/lib/seo/json-ld";
import { getPublicSiteUrl } from "@/app/lib/seo/site-url";
import {
  homepageMostReadFallbackQuery,
  indexQuery,
  latestNineByCategoryQuery,
  newsTickerQuery,
  postsByCategoryQuery,
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
  HOMEPAGE_FIFTH_SECTION_FETCH_LIMIT,
} from "./lib/homepage-fifth-section";
import { SitePageWidth } from "@/app/components/layout/site-page-width";

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

// Dynamically import below-the-fold sections to reduce initial bundle size
const SixthSection = dynamic(
  () => import("./components/Landing/SecondSection/sixthSection"),
  { ssr: true },
);

const FifthSection = dynamic(
  () => import("./components/Landing/ThirdSection/fifthSection"),
  { ssr: true },
);

const FourthSection = dynamic(
  () => import("./components/Landing/FourthSection/fourthSection"),
  { ssr: true },
);

const SeventhSection = dynamic(
  () => import("./components/Landing/FourthSection/seventhSection"),
  { ssr: true },
);

export async function generateMetadata() {
  const settings = await getCachedSettings();
  return buildHomepageMetadata(
    settings,
    demo.title,
    toPlainText(demo.description),
  );
}

export default async function Page() {
  const settings = await getCachedSettings();
  const publisher = buildPublisherForJsonLd(settings, demo.title);
  const websiteLd = buildWebsiteJsonLd({
    siteName: resolveSiteName(settings, demo.title),
    siteUrl: getPublicSiteUrl(),
    publisher,
  });
  //LANDING PAGE DATA FETCHING
  // 1) Fetch posts for FirstSection (hero/main content)
  const firstSectionPosts = await sanityFetchStatic({ query: indexQuery });

  // 2) Most read posts (Supabase metrics + Sanity cards; fallback recency)
  const mostReadPosts = await loadHomepageMostReadPosts();

  // 3) Fetch posts for SecondSection (above the fold, but can be parallelized)
  const [secondSectionLeftPosts, secondSectionRightPosts] = await Promise.all([
    // Left column: US category (1 featured + 6 small)
    sanityFetchStatic({
      query: latestNineByCategoryQuery,
      params: { categorySlug: "us" },
    }),
    // Right column: Politics category (1 featured + 6 small)
    sanityFetchStatic({
      query: latestNineByCategoryQuery,
      params: { categorySlug: "politics" },
    }),
  ]);

  // 4) Fetch latest posts for news ticker (component shows up to 4)
  const newsTickerPosts = await sanityFetchStatic({
    query: newsTickerQuery,
  });

  // 5) Below-the-fold: fourth + sixth sections (fifth fetched separately so category
  //    params cannot be mixed with other parallel Sanity calls).
  const [fourthSectionData, sixthSectionData] = await Promise.all([
    getFourthSectionData(
      ["tech", "business", "entertainment", "lifestyle"],
      ["Tech", "Business", "Entertainment", "Lifestyle"],
    ),
    getSecondSectionData(),
  ]);

  // Same query + params pattern as `/category/[slug]` (`postsByCategoryQuery`).
  // Unique `tag` per column for Sanity CDN / request identity.
  const [fifthSectionLeftRaw, fifthSectionRightRaw] = await Promise.all([
    sanityFetchStatic({
      query: postsByCategoryQuery,
      params: { categorySlug: HOMEPAGE_FIFTH_SECTION_CATEGORIES.left.slug },
      tag: "homepage.fifth-column.left",
    }),
    sanityFetchStatic({
      query: postsByCategoryQuery,
      params: { categorySlug: HOMEPAGE_FIFTH_SECTION_CATEGORIES.right.slug },
      tag: "homepage.fifth-column.right",
    }),
  ]);

  if (process.env.NODE_ENV === "development") {
    const peek = (rows: unknown, label: string, slug: string) => {
      const arr = Array.isArray(rows) ? rows : [];
      const first = arr[0] as { category?: { slug?: string }; title?: string } | undefined;
      console.log("[homepage][fifth-section]", label, {
        slugParam: slug,
        rowCount: arr.length,
        firstCategorySlug: first?.category?.slug,
        firstTitle: first?.title,
      });
    };
    peek(
      fifthSectionLeftRaw,
      "left",
      HOMEPAGE_FIFTH_SECTION_CATEGORIES.left.slug,
    );
    peek(
      fifthSectionRightRaw,
      "right",
      HOMEPAGE_FIFTH_SECTION_CATEGORIES.right.slug,
    );
  }

  return (
    <>
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
            posts={firstSectionPosts as any}
            mostReadPosts={mostReadPosts as any}
          />
          {secondSectionLeftPosts?.length > 0 &&
            secondSectionRightPosts?.length > 0 && (
              <SecondSection
                leftArticle={secondSectionLeftPosts[0] as any}
                leftSmallArticles={(
                  secondSectionLeftPosts.slice(1, 7) as any[]
                ).filter((p) => p.slug)}
                rightArticle={secondSectionRightPosts[0] as any}
                rightSmallArticles={(
                  secondSectionRightPosts.slice(1, 7) as any[]
                ).filter((p) => p.slug)}
              />
            )}

          <FourthSection
            variant="dark"
            categoriesData={fourthSectionData as any}
          />
          <EditorialRailsSection />
          <ThirdSection />
          <FifthSection
            leftColumnPosts={fifthSectionCardsForCategory(
              fifthSectionLeftRaw,
              HOMEPAGE_FIFTH_SECTION_CATEGORIES.left.slug,
              HOMEPAGE_FIFTH_SECTION_FETCH_LIMIT,
            ).slice(0, 3)}
            rightColumnPosts={fifthSectionCardsForCategory(
              fifthSectionRightRaw,
              HOMEPAGE_FIFTH_SECTION_CATEGORIES.right.slug,
              HOMEPAGE_FIFTH_SECTION_FETCH_LIMIT,
            )}
            leftCategory={HOMEPAGE_FIFTH_SECTION_CATEGORIES.left}
            rightCategory={HOMEPAGE_FIFTH_SECTION_CATEGORIES.right}
          />
          <SixthSection categoriesData={sixthSectionData as any} />
          {/* <SeventhSection
            variant="light"
            categoriesData={fourthSectionData as any}
          /> */}
        </div>
      </SitePageWidth>
    </>
  );
}
