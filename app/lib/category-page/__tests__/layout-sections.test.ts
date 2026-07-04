import { describe, expect, it } from "vitest";
import {
  buildCategoryFeaturedArticles,
  buildCategoryLatestArticles,
  buildCategoryMissedItArticles,
  CATEGORY_CONTENT_OFFSET,
  CATEGORY_FEATURED_COUNT,
  CATEGORY_MISSED_IT_COUNT,
} from "../layout-sections";

const posts = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  title: `Post ${index}`,
  tickerTitle: `Ticker ${index}`,
  slug: `post-${index}`,
}));

describe("category page layout sections", () => {
  it("defines consecutive non-overlapping section offsets", () => {
    expect(CATEGORY_FEATURED_COUNT).toBe(5);
    expect(CATEGORY_MISSED_IT_COUNT).toBe(4);
    expect(CATEGORY_CONTENT_OFFSET).toBe(9);
  });

  it("uses five featured slots with the newest post centered", () => {
    const featured = buildCategoryFeaturedArticles(posts, (post) => post);

    expect(featured?.centerArticle).toEqual(posts[0]);
    expect(featured?.leftColumn.map((post) => post.id)).toEqual([1, 2]);
    expect(featured?.rightColumn.map((post) => post.id)).toEqual([3, 4]);
  });

  it("builds missed-it and latest slices without overlap", () => {
    const missedIt = buildCategoryMissedItArticles(posts, (post) => post);
    const latest = buildCategoryLatestArticles(posts, (post) => post);

    expect(missedIt.map((post) => post.id)).toEqual([5, 6, 7, 8]);
    expect(latest.map((post) => post.id)).toEqual([9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
  });

  it("returns empty latest list when all posts fit above it", () => {
    expect(
      buildCategoryLatestArticles(posts.slice(0, 9), (post) => post),
    ).toEqual([]);
  });

  it("includes the fifth post in missed-it when only nine posts exist", () => {
    const missedIt = buildCategoryMissedItArticles(
      posts.slice(0, 9),
      (post) => post,
    );

    expect(missedIt.map((post) => post.id)).toEqual([5, 6, 7, 8]);
  });
});
