import { FirstSection } from "./components/Landing/FirstSection/firstSection";
import EditorialRailsSection from "./components/article-family/EditorialRailsSection";
import { HomepageBelowFoldLazy } from "./components/Landing/homepage-below-fold-lazy";
import { HOMEPAGE_BELOW_FOLD_SECTION_GAP } from "./components/Landing/homepage-below-fold-spacing";
import { JsonLdScript } from "./components/seo/json-ld-script";
import nextDynamic from "next/dynamic";
import { toPlainText } from "next-sanity";
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
import { loadHomepagePageData } from "@/app/lib/homepage/load-homepage-page-data";
import { SitePageWidth } from "@/app/components/layout/site-page-width";

export const dynamic = "force-dynamic";

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

const PromoSection = nextDynamic(
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

const homepageOpinionRail = <EditorialRailsSection />;

export default async function Page() {
  const [settings, homepageData] = await Promise.all([
    getCachedSettings(),
    loadHomepagePageData(),
  ]);
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

  const {
    hero,
    secondSectionData,
    thirdSectionData,
    fourthSectionData,
    fifthSection,
    sixthSection,
    seventhSectionData,
  } = homepageData;

  return (
    <>
      <JsonLdScript data={organizationLd} />
      <JsonLdScript data={websiteLd} />
      <SitePageWidth className="bg-news-surface">
        <div className={`${HOMEPAGE_BELOW_FOLD_SECTION_GAP} pb-10 md:pb-14`}>
          <FirstSection
            justInNews={hero.justInPosts as any}
            mainStory={hero.mainHeadlinePosts as any}
            relatedCategoryPosts={hero.relatedCategoryPosts as any}
            moreTopHeadlines={hero.frontlinePosts as any}
            sideStories={hero.rightRailSideStories as any}
            compactSideStories={hero.compactSideStories as any}
          />
          <HomepageBelowFoldLazy
            secondSection={{
              variant: "news",
              categoriesData: secondSectionData as any,
            }}
            thirdSection={{ articles: thirdSectionData }}
            fourthSection={fourthSectionData}
            fifthSection={fifthSection}
            sixthSection={
              sixthSection
                ? {
                    leftArticle: sixthSection.leftArticle as any,
                    centerArticle: sixthSection.centerArticle as any,
                    rightArticle: sixthSection.rightArticle as any,
                  }
                : null
            }
            seventhSection={{ categoriesData: seventhSectionData as any }}
            opinion={homepageOpinionRail}
          />
          {/* <PromoSection /> */}
        </div>
      </SitePageWidth>
    </>
  );
}
