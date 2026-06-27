import { defineQuery } from "next-sanity";
import {
  GROQ_IN_BOOKMARK_HYDRATION_TYPES,
  GROQ_IN_MIXED_EDITORIAL_TYPES,
  GROQ_IN_TOPIC_CATEGORY_TAG_TYPES,
  GROQ_TYPE_ANALYSIS,
  GROQ_TYPE_OPINION,
  GROQ_TYPE_POST,
  GROQ_TYPE_SPONSORED,
} from "@/app/lib/article-family/feed-policies";
import {
  coverFieldsProjection,
  imageFieldsProjection,
  imageGalleryFieldsProjection,
} from "./image-fields-projection";

const GROQ_POST = GROQ_TYPE_POST;
const GROQ_OPINION = GROQ_TYPE_OPINION;
const GROQ_ANALYSIS = GROQ_TYPE_ANALYSIS;
const GROQ_SPONSORED = GROQ_TYPE_SPONSORED;
const GROQ_MIXED_EDITORIAL = GROQ_IN_MIXED_EDITORIAL_TYPES;
const GROQ_TOPIC_CATEGORY_TAG = GROQ_IN_TOPIC_CATEGORY_TAG_TYPES;
const GROQ_BOOKMARK_HYDRATION = GROQ_IN_BOOKMARK_HYDRATION_TYPES;

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
    },
    _type == "tweetEmbed" => {
      _type,
      _key,
      url,
      caption
    }
  }
