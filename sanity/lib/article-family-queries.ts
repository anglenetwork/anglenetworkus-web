import { defineQuery } from "next-sanity";
import {
  coverFieldsProjection,
  imageFieldsProjection,
  imageGalleryFieldsProjection,
} from "./image-fields-projection";

/**
 * Shared GROQ projections for article-family documents.
 * Composed by card/list/page queries; do not duplicate large shapes elsewhere.
 */

const articleFamilyBody = `
  "body": body[]{
    ...,
    _type == "editorialImage" => {
      ${imageFieldsProjection},
      layout
    }
  }
`;

const articleFamilyImageGallery = imageGalleryFieldsProjection;

const articleFamilyCover = coverFieldsProjection;

const articleFamilyAuthor = `
  "author": select(
    defined(author->name) => {
      "name": coalesce(author->name, "Anonymous"),
      "picture": author->picture
    }
  )
`;

const articleFamilyCategoryTags = `
  "category": select(
    defined(category->name) && defined(category->slug.current) => {
      "title": category->name,
      "slug": category->slug.current
    }
  ),
  "tags": tags[]->{
    "title": coalesce(title, name),
    "slug": slug.current
  }
`;

const articleFamilyTypeSpecific = `
  disclosure,
  analysisFocus,
  methodologyNote,
  sourcesNote,
  sponsorAttribution{
    sponsorName,
    sponsorUrl,
    disclosure
  }
`;

const articleFamilySeo = `
  seo{
    title,
    description,
    canonicalUrl,
    ogImage{
      asset,
      hotspot,
      crop,
      alt
    }
  }
`;

/** Card tiles / list previews — no body, no heavy gallery */
export const articleFamilyCardFragment = `
  _id,
  _type,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "tickerTitle": coalesce(tickerTitle, ""),
  "slug": slug.current,
  excerpt,
  ${articleFamilyCover},
  publishedAt,
  updatedAt,
  ${articleFamilyAuthor},
  ${articleFamilyCategoryTags},
  ${articleFamilyTypeSpecific}
`;

/** Feeds / archives — card-level fields only */
export const articleFamilyListFragment = articleFamilyCardFragment;

/** Full article page projection */
export const articleFamilyPageFragment = `
  _id,
  _type,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "tickerTitle": coalesce(tickerTitle, ""),
  "slug": slug.current,
  excerpt,
  ${articleFamilyCover},
  publishedAt,
  updatedAt,
  "date": coalesce(publishedAt, _updatedAt),
  ${articleFamilyAuthor},
  ${articleFamilyCategoryTags},
  ${articleFamilyTypeSpecific},
  ${articleFamilySeo},
  ${articleFamilyBody},
  ${articleFamilyImageGallery}
`;

export const ARTICLE_FAMILY_PUBLISHED = `
  status == "published" &&
  defined(publishedAt) && publishedAt <= now()
`;

/** Single document by type + slug (uses _type from caller — no guessing) */
export const articleFamilyPageBySlugQuery = defineQuery(`
  *[_type == $type && slug.current == $slug][0] {
    ${articleFamilyPageFragment}
  }
`);

/** Single document by stable Sanity ID, with slug guard for duplicate-slug routes. */
export const articleFamilyPageByIdQuery = defineQuery(`
  *[_type == $type && _id == $id && slug.current == $slug][0] {
    ${articleFamilyPageFragment}
  }
`);

/** Bookmark list hydration — all public article-family types by Sanity _id. */
export const articleFamilyBookmarksByIdsQuery = defineQuery(`
  *[_type in ["post", "opinion", "analysis", "sponsored"] && _id in $ids] {
    _id,
    _type,
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    "date": coalesce(publishedAt, _updatedAt),
    cover{
      ${imageFieldsProjection}
    }
  }
`);

export const opinionSlugsQuery = defineQuery(`
  *[_type == "opinion" && defined(slug.current)][].slug.current
`);

export const analysisSlugsQuery = defineQuery(`
  *[_type == "analysis" && defined(slug.current)][].slug.current
`);

export const sponsoredSlugsQuery = defineQuery(`
  *[_type == "sponsored" && defined(slug.current)][].slug.current
`);

// --- Feed helpers (hardcoded _type sets; sponsored excluded unless noted) ---

export const standardNewsListQuery = defineQuery(`
  *[
    _type == "post" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...$limit] {
    ${articleFamilyListFragment}
  }
`);

export const opinionListQuery = defineQuery(`
  *[
    _type == "opinion" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...$limit] {
    ${articleFamilyListFragment}
  }
`);

export const analysisListQuery = defineQuery(`
  *[
    _type == "analysis" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...$limit] {
    ${articleFamilyListFragment}
  }
`);

export const mixedEditorialListQuery = defineQuery(`
  *[
    _type in ["post", "opinion", "analysis"] &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...$limit] {
    ${articleFamilyListFragment}
  }
`);

/** Paginated opinion index (`/opinion`) */
export const opinionIndexQuery = defineQuery(`
  *[
    _type == "opinion" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [$start...$end] {
    ${articleFamilyListFragment}
  }
`);

export const opinionIndexCountQuery = defineQuery(`
  count(*[
    _type == "opinion" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ])
`);

/** Paginated analysis index (`/analysis`) */
export const analysisIndexQuery = defineQuery(`
  *[
    _type == "analysis" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [$start...$end] {
    ${articleFamilyListFragment}
  }
`);

export const analysisIndexCountQuery = defineQuery(`
  count(*[
    _type == "analysis" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ])
`);

