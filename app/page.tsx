import { Suspense } from "react";
import { FirstSection } from "./components/Landing/FirstSection/firstSection";
import { HomepageBelowFoldData } from "./components/Landing/homepage-below-fold-data";
import { HomepageBelowFoldFallback } from "./components/Landing/homepage-below-fold-fallback";
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
import { getHomepageCoverImage } from "@/app/lib/homepage/homepage-cover-image";
import { loadHomepageHeroData } from "@/app/lib/homepage/load-homepage-hero-data";
import { preloadHeroLcpImage } from "@/app/lib/homepage/preload-hero-lcp-image";
import { SitePageWidth } from "@/app/components/layout/site-page-width";

export const revalidate = 60;

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

export default async function Page() {
  const [settings, hero] = await Promise.all([
    getCachedSettings(),
    loadHomepageHeroData(),
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

  const mainHeadlinePost = (
    Array.isArray(hero.mainHeadlinePosts) ? hero.mainHeadlinePosts[0] : null
  ) as {
    title?: string;
    cover?: Parameters<typeof getHomepageCoverImage>[1];
  } | null;
  const heroLcpCover =
    mainHeadlinePost?.cover != null
      ? getHomepageCoverImage(
          "heroMain",
          mainHeadlinePost.cover,
          mainHeadlinePost.title ?? "Main headline",
        )
      : null;

  preloadHeroLcpImage({
    src: heroLcpCover?.src,
    unoptimized: heroLcpCover?.unoptimized ?? false,
  });

  return (
    <>
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
          <Suspense fallback={<HomepageBelowFoldFallback />}>
            <HomepageBelowFoldData />
          </Suspense>
          {/* <PromoSection /> */}
        </div>
      </SitePageWidth>
      <JsonLdScript data={organizationLd} />
      <JsonLdScript data={websiteLd} />
    </>
  );
}
