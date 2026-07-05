import "server-only";

import EditorialRailsSection from "@/app/components/article-family/EditorialRailsSection";
import { loadHomepageBelowFoldData } from "@/app/lib/homepage/load-homepage-below-fold-data";
import { HomepageBelowFoldLazy } from "./homepage-below-fold-lazy";

/**
 * Async server component that loads all below-fold homepage data and renders
 * the client-lazy below-fold sections. Meant to be rendered inside a
 * `<Suspense>` boundary in `app/page.tsx` so the hero can flush before the
 * below-fold queries resolve.
 */
export async function HomepageBelowFoldData() {
  const {
    secondSectionData,
    thirdSectionData,
    fourthSectionData,
    fifthSection,
    sixthSection,
    seventhSectionData,
  } = await loadHomepageBelowFoldData();

  return (
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
      opinion={<EditorialRailsSection />}
    />
  );
}
