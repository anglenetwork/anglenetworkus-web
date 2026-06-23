import { articleFamilyHref } from "@/app/lib/article-family/routes";
import type { ArticleFamilyDocType } from "@/app/lib/article-family/types";
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

const HOMEPAGE_THIRD_SECTION_DOC_TYPES = new Set<ArticleFamilyDocType>([
  "post",
  "analysis",
  "opinion",
]);

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
  _type?: string;
  title: string;
  slug: string;
  readTime?: number | null;
};

function resolveThirdSectionHref(row: ThirdSectionPostRow): string | undefined {
  const docType = row._type;
  if (
    !docType ||
    !HOMEPAGE_THIRD_SECTION_DOC_TYPES.has(docType as ArticleFamilyDocType) ||
    !row.slug
  ) {
    return undefined;
  }

  return articleFamilyHref(docType as ArticleFamilyDocType, row.slug);
}

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
    const href = row ? resolveThirdSectionHref(row) : undefined;
    if (!row?.slug || !href) continue;

    usedIds.push(row._id);
    rows.push({
      tagSlug: tag.slug,
      tagTitle: tag.title,
      _id: row._id,
      title: row.title,
      slug: row.slug,
      href,
      readTime: row.readTime ?? null,
    });
  }

  return rows;
}

/** Homepage seventh section: featured-stories carousel (one card per category). */
export async function getSeventhSectionData() {
  const [
    politicsThirdArticle,
    worldThirdArticle,
    businessThirdArticle,
    usThirdArticle,
    entertainmentThirdArticle,
    lifestyleThirdArticle,
  ] = await Promise.all([
    sanityFetchStatic({
      query: thirdLatestArticleQuery,
      params: { categorySlug: "politics" },
    }),
    sanityFetchStatic({
      query: thirdLatestArticleQuery,
      params: { categorySlug: "world" },
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
      params: { categorySlug: "entertainment" },
    }),
    sanityFetchStatic({
      query: thirdLatestArticleQuery,
      params: { categorySlug: "lifestyle" },
    }),
  ]);

  return [
    {
      name: "Politics",
      slug: "politics",
      thirdArticle: politicsThirdArticle[0] || null,
    },
    {
      name: "World",
      slug: "world",
      thirdArticle: worldThirdArticle[0] || null,
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
      name: "Entertainment",
      slug: "entertainment",
      thirdArticle: entertainmentThirdArticle[0] || null,
    },
    {
      name: "Lifestyle",
      slug: "lifestyle",
      thirdArticle: lifestyleThirdArticle[0] || null,
    },
  ];
}