`;

const articleFamilyImageGallery = imageGalleryFieldsProjection;

const articleFamilyCover = coverFieldsProjection;

const articleFamilyAuthor = `
  "author": select(
    defined(author->name) => {
      "name": coalesce(author->name, "Anonymous"),
      "slug": author->slug.current,
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
const articleFamilyCardFragment = `
  _id,
  _type,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "tickerTitle": coalesce(tickerTitle, ""),
  "slug": slug.current,
  excerpt,
  readTime,
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
const articleFamilyPageFragment = `
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

const ARTICLE_FAMILY_PUBLISHED = `
  status == "published" &&
  defined(publishedAt) && publishedAt <= now()
`;

/** Single document by type + slug — published editorial only (public site). */
export const articleFamilyPageBySlugQuery = defineQuery(`
  *[_type == $type && slug.current == $slug && ${ARTICLE_FAMILY_PUBLISHED}][0] {
    ${articleFamilyPageFragment}
  }
`);

/** Single document by type + slug — draft/preview (no published guard). */
export const articleFamilyPageBySlugPreviewQuery = defineQuery(`
  *[_type == $type && slug.current == $slug][0] {
    ${articleFamilyPageFragment}
  }
`);

/** Single document by stable Sanity ID, with slug guard — published only. */
export const articleFamilyPageByIdQuery = defineQuery(`
  *[_type == $type && _id == $id && slug.current == $slug && ${ARTICLE_FAMILY_PUBLISHED}][0] {
    ${articleFamilyPageFragment}
  }
`);

/** Single document by ID — draft/preview (no published guard). */
export const articleFamilyPageByIdPreviewQuery = defineQuery(`
  *[_type == $type && _id == $id && slug.current == $slug][0] {
    ${articleFamilyPageFragment}
  }
`);

const articleFamilyBookmarkCardFields = `
  _id,
  _type,
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  "date": coalesce(publishedAt, _updatedAt),
  cover{
    ${imageFieldsProjection}
  }
`;

/** Bookmark list hydration — all public article-family types by Sanity _id. */
export const articleFamilyBookmarksByIdsQuery = defineQuery(`
  *[_type in [${GROQ_BOOKMARK_HYDRATION}] && _id in $ids] {
    ${articleFamilyBookmarkCardFields}
  }
`);

/** Bookmark list fallback — hydrate by slug when stored Sanity _id does not match. */
export const articleFamilyBookmarksBySlugsQuery = defineQuery(`
  *[_type in [${GROQ_BOOKMARK_HYDRATION}] && slug.current in $slugs] {
    ${articleFamilyBookmarkCardFields}
  }
`);

export const postPublishedSlugsQuery = defineQuery(`
  *[
    _type == "${GROQ_POST}" &&
    defined(slug.current) &&
    ${ARTICLE_FAMILY_PUBLISHED}
  ][].slug.current
`);

export const opinionSlugsQuery = defineQuery(`
  *[_type == "${GROQ_OPINION}" && defined(slug.current)][].slug.current
`);

export const analysisSlugsQuery = defineQuery(`
  *[_type == "${GROQ_ANALYSIS}" && defined(slug.current)][].slug.current
`);

export const sponsoredSlugsQuery = defineQuery(`
  *[_type == "${GROQ_SPONSORED}" && defined(slug.current)][].slug.current
`);

// --- Feed helpers (hardcoded _type sets; sponsored excluded unless noted) ---

const standardNewsListQuery = defineQuery(`
  *[
    _type == "${GROQ_POST}" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...$limit] {
    ${articleFamilyListFragment}
  }
`);

export const opinionListQuery = defineQuery(`
  *[
    _type == "${GROQ_OPINION}" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...$limit] {
    ${articleFamilyListFragment}
  }
`);

const analysisListQuery = defineQuery(`
  *[
    _type == "${GROQ_ANALYSIS}" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...$limit] {
    ${articleFamilyListFragment}
  }
`);

const mixedEditorialListQuery = defineQuery(`
  *[
    _type in [${GROQ_MIXED_EDITORIAL}] &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...$limit] {
    ${articleFamilyListFragment}
  }
`);

/** Paginated opinion index (`/opinion`) */
export const opinionIndexQuery = defineQuery(`
  *[
    _type == "${GROQ_OPINION}" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [$start...$end] {
    ${articleFamilyListFragment}
  }
`);

export const opinionIndexCountQuery = defineQuery(`
  count(*[
    _type == "${GROQ_OPINION}" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ])
`);

/** Paginated analysis index (`/analysis`) */
export const analysisIndexQuery = defineQuery(`
  *[
    _type == "${GROQ_ANALYSIS}" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [$start...$end] {
    ${articleFamilyListFragment}
  }
`);

export const analysisIndexCountQuery = defineQuery(`
  count(*[
    _type == "${GROQ_ANALYSIS}" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ])
`);

/** Mixed editorial latest (`/latest`): post, opinion, analysis — no sponsored */
export const latestEditorialIndexQuery = defineQuery(`
  *[
    _type in [${GROQ_MIXED_EDITORIAL}] &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [$start...$end] {
    ${articleFamilyListFragment}
  }
`);

export const latestEditorialIndexCountQuery = defineQuery(`
  count(*[
    _type in [${GROQ_MIXED_EDITORIAL}] &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ])
`);

/** RSS / Atom feed — mixed editorial, canonical URLs only at render time */
export const feedEditorialEntriesQuery = defineQuery(`
  *[
    _type in [${GROQ_MIXED_EDITORIAL}] &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc) [0...40] {
    _type,
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    excerpt,
    publishedAt,
    ${articleFamilyAuthor}
  }
`);

export const authorPageQuery = defineQuery(`
  *[_type == "author" && slug.current == $slug][0] {
    name,
    title,
    "slug": slug.current,
    shortBio,
    bio,
    picture,
    website,
    twitter,
    linkedin,
    instagram,
    "articles": *[
      _type in [${GROQ_MIXED_EDITORIAL}] &&
      author->slug.current == $slug &&
      ${ARTICLE_FAMILY_PUBLISHED} &&
      defined(slug.current)
    ] | order(coalesce(publishedAt, _updatedAt) desc) [0...20] {
      ${articleFamilyListFragment}
    }
  }
`);

export const sitemapAuthorSlugsQuery = defineQuery(`
  *[
    _type == "author" &&
    defined(slug.current) &&
    count(*[
      _type in [${GROQ_MIXED_EDITORIAL}] &&
      author->slug.current == ^.slug.current &&
      ${ARTICLE_FAMILY_PUBLISHED} &&
      defined(slug.current)
    ]) > 0
  ].slug.current
`);

/** Category/topic listing: post + analysis only (see FEED_TOPIC_CATEGORY_TAG_TYPES) */
export const articlesByCategoryEditorialQuery = defineQuery(`
  *[
    _type in [${GROQ_TOPIC_CATEGORY_TAG}] &&
    category->slug.current == $categorySlug &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) {
    ${articleFamilyListFragment}
  }
`);

/** Category listing: `post` only (homepage Fifth Section — newest news, no analysis). */
const articlesByCategoryStandardPostsQuery = defineQuery(`
  *[
    _type == "${GROQ_POST}" &&
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
    _type == "${GROQ_POST}" &&
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
    _type in [${GROQ_TOPIC_CATEGORY_TAG}] &&
    $tagSlug in tags[]->slug.current &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) {
    ${articleFamilyListFragment}
  }
`);

export const editorialTagArticleCountQuery = defineQuery(`
  count(*[
    _type in [${GROQ_TOPIC_CATEGORY_TAG}] &&
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
    _type in [${GROQ_TOPIC_CATEGORY_TAG}] &&
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
    _type in [${GROQ_TOPIC_CATEGORY_TAG}] &&
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
    _type == "${GROQ_OPINION}" &&
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
    _type in [${GROQ_TOPIC_CATEGORY_TAG}] &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current) &&
    slug.current != $slug &&
    _id != $currentId
  ]{
    ${articleFamilyListFragment},
    "_rank": select(
      _type == "${GROQ_ANALYSIS}" && defined($categorySlug) && $categorySlug != "" && category->slug.current == $categorySlug => 4,
      _type == "${GROQ_POST}" && defined($categorySlug) && $categorySlug != "" && category->slug.current == $categorySlug => 3,
      _type == "${GROQ_ANALYSIS}" => 2,
      _type == "${GROQ_POST}" => 1
    )
  } | order(_rank desc, publishedAt desc) [0...$limit]
`);

/** Paginated sponsored index (`/sponsored`) */
export const sponsoredIndexQuery = defineQuery(`
  *[
    _type == "${GROQ_SPONSORED}" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [$start...$end] {
    ${articleFamilyListFragment}
  }
`);

export const sponsoredIndexCountQuery = defineQuery(`
  count(*[
    _type == "${GROQ_SPONSORED}" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ])
`);

/** Explicit opt-in: sponsored list only (never used as default editorial) */
const sponsoredListQuery = defineQuery(`
  *[
    _type == "${GROQ_SPONSORED}" &&
    ${ARTICLE_FAMILY_PUBLISHED} &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...$limit] {
    ${articleFamilyListFragment}
  }
`);

/** Sitemap: indexable article URLs only (post, opinion, analysis) */
export const sitemapArticleFamilyEntriesQuery = defineQuery(`
  *[
    _type in [${GROQ_MIXED_EDITORIAL}] &&
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
      _type in [${GROQ_TOPIC_CATEGORY_TAG}] &&
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
      _type in [${GROQ_TOPIC_CATEGORY_TAG}] &&
      ^.slug.current in tags[]->slug.current &&
      ${ARTICLE_FAMILY_PUBLISHED} &&
      defined(slug.current)
    ]) > 0
  ]{"slug": slug.current}
`);

/** News sitemap: post + analysis in last 48 hours */
export const newsSitemapEntriesQuery = defineQuery(`
  *[
    _type in [${GROQ_TOPIC_CATEGORY_TAG}] &&
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
