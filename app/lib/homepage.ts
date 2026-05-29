import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  thirdLatestArticleQuery,
  fourthSectionQuery,
} from "@/sanity/lib/queries";

/** Homepage second section: category columns (e.g. Tech, Business, Entertainment). */
export async function getSecondSectionData(slugs: string[], titles: string[]) {
  if (slugs.length !== titles.length) {
    throw new Error(
      `getSecondSectionData: slugs and titles arrays must have the same length. Got ${slugs.length} slugs and ${titles.length} titles.`,
    );
  }

  const categoryPosts = await Promise.all(
    slugs.map((slug) =>
      sanityFetchStatic({
        query: fourthSectionQuery,
        params: { categorySlug: slug },
      }),
    ),
  );

  return slugs.map((slug, index) => ({
    name: titles[index] || slug,
    slug: slug,
    posts: categoryPosts[index],
  }));
}

/** Homepage fifth section: featured-stories carousel (one card per category). */
export async function getFifthSectionData() {
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
