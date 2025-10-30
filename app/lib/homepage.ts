import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  thirdLatestArticleQuery,
  fourthSectionQuery,
} from "@/sanity/lib/queries";

//For more control, we hardcode the sections names we want to display in the eighth section
export async function getFourthSectionData() {
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

  return [
    { name: "Politics", slug: "politics", posts: politicsPosts },
    { name: "International", slug: "international", posts: internationalPosts },
    { name: "Business", slug: "business", posts: businessPosts },
    { name: "US", slug: "us", posts: usPosts },
  ];
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