/** Mixed editorial latest (`/latest`): post, opinion, analysis — no sponsored */
export const latestEditorialIndexQuery = defineQuery(`
  *[
    _type in ["post", "opinion", "analysis"] &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [$start...$end] {
    ${articleFamilyListFragment}
  }
`);

export const latestEditorialIndexCountQuery = defineQuery(`
  count(*[
    _type in ["post", "opinion", "analysis"] &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ])
`);

/** Category/topic listing: post + analysis only (see FEED_TOPIC_CATEGORY_TAG_TYPES) */
export const articlesByCategoryEditorialQuery = defineQuery(`
  *[
    _type in ["post", "analysis"] &&
    category->slug.current == $categorySlug &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) {
    ${articleFamilyListFragment}
  }
`);

/** Category listing: `post` only (homepage Fifth Section — newest news, no analysis). */
export const articlesByCategoryStandardPostsQuery = defineQuery(`
  *[
    _type == "post" &&
    category->slug.current == $categorySlug &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) {
    ${articleFamilyListFragment}
  }
`);

/** Same filter/order as `articlesByCategoryStandardPostsQuery`, capped for homepage Fifth Section. */
export const articlesByCategoryStandardPostsLimitedQuery = defineQuery(`
  *[
    _type == "post" &&
    category->slug.current == $categorySlug &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...$limit] {
    ${articleFamilyListFragment}
  }
`);

/** Tag listing: post + analysis only */
export const articlesByTagEditorialQuery = defineQuery(`
  *[
    _type in ["post", "analysis"] &&
    $tagSlug in tags[]->slug.current &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) {
    ${articleFamilyListFragment}
  }
`);

export const editorialTagArticleCountQuery = defineQuery(`
  count(*[
    _type in ["post", "analysis"] &&
    $tagSlug in tags[]->slug.current &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ])
`);

/**
 * Latest editorial articles in a given category, excluding the current article.
 * Used by the post-page "More in {category}" related-articles module (classic + modern).
 */
export const latestInCategoryForRelatedQuery = defineQuery(`
  *[
    _type in ["post", "analysis"] &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current) &&
    defined($categorySlug) && $categorySlug != "" &&
    category->slug.current == $categorySlug &&
    _id != $currentId
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...$limit] {
    ${articleFamilyListFragment}
  }
`);

/**
 * Related on `post` pages: post + analysis only; same category first, then recency.
 */
export const relatedContentForPostQuery = defineQuery(`
  *[
    _type in ["post", "analysis"] &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current) &&
    slug.current != $slug &&
    _id != $currentId
  ]{
    ${articleFamilyListFragment},
    "_sortCat": select(
      defined($categorySlug) && $categorySlug != "" && category->slug.current == $categorySlug => 1,
      0
    )
  } | order(_sortCat desc, publishedAt desc) [0...$limit]
`);

/** Related on `opinion` pages: opinion only */
export const relatedContentForOpinionQuery = defineQuery(`
  *[
    _type == "opinion" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current) &&
    slug.current != $slug &&
    _id != $currentId
  ] | order(publishedAt desc) [0...$limit] {
    ${articleFamilyListFragment}
  }
`);

/**
 * Related on `analysis` pages: analysis preferred, then post; same category ranks higher.
 */
export const relatedContentForAnalysisQuery = defineQuery(`
  *[
    _type in ["post", "analysis"] &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current) &&
    slug.current != $slug &&
    _id != $currentId
  ]{
    ${articleFamilyListFragment},
    "_rank": select(
      _type == "analysis" && defined($categorySlug) && $categorySlug != "" && category->slug.current == $categorySlug => 4,
      _type == "post" && defined($categorySlug) && $categorySlug != "" && category->slug.current == $categorySlug => 3,
      _type == "analysis" => 2,
      _type == "post" => 1
    )
  } | order(_rank desc, publishedAt desc) [0...$limit]
`);

/** Explicit opt-in: sponsored list only (never used as default editorial) */
export const sponsoredListQuery = defineQuery(`
  *[
    _type == "sponsored" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...$limit] {
    ${articleFamilyListFragment}
  }
`);

/** Sitemap: indexable article URLs only (post, opinion, analysis) */
export const sitemapArticleFamilyEntriesQuery = defineQuery(`
  *[
    _type in ["post", "opinion", "analysis"] &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ]{
    "_type": _type,
    "slug": slug.current,
    "publishedAt": publishedAt,
    "_updatedAt": _updatedAt
  }
`);

/** Categories that have at least one editorial post+analysis article */
export const sitemapCategorySlugsWithArticlesQuery = defineQuery(`
  *[
    _type == "category" &&
    defined(slug.current) &&
    count(*[
      _type in ["post", "analysis"] &&
      category->slug.current == ^.slug.current &&
      ${ARTICLE_FAMILY_PUBLISHED} &&
      defined(slug.current)
    ]) > 0
  ]{"slug": slug.current}
`);

/** Tags that have at least one editorial post+analysis article */
export const sitemapTagSlugsWithArticlesQuery = defineQuery(`
  *[
    _type == "tag" &&
    defined(slug.current) &&
    count(*[
      _type in ["post", "analysis"] &&
      ^.slug.current in tags[]->slug.current &&
      ${ARTICLE_FAMILY_PUBLISHED} &&
      defined(slug.current)
    ]) > 0
  ]{"slug": slug.current}
`);

/** News sitemap: post + analysis in last 48 hours */
export const newsSitemapEntriesQuery = defineQuery(`
  *[
    _type in ["post", "analysis"] &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current) &&
    publishedAt > $since
  ] | order(publishedAt desc) {
    "_type": _type,
    "slug": slug.current,
    "publishedAt": publishedAt,
    "title": coalesce(title, "Untitled")
  }
`);
