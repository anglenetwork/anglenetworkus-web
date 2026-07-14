/** Posts used in the featured hero grid (center + side columns). */
export const CATEGORY_FEATURED_COUNT = 5;

/** Text headline row inside "More in {category}" (directly after the hero). */
const CATEGORY_MISSED_IT_OFFSET = CATEGORY_FEATURED_COUNT;
export const CATEGORY_MISSED_IT_COUNT = 3;

/** First index for the paginated latest list below the hero modules. */
export const CATEGORY_CONTENT_OFFSET =
  CATEGORY_MISSED_IT_OFFSET + CATEGORY_MISSED_IT_COUNT;

export type CategoryFeaturedArticles<T> = {
  leftColumn: T[];
  centerArticle: T;
  rightColumn: T[];
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
