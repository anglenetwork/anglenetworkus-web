import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  thirdLatestArticleQuery,
  fourthSectionQuery,
} from "@/sanity/lib/queries";

//For more control, we hardcode the sections names we want to display in the eighth section
export async function getFourthSectionData(slugs: string[], titles: string[]) {
  // Validate that slugs and titles arrays have the same length
  if (slugs.length !== titles.length) {
    throw new Error(
      `getFourthSectionData: slugs and titles arrays must have the same length. Got ${slugs.length} slugs and ${titles.length} titles.`,
    );
  }

  // Fetch posts for each category slug
  const categoryPosts = await Promise.all(
    slugs.map((slug) =>
      sanityFetchStatic({
        query: fourthSectionQuery,
        params: { categorySlug: slug },
      }),
    ),
  );

  // Map the results to the expected format
  return slugs.map((slug, index) => ({
    name: titles[index] || slug,
    slug: slug,
    posts: categoryPosts[index],
  }));
}

//For more control, we hardcode the sections names we want to display in the second section
export async function getSecondSectionData() {
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

  return [
    {
      name: "Politics",
      slug: "politics",
      thirdArticle: politicsThirdArticle[0] || null,
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
}
