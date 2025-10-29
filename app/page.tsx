import {
  MainFirstSection,
  MainSecondSection,
  MainThirdSection,
  MainFourthSection,
  MainSixthSection,
  MainSeventhSection,
  MainHighlightsStories,
  MainEighthSection,
} from "./components/Landing";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  indexQuery,
  fourthSectionQuery,
  thirdSectionQuery,
  mostReadQuery,
  mostViewedPostsQuery,
  sixthSectionQuery,
  eighthSectionQuery,
  secondSectionQuery,
  thirdLatestArticleQuery,
} from "@/sanity/lib/queries";

export default async function Page() {
  // Fetch posts for the news content
  const posts = await sanityFetchStatic({ query: indexQuery });

  // Fetch posts for the fourth section (US category)
  const fourthSectionPosts = await sanityFetchStatic({
    query: fourthSectionQuery,
    params: { categorySlug: "us" },
  });

  // Fetch posts for the third section (Politics category)
  const thirdSectionPosts = await sanityFetchStatic({
    query: thirdSectionQuery,
    params: { categorySlug: "politics" },
  });

  // Fetch most read posts
  const mostReadPosts = await sanityFetchStatic({
    query: mostViewedPostsQuery,
  });

  // Fetch posts for sixth section (International category)
  const sixthSectionPosts = await sanityFetchStatic({
    query: sixthSectionQuery,
    params: { categorySlug: "international" },
  });

  //EIGHT SECTION FETCHING
  // Fetch posts for each category for eighth section
  const [politicsPosts, internationalPosts, businessPosts, usPosts] =
    await Promise.all([
      sanityFetchStatic({
        query: fourthSectionQuery,
        params: { categorySlug: "politics" },
      }),
      sanityFetchStatic({
        query: fourthSectionQuery,
        params: { categorySlug: "international" },
      }),
      sanityFetchStatic({
        query: fourthSectionQuery,
        params: { categorySlug: "business" },
      }),
      sanityFetchStatic({
        query: fourthSectionQuery,
        params: { categorySlug: "us" },
      }),
    ]);

  // Transform the data to match the expected format
  const eighthSectionData = [
    { name: "Politics", slug: "politics", posts: politicsPosts },
    { name: "International", slug: "international", posts: internationalPosts },
    { name: "Business", slug: "business", posts: businessPosts },
    { name: "US", slug: "us", posts: usPosts },
  ];

  //SECOND SECTION FETCHING
  // Fetch only the 3rd latest article for each category for second section
  const [
    politicsThirdArticle,
    internationalThirdArticle,
    businessThirdArticle,
    usThirdArticle,
    cultureThirdArticle,
    healthThirdArticle,
  ] = await Promise.all([
    sanityFetchStatic({
      query: thirdLatestArticleQuery,
      params: { categorySlug: "politics" },
    }),
    sanityFetchStatic({
      query: thirdLatestArticleQuery,
      params: { categorySlug: "international" },
    }),
    sanityFetchStatic({
      query: thirdLatestArticleQuery,
      params: { categorySlug: "business" },
    }),
    sanityFetchStatic({
      query: thirdLatestArticleQuery,
      params: { categorySlug: "us" },
    }),
    sanityFetchStatic({
      query: thirdLatestArticleQuery,
      params: { categorySlug: "culture" },
    }),
    sanityFetchStatic({
      query: thirdLatestArticleQuery,
      params: { categorySlug: "health" },
    }),
  ]);

  // Transform the data - each query returns only the 3rd article (or empty array)
  const secondSectionData = [
    {
      name: "Politics",
      slug: "politics",
      thirdArticle: politicsThirdArticle[0] || null, // First (and only) item is the 3rd article
    },
    {
      name: "International",
      slug: "international",
      thirdArticle: internationalThirdArticle[0] || null,
    },
    {
      name: "Business",
      slug: "business",
      thirdArticle: businessThirdArticle[0] || null,
    },
    {
      name: "US",
      slug: "us",
      thirdArticle: usThirdArticle[0] || null,
    },
    {
      name: "Culture",
      slug: "culture",
      thirdArticle: cultureThirdArticle[0] || null,
    },
    {
      name: "Health",
      slug: "health",
      thirdArticle: healthThirdArticle[0] || null,
    },
  ];

  return (
    <div className="container mx-auto border-2 border-red-500">
      <div className="py-8 space-y-16">
        <MainFirstSection posts={posts} mostReadPosts={mostReadPosts} />
        <MainSecondSection categoriesData={secondSectionData} />
        <MainSixthSection
          posts={sixthSectionPosts}
          categoryTitle="International"
        />
        <MainEighthSection categoriesData={eighthSectionData} />
        <MainThirdSection
          posts={thirdSectionPosts}
          categoryTitle="POLITICS"
          mostReadPosts={mostReadPosts}
        />
        <MainHighlightsStories />
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
