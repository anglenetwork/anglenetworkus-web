import {
  MainFirstSection,
  NewsTicker,
  HighlightedStories,
} from "./components/Landing/index";
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
const MainSecondSection = dynamic(
  () => import("./components/Landing/SecondSection/mainSecondSection"),
  { ssr: true }
);

const MainThirdSection = dynamic(
  () => import("./components/Landing/ThirdSection/mainThirdSection"),
  { ssr: true }
);

const MainFourthSection = dynamic(
  () => import("./components/Landing/FourthSection/mainFourthSection"),
  { ssr: true }
);

const MainFifthSection = dynamic(
  () => import("./components/Landing/FifthSection/mainFifthSection"),
  { ssr: true }
);

export default async function Page() {
  //LANDING PAGE DATA FETCHING
  // 1) Fetch posts for the news content (hero/first section)
  const posts = await sanityFetchStatic({ query: indexQuery });

  // 2) Fetch latest 9 for the fifth section (Politics category)
  const fifthSectionPosts = await sanityFetchStatic({
    query: latestNineByCategoryQuery,
    params: { categorySlug: "politics" },
  });

  // 3) Fetch most read posts (sitewide metric)
  const mostReadPosts = await sanityFetchStatic({
    query: mostViewedPostsQuery,
  });

  // 4) Fetch posts for the third section (World category)
  const sixthSectionPosts = await sanityFetchStatic({
    query: sixthSectionQuery,
    params: { categorySlug: "world" },
  });

  // 5) Build category tiles for the fourth section
  const fourthSectionData = await getFourthSectionData(
    ["tech", "business", "entertainment", "lifestyle"],
    ["Tech", "Business", "Entertainment", "Lifestyle"]
  );

  // 6) Build third-latest per category for the second section
  const secondSectionData = await getSecondSectionData();

  // 7) Fetch latest 6 posts for news ticker
  const newsTickerPosts = await sanityFetchStatic({
    query: newsTickerQuery,
  });

  // 8) Fetch posts for highlighted stories section
  // Left column: US category (1 featured + 6 small)
  const usPosts = await sanityFetchStatic({
    query: latestNineByCategoryQuery,
    params: { categorySlug: "us" },
  });
  // Right column: Politics category (1 featured + 6 small)
  const politicsPostsHighlighted = await sanityFetchStatic({
    query: latestNineByCategoryQuery,
    params: { categorySlug: "politics" },
  });

  return (
    <div className="mx-auto lg:mx-32">
      <NewsTicker posts={newsTickerPosts as any} />
      <div className="space-y-10 md:space-y-14">
        <MainFirstSection
          posts={posts as any}
          mostReadPosts={mostReadPosts as any}
        />
        {usPosts &&
          usPosts.length > 0 &&
          politicsPostsHighlighted &&
          politicsPostsHighlighted.length > 0 && (
            <HighlightedStories
              leftArticle={usPosts[0] as any}
              leftSmallArticles={(usPosts.slice(1, 7) as any[]).filter(
                (p) => p.slug
              )}
              rightArticle={politicsPostsHighlighted[0] as any}
              rightSmallArticles={(
                politicsPostsHighlighted.slice(1, 7) as any[]
              ).filter((p) => p.slug)}
            />
          )}
        <MainSecondSection categoriesData={secondSectionData as any} />
        <MainThirdSection
          posts={sixthSectionPosts as any}
          categoryTitle="World"
        />
        <MainFourthSection
          variant="dark"
          categoriesData={fourthSectionData as any}
        />
        <MainFifthSection
          posts={fifthSectionPosts as any}
          categoryTitle="politics"
        />
        {/* <MainSixthSection /> */}
        {/* <MainFourthSection
          posts={mostReadPosts}
          categoryTitle="politics"
          categorySlug="politics"
        /> */}
        {/* <MainSeventhSection
          posts={sixthSectionPosts}
          categoryTitle="International"
        /> */}
      </div>
    </div>
  );
}
