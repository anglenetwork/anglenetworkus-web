import type { MostReadFeedItem } from "@/app/components/Landing/FourthSection/most-read-feed";
import { logDevMetricsFallback } from "@/app/lib/article-family/metrics-dev-log";
import {
  getMostReadPosts,
  orderDocumentsByIds,
} from "@/app/lib/article-family/metrics";
import { HOMEPAGE_FOURTH_SECTION_MOST_READ_LIMIT } from "@/app/lib/article-family/ranking-policy";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  homepageFourthSectionMostReadFallbackQuery,
  homepageFourthSectionTechQuery,
  postsByIdsLightweightQuery,
} from "@/sanity/lib/queries";
import type { HomepageFourthSectionTechQueryResult } from "@/sanity.types";
import {
  selectFourthSectionMostReadPosts,
  type FourthSectionMostReadPost,
} from "./homepage-fourth-section/most-read-selection";

export { selectFourthSectionMostReadPosts } from "./homepage-fourth-section/most-read-selection";

export const HOMEPAGE_FOURTH_SECTION_CATEGORY = {
  slug: "tech",
  title: "Tech",
  href: "/category/tech",
} as const;

export const HOMEPAGE_FOURTH_SECTION_FEATURED_COUNT = 2;
export const HOMEPAGE_FOURTH_SECTION_SECONDARY_COUNT = 4;

export type FourthSectionTechPost =
  HomepageFourthSectionTechQueryResult[number];

export type HomepageFourthSectionMostReadPost = FourthSectionMostReadPost;

export type HomepageFourthSectionData = {
  category: typeof HOMEPAGE_FOURTH_SECTION_CATEGORY;
  featured: FourthSectionTechPost[];
  secondary: FourthSectionTechPost[];
  mostRead: MostReadFeedItem[];
};

function normalizeMostReadPosts(
  posts: unknown,
): HomepageFourthSectionMostReadPost[] {
  return Array.isArray(posts)
    ? (posts as HomepageFourthSectionMostReadPost[])
    : [];
}

function mostReadPostsToFeedItems(
  posts: HomepageFourthSectionMostReadPost[] | null | undefined,
): MostReadFeedItem[] {
  return selectFourthSectionMostReadPosts(posts).map((post) => ({
    id: post._id,
    title: post.title,
    href: `/post/${post.slug}`,
    readTimeMinutes: post.readTime ?? null,
  }));
}

async function fetchMostReadFallback(): Promise<
  HomepageFourthSectionMostReadPost[]
> {
  const result = await sanityFetchStatic({
    query: homepageFourthSectionMostReadFallbackQuery,
  });
  return normalizeMostReadPosts(result);
}

async function hydrateMostReadPostsByIds(
  ids: string[],
): Promise<HomepageFourthSectionMostReadPost[]> {
  if (ids.length === 0) return [];

  const raw = await sanityFetchStatic({
    query: postsByIdsLightweightQuery,
    params: { ids },
  });
  return orderDocumentsByIds(
    normalizeMostReadPosts(raw),
    ids,
  ) as HomepageFourthSectionMostReadPost[];
}

async function loadFourthSectionMostReadPosts(): Promise<
  HomepageFourthSectionMostReadPost[]
> {
  try {
    const ranked = await getMostReadPosts({ limit: 24 });
    const hasActivity = ranked.some((r) => r.views7d > 0 || r.viewsAll > 0);
    if (!ranked.length || !hasActivity) {
      logDevMetricsFallback(
        "homepage_fourth_section_most_read",
        "empty_or_no_activity",
      );
      return selectFourthSectionMostReadPosts(await fetchMostReadFallback());
    }

    const ids = ranked.map((r) => r.articleId).slice(0, 24);
    const ordered = await hydrateMostReadPostsByIds(ids);
    const selected = selectFourthSectionMostReadPosts(ordered);

    if (selected.length === 0) {
      logDevMetricsFallback(
        "homepage_fourth_section_most_read",
        "empty_or_no_activity",
      );
      return selectFourthSectionMostReadPosts(await fetchMostReadFallback());
    }

    return selected;
  } catch {
    logDevMetricsFallback("homepage_fourth_section_most_read", "infra_error");
    return selectFourthSectionMostReadPosts(await fetchMostReadFallback());
  }
}

export async function getFourthSectionData(): Promise<HomepageFourthSectionData | null> {
  const [techPosts, mostReadPosts] = await Promise.all([
    sanityFetchStatic({
      query: homepageFourthSectionTechQuery,
      params: { categorySlug: HOMEPAGE_FOURTH_SECTION_CATEGORY.slug },
      tag: "homepage.fourth-section.tech",
    }),
    loadFourthSectionMostReadPosts(),
  ]);

  const posts = (Array.isArray(techPosts) ? techPosts : []).filter(
    (post) => typeof post?.slug === "string",
  ) as FourthSectionTechPost[];

  if (posts.length < HOMEPAGE_FOURTH_SECTION_FEATURED_COUNT) {
    return null;
  }

  const featured = posts.slice(0, HOMEPAGE_FOURTH_SECTION_FEATURED_COUNT);
  const secondary = posts.slice(
    HOMEPAGE_FOURTH_SECTION_FEATURED_COUNT,
    HOMEPAGE_FOURTH_SECTION_FEATURED_COUNT +
      HOMEPAGE_FOURTH_SECTION_SECONDARY_COUNT,
  );

  const mostRead = mostReadPostsToFeedItems(mostReadPosts);

  return {
    category: HOMEPAGE_FOURTH_SECTION_CATEGORY,
    featured,
    secondary,
    mostRead,
  };
}
