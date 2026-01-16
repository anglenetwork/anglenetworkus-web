import {
  FirstSection,
  NewsTicker,
  SecondSection,
} from "./components/Landing/index";
import { ThirdSection } from "./components/ui/thirdSection";
import dynamic from "next/dynamic";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  indexQuery,
  latestNineByCategoryQuery,
  mostViewedPostsQuery,
  newsTickerQuery,
  sixthSectionQuery,
} from "@/sanity/lib/queries";
import { getFourthSectionData, getSecondSectionData } from "./lib/homepage";

// Dynamically import below-the-fold sections to reduce initial bundle size
const SixthSection = dynamic(
  () => import("./components/Landing/SecondSection/sixthSection"),
  { ssr: true }
);

const FifthSection = dynamic(
  () => import("./components/Landing/ThirdSection/fifthSection"),
  { ssr: true }
);

const FourthSection = dynamic(
  () => import("./components/Landing/FourthSection/fourthSection"),
  { ssr: true }
);

const SeventhSection = dynamic(
  () => import("./components/Landing/FourthSection/seventhSection"),
  { ssr: true }
);

const MainFifthSection = dynamic(
  () => import("./components/Landing/FifthSection/mainFifthSection"),
  { ssr: true }
);

export default async function Page() {
  //LANDING PAGE DATA FETCHING
  // 1) Fetch posts for FirstSection (hero/main content)
  const firstSectionPosts = await sanityFetchStatic({ query: indexQuery });

  // 2) Fetch most read posts (sitewide metric) for FirstSection
  const mostReadPosts = await sanityFetchStatic({
    query: mostViewedPostsQuery,
  });

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

  // 4) Fetch latest 6 posts for news ticker
  const newsTickerPosts = await sanityFetchStatic({
    query: newsTickerQuery,
  });

  // 5) Parallelize below-the-fold data fetching
  const [fourthSectionData, fifthSectionPosts, sixthSectionData] =
    await Promise.all([
      // Build category tiles for FourthSection and SeventhSection
      getFourthSectionData(
        ["tech", "business", "entertainment", "lifestyle"],
        ["Tech", "Business", "Entertainment", "Lifestyle"]
      ),
      // Fetch posts for FifthSection (World category)
      sanityFetchStatic({
        query: sixthSectionQuery,
        params: { categorySlug: "world" },
      }),
      // Build third-latest per category for SixthSection
      getSecondSectionData(),
    ]);

  return (
    <div className="mx-auto lg:mx-32">
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
        <ThirdSection />
        <FourthSection
          variant="dark"
          categoriesData={fourthSectionData as any}
        />
        <FifthSection posts={fifthSectionPosts as any} categoryTitle="World" />
        <SixthSection categoriesData={sixthSectionData as any} />
        <SeventhSection
          variant="light"
          categoriesData={fourthSectionData as any}
        />
        {/* <MainFifthSection
          posts={fifthSectionPosts as any}
          categoryTitle="politics"
        /> */}
      </div>
    </div>
  );
}
