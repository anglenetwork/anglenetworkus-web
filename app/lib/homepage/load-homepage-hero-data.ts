import "server-only";

import { enrichCoverMediaInTree } from "@/lib/editorial-image/enrich-cover-media";
import { HOMEPAGE_JUST_IN_LIMIT } from "@/app/lib/homepage/first-section";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  homepageHeroBundleQuery,
  homepageHeroRelatedByCategoryQuery,
} from "@/sanity/lib/queries";

type HeroPostWithCategory = {
  _id: string;
  slug?: string | null;
  category?: { slug?: string | null } | null;
};

function isHeroPost(post: unknown): post is HeroPostWithCategory {
  return (
    !!post &&
    typeof post === "object" &&
    "_id" in post &&
    typeof post._id === "string"
  );
}

function selectHeroPosts<T extends HeroPostWithCategory>(
  posts: unknown,
  usedIds: Set<string>,
  limit: number,
): T[] {
  if (!Array.isArray(posts)) return [];

  const selected: T[] = [];
  for (const post of posts) {
    if (!isHeroPost(post) || usedIds.has(post._id)) continue;
    selected.push(post as T);
    usedIds.add(post._id);
    if (selected.length >= limit) break;
  }
  return selected;
}

function selectRightRailPosts(
  rightHeadlinePosts: unknown,
  excludeIds: Set<string>,
) {
  if (!Array.isArray(rightHeadlinePosts)) {
    return { sideStories: [], compactSideStories: [] };
  }

  const filtered = rightHeadlinePosts.filter(
    (post): post is HeroPostWithCategory =>
      !!post &&
      typeof post === "object" &&
      "_id" in post &&
      typeof post._id === "string" &&
      "slug" in post &&
      typeof post.slug === "string" &&
      post.slug.length > 0 &&
      !excludeIds.has(post._id),
  );

  return {
    sideStories: filtered.slice(0, 2),
    compactSideStories: filtered.slice(2, 4),
  };
}

export async function loadHomepageHeroData() {
  const heroBundle = await sanityFetchStatic({
    query: homepageHeroBundleQuery,
    tag: "homepage.hero.bundle",
  });

  const justInPostsRaw = heroBundle?.justInPosts ?? [];
  const mainHeadlinePostsRaw = heroBundle?.mainHeadlinePosts ?? [];
  const frontlinePostsRaw = heroBundle?.frontlinePosts ?? [];
  const rightHeadlinePostsRaw = heroBundle?.rightHeadlinePosts ?? [];

  const usedHeroPostIds = new Set<string>();
  const mainHeadlinePosts = selectHeroPosts(
    mainHeadlinePostsRaw,
    usedHeroPostIds,
    1,
  );
  const justInPosts = selectHeroPosts(
    justInPostsRaw,
    usedHeroPostIds,
    HOMEPAGE_JUST_IN_LIMIT,
  );
  const frontlinePosts = selectHeroPosts(frontlinePostsRaw, usedHeroPostIds, 2);
  const { sideStories: rightRailSideStories, compactSideStories } =
    selectRightRailPosts(rightHeadlinePostsRaw, usedHeroPostIds);

  const mainStoryPost = (
    Array.isArray(mainHeadlinePosts) ? mainHeadlinePosts[0] : null
  ) as HeroPostWithCategory | null;
  const mainStoryCategorySlug = mainStoryPost?.category?.slug ?? null;
  const relatedCategoryPosts =
    mainStoryCategorySlug && mainStoryPost?._id
      ? await sanityFetchStatic({
          query: homepageHeroRelatedByCategoryQuery,
          params: {
            categorySlug: mainStoryCategorySlug,
            excludePostId: mainStoryPost._id,
          },
          tag: "homepage.hero.related-category",
        })
      : [];

  return (await enrichCoverMediaInTree({
    justInPosts,
    mainHeadlinePosts,
    relatedCategoryPosts,
    frontlinePosts,
    rightRailSideStories,
    compactSideStories,
  })) as {
    justInPosts: typeof justInPosts;
    mainHeadlinePosts: typeof mainHeadlinePosts;
    relatedCategoryPosts: typeof relatedCategoryPosts;
    frontlinePosts: typeof frontlinePosts;
    rightRailSideStories: typeof rightRailSideStories;
    compactSideStories: typeof compactSideStories;
  };
}
