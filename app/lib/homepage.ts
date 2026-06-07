import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  thirdLatestArticleQuery,
  fourthSectionQuery,
  homepageThirdSectionByTagQuery,
} from "@/sanity/lib/queries";
import {
  HOMEPAGE_THIRD_SECTION_TAGS,
  type HomepageThirdSectionArticle,
} from "./homepage-third-section";

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

type ThirdSectionPostRow = {
  _id: string;
  title: string;
  slug: string;
  readTime?: number | null;
};

/** Homepage third section: latest post for each configured tag. */
export async function getThirdSectionData(): Promise<
  HomepageThirdSectionArticle[]
> {
  const rows: HomepageThirdSectionArticle[] = [];
  const usedIds: string[] = [];

  for (const tag of HOMEPAGE_THIRD_SECTION_TAGS) {
    const post = await sanityFetchStatic({
      query: homepageThirdSectionByTagQuery,
      params: { tagSlug: tag.slug, excludeIds: usedIds },
      tag: `homepage.third-section.${tag.slug}`,
    });

    const row = post as ThirdSectionPostRow | null;
    if (!row?.slug) continue;

    usedIds.push(row._id);
    rows.push({
      tagSlug: tag.slug,
      tagTitle: tag.title,
      _id: row._id,
      title: row.title,
      slug: row.slug,
      readTime: row.readTime ?? null,
    });
  }

  return rows;
}

/** Homepage seventh section: featured-stories carousel (one card per category). */
export async function getSeventhSectionData() {
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
