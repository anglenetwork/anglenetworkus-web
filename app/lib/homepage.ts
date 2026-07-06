import { articleFamilyHref } from "@/app/lib/article-family/routes";
import type { ArticleFamilyDocType } from "@/app/lib/article-family/types";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  homepageSecondSectionBundleQuery,
  homepageSeventhSectionBundleQuery,
  homepageThirdSectionBundleQuery,
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

/**
 * Pool size for the third-section bundle query. Needs to be large enough that
 * after dedup we can still find one unused article per configured tag.
 * With 3 tags in HOMEPAGE_THIRD_SECTION_TAGS, 20 gives generous headroom.
 */
const HOMEPAGE_THIRD_SECTION_POOL_SIZE = 20;

/**
 * Homepage second section: category columns (e.g. Tech, Business, Entertainment).
 * Requires exactly 3 slugs to match the bundled GROQ query shape.
 */
export async function getSecondSectionData(slugs: string[], titles: string[]) {
  if (slugs.length !== titles.length) {
    throw new Error(
      `getSecondSectionData: slugs and titles arrays must have the same length. Got ${slugs.length} slugs and ${titles.length} titles.`,
    );
  }
  if (slugs.length !== 3) {
    throw new Error(
      `getSecondSectionData: expected exactly 3 slugs to match homepageSecondSectionBundleQuery, got ${slugs.length}.`,
    );
  }

  const bundle = await sanityFetchStatic({
    query: homepageSecondSectionBundleQuery,
    params: {
      slug0: slugs[0],
      slug1: slugs[1],
      slug2: slugs[2],
    },
    tag: "homepage.second-section.bundle",
  });

  const columns = [
    bundle?.slug0Posts ?? [],
    bundle?.slug1Posts ?? [],
    bundle?.slug2Posts ?? [],
  ];

  return slugs.map((slug, index) => ({
    name: titles[index] || slug,
    slug,
    posts: columns[index],
  }));
}

type ThirdSectionPoolRow = {
  _id: string;
  _type?: string | null;
  title: string;
  slug: string;
  readTime?: number | null;
  tagSlugs?: (string | null)[] | null;
};

function resolveThirdSectionHref(row: ThirdSectionPoolRow): string | undefined {
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

function poolRowHasTag(row: ThirdSectionPoolRow, tagSlug: string): boolean {
  return Array.isArray(row.tagSlugs) && row.tagSlugs.includes(tagSlug);
}

/**
 * Homepage third section: latest editorial doc per configured tag.
 * Fetches a pool of recent tag-matched docs in a single request, then applies
 * the "first unused per tag, in tag order" dedup entirely in memory.
 */
export async function getThirdSectionData(): Promise<
  HomepageThirdSectionArticle[]
> {
  const tagSlugs = HOMEPAGE_THIRD_SECTION_TAGS.map((tag) => tag.slug);
  const poolRaw = await sanityFetchStatic({
    query: homepageThirdSectionBundleQuery,
    params: {
      tagSlugs,
      poolSize: HOMEPAGE_THIRD_SECTION_POOL_SIZE,
    },
    tag: "homepage.third-section.bundle",
  });
  const pool: ThirdSectionPoolRow[] = Array.isArray(poolRaw)
    ? (poolRaw as ThirdSectionPoolRow[])
    : [];

  const usedIds = new Set<string>();
  const rows: HomepageThirdSectionArticle[] = [];

  for (const tag of HOMEPAGE_THIRD_SECTION_TAGS) {
    const row = pool.find(
      (candidate) =>
        !usedIds.has(candidate._id) && poolRowHasTag(candidate, tag.slug),
    );
    if (!row) continue;

    const href = resolveThirdSectionHref(row);
    if (!row.slug || !href) continue;

    usedIds.add(row._id);
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
  const bundle = await sanityFetchStatic({
    query: homepageSeventhSectionBundleQuery,
    params: {
      slug0: "politics",
      slug1: "world",
      slug2: "business",
      slug3: "us",
      slug4: "entertainment",
      slug5: "lifestyle",
    },
    tag: "homepage.seventh-section.bundle",
  });

  const firstOrNull = <T>(posts: T[] | null | undefined): T | null =>
    Array.isArray(posts) && posts.length > 0 ? posts[0] : null;

  return [
    {
      name: "Politics",
      slug: "politics",
      thirdArticle: firstOrNull(bundle?.slug0Third),
    },
    {
      name: "World",
      slug: "world",
      thirdArticle: firstOrNull(bundle?.slug1Third),
    },
    {
      name: "Business",
      slug: "business",
      thirdArticle: firstOrNull(bundle?.slug2Third),
    },
    {
      name: "US",
      slug: "us",
      thirdArticle: firstOrNull(bundle?.slug3Third),
    },
    {
      name: "Entertainment",
      slug: "entertainment",
      thirdArticle: firstOrNull(bundle?.slug4Third),
    },
    {
      name: "Lifestyle",
      slug: "lifestyle",
      thirdArticle: firstOrNull(bundle?.slug5Third),
    },
  ];
}
