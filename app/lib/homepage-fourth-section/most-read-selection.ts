import { HOMEPAGE_FOURTH_SECTION_MOST_READ_LIMIT } from "@/app/lib/article-family/ranking-policy";

export type FourthSectionMostReadPost = {
  _id: string;
  title: string;
  slug: string | null;
  readTime?: number | null;
  publishedAt?: string | null;
  date?: string | null;
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
};

function normalizeMostReadPosts(posts: unknown): FourthSectionMostReadPost[] {
  return Array.isArray(posts) ? (posts as FourthSectionMostReadPost[]) : [];
}

function filterMostReadPosts(
  posts: FourthSectionMostReadPost[] | null | undefined,
): FourthSectionMostReadPost[] {
  return normalizeMostReadPosts(posts).filter(
    (post) =>
      !!post.slug &&
      (!post.category || (!!post.category.title && !!post.category.slug)),
  );
}

/** Keep up to five valid most-read posts after hydration/filtering. */
export function selectFourthSectionMostReadPosts(
  posts: FourthSectionMostReadPost[] | null | undefined,
): FourthSectionMostReadPost[] {
  return filterMostReadPosts(posts).slice(
    0,
    HOMEPAGE_FOURTH_SECTION_MOST_READ_LIMIT,
  );
}
