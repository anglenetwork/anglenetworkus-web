/** Posts used in the featured hero grid (center + side columns). */
export const CATEGORY_FEATURED_COUNT = 5;

/** Headline row directly under the featured hero. */
export const CATEGORY_HEADLINE_ROW_OFFSET = CATEGORY_FEATURED_COUNT;
export const CATEGORY_HEADLINE_ROW_COUNT = 4;

/** Title ticker in the category header (NewsTicker displays at most four). */
export const CATEGORY_TICKER_OFFSET =
  CATEGORY_HEADLINE_ROW_OFFSET + CATEGORY_HEADLINE_ROW_COUNT;
export const CATEGORY_TICKER_COUNT = 4;

/** Image card row below the featured section. */
export const CATEGORY_MISSED_IT_OFFSET =
  CATEGORY_TICKER_OFFSET + CATEGORY_TICKER_COUNT;
export const CATEGORY_MISSED_IT_COUNT = 4;

/** First index for the paginated latest list below the hero modules. */
export const CATEGORY_CONTENT_OFFSET =
  CATEGORY_MISSED_IT_OFFSET + CATEGORY_MISSED_IT_COUNT;

export type CategoryFeaturedArticles<T> = {
  leftColumn: T[];
  centerArticle: T;
  rightColumn: T[];
};

export type CategoryTickerPostSlice = {
  tickerTitle: string;
  slug: string;
};

function sliceWhenAvailable<T>(
  postList: readonly T[],
  offset: number,
  count: number,
): T[] {
  if (postList.length <= offset) return [];

  return postList.slice(offset, offset + count);
}

export function buildCategoryFeaturedArticles<T, U>(
  postList: readonly T[],
  transform: (post: T) => U,
): CategoryFeaturedArticles<U> | undefined {
  if (postList.length === 0) return undefined;

  return {
    centerArticle: transform(postList[0]),
    leftColumn: postList.slice(1, 3).map(transform),
    rightColumn: postList.slice(3, CATEGORY_FEATURED_COUNT).map(transform),
  };
}

export function buildCategoryHeadlineRowArticles<T, U>(
  postList: readonly T[],
  transform: (post: T) => U,
): U[] {
  return sliceWhenAvailable(
    postList,
    CATEGORY_HEADLINE_ROW_OFFSET,
    CATEGORY_HEADLINE_ROW_COUNT,
  ).map(transform);
}

export function buildCategoryTickerPosts<
  T extends {
    tickerTitle?: string | null;
    title?: string | null;
    slug?: string | null;
  },
>(postList: readonly T[]): CategoryTickerPostSlice[] {
  return sliceWhenAvailable(
    postList,
    CATEGORY_TICKER_OFFSET,
    CATEGORY_TICKER_COUNT,
  ).map((post) => ({
    tickerTitle: (post.tickerTitle || post.title || "Untitled").trim(),
    slug: post.slug || "#",
  }));
}

export function buildCategoryMissedItArticles<T, U>(
  postList: readonly T[],
  transform: (post: T) => U,
): U[] {
  return sliceWhenAvailable(
    postList,
    CATEGORY_MISSED_IT_OFFSET,
    CATEGORY_MISSED_IT_COUNT,
  ).map(transform);
}

export function buildCategoryLatestArticles<T, U>(
  postList: readonly T[],
  transform: (post: T) => U,
): U[] {
  if (postList.length <= CATEGORY_CONTENT_OFFSET) return [];

  return postList.slice(CATEGORY_CONTENT_OFFSET).map(transform);
}
