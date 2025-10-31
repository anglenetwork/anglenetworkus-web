import {
  MainFirstSection,
  MainSecondSection,
  MainThirdSection,
  MainFourthSection,
  MainFifthSection,
  MainSixthSection,
} from "./components/Landing/index";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  indexQuery,
  latestNineByCategoryQuery,
  mostViewedPostsQuery,
  sixthSectionQuery,
} from "@/sanity/lib/queries";
import { getFourthSectionData, getSecondSectionData } from "./lib/homepage";

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

  // 4) Fetch posts for the third section (International category)
  const sixthSectionPosts = await sanityFetchStatic({
    query: sixthSectionQuery,
    params: { categorySlug: "international" },
  });

  // 5) Build category tiles for the fourth section
  const fourthSectionData = await getFourthSectionData();

  // 6) Build third-latest per category for the second section
  const secondSectionData = await getSecondSectionData();

  return (
    <div className="container mx-auto border-2 border-red-500">
      <div className="space-y-10 md:space-y-14">
        <MainFirstSection
          posts={posts as any}
          mostReadPosts={mostReadPosts as any}
        />
        <MainSecondSection categoriesData={secondSectionData as any} />
        <MainThirdSection
          posts={sixthSectionPosts as any}
          categoryTitle="International"
        />
        <MainFourthSection categoriesData={fourthSectionData as any} />
        <MainFifthSection
          posts={fifthSectionPosts as any}
          categoryTitle="politics"
        />
        <MainSixthSection />
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
