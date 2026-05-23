// /sanity/lib/queries.ts
import { defineQuery } from "next-sanity";
import { articleFamilyListFragment } from "./article-family-queries";

/** ---------------------------
 *  Shared post field projection
 *  --------------------------- */
const postFields = `
  _id,
  _type,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  // New cover (external or asset)
  cover{
    source,
    externalUrl,
    image,
    alt,
    epigraph,
    creditProvider,
    creditAuthor,
    creditSourceUrl,
    creditLicense
  },
  "date": coalesce(publishedAt, _updatedAt),
  publishedAt,
  updatedAt,
  priority,
  featured,
  labels,
  justIn,
  breakingNews,
  developingStory,
  mainHeadline,
  frontline,
  rightHeadline,

  "author": select(
    defined(author->name) => {
      "name": coalesce(author->name, "Anonymous"),
      "picture": author->picture
    }
  ),

  "category": select(
    defined(category->name) && defined(category->slug.current) => {
      "title": category->name,
      "slug": category->slug.current
    }
  ),

  // Support both tag.title and category.name during transition
  "tags": tags[]->{
    "title": coalesce(title, name),
    "slug": slug.current
  },

  "body": body[]{
    ...,
    _type == "editorialImage" => {
      ...
    }
  },
  "imageGallery": imageGallery[]{
    source,
    externalUrl,
    image,
    alt,
    epigraph,
    creditProvider,
    creditAuthor,
    creditSourceUrl,
    creditLicense
  },
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

/** Homepage SecondSection: 1 lead + 2 small cards (no body/tags/seo). */
const postFieldsHighlightedStories = `
  _id,
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  cover{
    source,
    externalUrl,
    image,
    alt,
    epigraph,
    creditProvider,
    creditAuthor,
    creditSourceUrl,
    creditLicense
  },
  "imageGallery": imageGallery[]{
    source,
    externalUrl,
    image,
    alt,
    epigraph,
    creditProvider,
    creditAuthor,
    creditSourceUrl,
    creditLicense
  },
  "category": select(
    defined(category->name) && defined(category->slug.current) => {
      "title": category->name,
      "slug": category->slug.current
    }
  )
`;

/** ---------------------------
 *  Basic queries
 *  --------------------------- */
export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

export const heroQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0] {
    ${postFields}
  }
`);

export const moreStoriesQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    ${postFields}
  }
`);

// Lightweight post fields for landing page.
const postFieldsLightweight = `
  _id,
  _type,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  // New cover (external or asset)
  cover{
    source,
    externalUrl,
    image,
    alt,
    epigraph,
    creditProvider,
    creditAuthor,
    creditSourceUrl,
    creditLicense
  },
  "date": coalesce(publishedAt, _updatedAt),
  publishedAt,
  updatedAt,
  priority,
  featured,
  labels,
  justIn,
  breakingNews,
  developingStory,
  mainHeadline,
  frontline,
  rightHeadline,

  "author": select(
    defined(author->name) => {
      "name": coalesce(author->name, "Anonymous"),
      "picture": author->picture
    }
  ),

  "category": select(
    defined(category->name) && defined(category->slug.current) => {
      "title": category->name,
      "slug": category->slug.current
    }
  ),

  // Support both tag.title and category.name during transition
  "tags": tags[]->{
    "title": coalesce(title, name),
    "slug": slug.current
  },

  // Only include imageGallery in lightweight payloads.
  "imageGallery": imageGallery[]{
    source,
    externalUrl,
    image,
    alt,
    epigraph,
    creditProvider,
    creditAuthor,
    creditSourceUrl,
    creditLicense
  }
`;

export const indexQuery = defineQuery(`
  *[_type == "post"] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) {
    ${postFieldsLightweight}
  }
`);

export const homepageHeroJustInQuery = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current) &&
    justIn == true
  ] | order(
    dateTime(coalesce(publishedAt, _updatedAt)) desc,
    dateTime(_updatedAt) desc
  )[0...5] {
    ${postFieldsLightweight}
  }
`);

export const homepageHeroMainHeadlineQuery = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current) &&
    mainHeadline == true
  ] | order(
    dateTime(coalesce(publishedAt, _updatedAt)) desc,
    dateTime(_updatedAt) desc
  )[0...1] {
    ${postFieldsLightweight}
  }
`);

export const homepageHeroFrontlineQuery = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current) &&
    frontline == true
  ] | order(
    dateTime(coalesce(publishedAt, _updatedAt)) desc,
    dateTime(_updatedAt) desc
  )[0...3] {
    ${postFieldsLightweight}
  }
`);

export const homepageHeroRightHeadlineQuery = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current) &&
    rightHeadline == true
  ] | order(
    dateTime(coalesce(publishedAt, _updatedAt)) desc,
    dateTime(_updatedAt) desc
  )[0...2] {
    ${postFieldsLightweight}
  }
`);

export const homepageHeroRelatedByCategoryQuery = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current) &&
    category->slug.current == $categorySlug &&
    _id != $excludePostId
  ] | order(
    dateTime(coalesce(publishedAt, _updatedAt)) desc,
    dateTime(_updatedAt) desc
  )[0...3] {
    ${postFieldsLightweight}
  }
`);

export const postQueryWithRelated = defineQuery(`
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    ${postFields}
  },
  "latestNews": *[_type == "post" && slug.current != $slug] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...6] {
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [4...8] {
    ${postFields}
  },
  "nextArticles": *[_type == "post" && slug.current != $slug] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [8...18] {
    ${postFields}
  }
}
`);

export const postQueryWithCategoryRelated = defineQuery(`
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    ${postFields}
  },
  "latestNews": *[_type == "post" && slug.current != $slug] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...6] {
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [4...8] {
    ${postFields}
  },
  "newsForYou": *[_type == "post" && slug.current != $slug] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...4] {
    ${postFields}
  },
  "categoryArticles": *[_type == "post" && slug.current != $slug && category->slug.current == $categorySlug] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...6] {
    ${postFields}
  }
}
`);

export const postSlugsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)][].slug.current
`);

// Latest 4 overall (for "News for you")
export const latestNews4Query = `
*[
  _type == "post" &&
  status == "published" &&
  defined(publishedAt) && publishedAt <= now() &&
  _id != $currentPostId
] | order(publishedAt desc)[0...4] {
  _id,
  _type,
  title,
  "slug": slug.current,
  excerpt, 
  cover{
    source,
    externalUrl,
    image,
    alt,
    epigraph,
  },
  publishedAt,
  "date": coalesce(publishedAt, _updatedAt)
}
`;

/** Recency + editorial fallback for "Popular reads" when Supabase metrics are empty (no Sanity views). */
export const popularReadsFallbackQuery = `
*[
  _type == "post" &&
  status == "published" &&
  defined(publishedAt) && publishedAt <= now() &&
  _id != $currentPostId
]{
  _id, title, "slug": slug.current, excerpt, 
  cover{
    source,
    externalUrl,
    image,
    alt,
    epigraph,
  },
  publishedAt,
  priority, featured,
  "recencyBoost": select(publishedAt > dateTime(now()) - 60*60*24*14 => 1.5, 0),
  "editorialBoost": (coalesce(priority, 0) * 0.3) + select(featured == true => 0.4, 0)
} | order(
  (recencyBoost + editorialBoost) desc,
  publishedAt desc
)[0...4]
`;

/** Homepage most-read fallback (no current-article exclusion). */
export const homepageMostReadFallbackQuery = `
*[
  _type == "post" &&
  status == "published" &&
  defined(publishedAt) && publishedAt <= now()
]{
  _id, title, "slug": slug.current, excerpt, 
  cover{
    source,
    externalUrl,
    image,
    alt,
    epigraph,
  },
  publishedAt,
  priority, featured,
  "recencyBoost": select(publishedAt > dateTime(now()) - 60*60*24*14 => 1.5, 0),
  "editorialBoost": (coalesce(priority, 0) * 0.3) + select(featured == true => 0.4, 0)
} | order(
  (recencyBoost + editorialBoost) desc,
  publishedAt desc
)[0...5]
`;

export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields}
  }
`);

export {
  articlesByCategoryEditorialQuery as postsByCategoryQuery,
  articlesByCategoryStandardPostsQuery as postsByCategoryStandardPostsQuery,
  articlesByCategoryStandardPostsLimitedQuery as postsByCategoryStandardPostsLimitedQuery,
} from "./article-family-queries";

export const categorySlugsQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)]{ "slug": slug.current, name, views }
`);

export const allCategoriesQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(name asc) {
    "slug": slug.current,
    name,
    views
  }
`);

export const categoriesByViewsQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(coalesce(order, 999) asc, name asc) {
    "slug": slug.current,
    name,
    views,
    order
  }
`);

export const topTagsByViewsQuery = defineQuery(`
  *[_type == "tag" && defined(slug.current)] | order(coalesce(views, 0) desc, title asc) [0...5] {
    "slug": slug.current,
    title,
    views
  }
`);

export const showsTagsByViewsQuery = defineQuery(`
  *[_type == "tag" && defined(slug.current)] | order(coalesce(views, 0) desc, title asc) [5...11] {
    "slug": slug.current,
    title,
    views
  }
`);

export const tagSlugsQuery = defineQuery(`
  *[_type == "tag" && defined(slug.current)]{ "slug": slug.current, title }
`);

export const tagBySlugQuery = defineQuery(`
  *[_type == "tag" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    emoji,
    color,
    featured,
    deprecated,
    views,
    "redirectTo": redirectTo->{
      title,
      "slug": slug.current
    },
    aliases,
    order
  }
`);

export { articlesByTagEditorialQuery as postsByTagQuery } from "./article-family-queries";

/** ---------------------------
 *  Authors / comments
 *  --------------------------- */
export const authorQuery = defineQuery(`
  *[_type == "author" && slug.current == $slug][0] {
    name,
    picture,
    "posts": *[_type == "post" && author->slug.current == $slug] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) {
      ${postFields}
    }
  }
`);

export const authorSlugsQuery = defineQuery(`
  *[_type == "author" && defined(slug.current)][].slug.current
`);

export const commentsQuery = defineQuery(`
  *[_type == "comment" && post->slug.current == $postSlug && approved == true] | order(_createdAt desc) {
    name, email, comment, _createdAt
  }
`);

export const fourthSectionQuery = defineQuery(`
  *[_type == "post" && category->slug.current == $categorySlug] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...3] {
    ${postFields}
  }
`);

export const thirdLatestArticleQuery = defineQuery(`
  *[_type == "post" && category->slug.current == $categorySlug] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [2...3] {
    ${postFields}
  }
`);

export const thirdSectionQuery = defineQuery(`
  *[_type == "post" && category->slug.current == $categorySlug] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...4] {
    ${postFields}
  }
`);

/** Latest 3 posts per category: 1 featured + 2 in the small list (SecondSection). */
export const highlightedStoriesByCategoryQuery = defineQuery(`
  *[_type == "post" && category->slug.current == $categorySlug]
  | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...3] {
    ${postFieldsHighlightedStories}
  }
`);

export const mostReadQuery = defineQuery(`
  *[_type == "post"] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...5] {
    ${postFields}
  }
`);

/** Fetch post cards by Sanity ids (homepage / sidebars; order preserved in application code). */
export const postsByIdsLightweightQuery = defineQuery(`
  *[_type == "post" && _id in $ids] {
    ${postFieldsLightweight}
  }
`);

export const sixthSectionQuery = defineQuery(`
  *[_type == "post" && category->slug.current == $categorySlug] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...20] {
    ${postFields}
  }
`);

export const newsTickerQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && defined(tickerTitle)] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...4] {
    tickerTitle,
    "slug": slug.current
  }
`);

export const categoryTickerQuery = defineQuery(`
  *[_type == "post" && category->slug.current == $categorySlug && defined(slug.current) && defined(tickerTitle)] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [5...10] {
    tickerTitle,
    "slug": slug.current
  }
`);

/** ---------------------------
 *  SEARCH (post, opinion, analysis, sponsored — `all` is editorial-only)
 *  Relevance: GROQ score() + boost() weights; newest: publishedAt desc only.
 *  --------------------------- */
const SEARCH_PUBLISHED = `status == "published" && defined(publishedAt) && publishedAt <= now()`;

/** Prefer denormalized searchText; keep local fallbacks while older docs are backfilled. */
const SEARCH_TEXT_MATCH = `(
  searchText match $term ||
  title match $term ||
  tickerTitle match $term ||
  excerpt match $term ||
  cover.epigraph match $term
)`;

/** score()/boost() only allow document-local match expressions (no derefs, pt::text, count). */
const SEARCH_SCORE_PIPE = `
| score(
  boost(title match $term, 100),
  boost(tickerTitle match $term, 80),
  boost(excerpt match $term, 65),
  boost(cover.epigraph match $term, 55),
  boost(searchText match $term, 20)
)
| order(_score desc, publishedAt desc)
`;

const SEARCH_NEWEST_PIPE = `| order(publishedAt desc)`;

const SEARCH_SLICE_PROJECT = `[$start...$end] {
  ${articleFamilyListFragment}
}`;

/** Mixed editorial — relevance */
export const searchEditorialAllRelevanceQuery = `
*[
  _type in ["post", "opinion", "analysis"] &&
  ${SEARCH_PUBLISHED} &&
  ${SEARCH_TEXT_MATCH}
] ${SEARCH_SCORE_PIPE} ${SEARCH_SLICE_PROJECT}
`;

/** Mixed editorial — newest */
export const searchEditorialAllNewestQuery = `
*[
  _type in ["post", "opinion", "analysis"] &&
  ${SEARCH_PUBLISHED} &&
  ${SEARCH_TEXT_MATCH}
] ${SEARCH_NEWEST_PIPE} ${SEARCH_SLICE_PROJECT}
`;

/** Post-only — relevance */
export const searchEditorialPostRelevanceQuery = `
*[
  _type == "post" &&
  ${SEARCH_PUBLISHED} &&
  ${SEARCH_TEXT_MATCH}
] ${SEARCH_SCORE_PIPE} ${SEARCH_SLICE_PROJECT}
`;

/** Post-only — newest */
export const searchEditorialPostNewestQuery = `
*[
  _type == "post" &&
  ${SEARCH_PUBLISHED} &&
  ${SEARCH_TEXT_MATCH}
] ${SEARCH_NEWEST_PIPE} ${SEARCH_SLICE_PROJECT}
`;

/** Opinion-only — relevance */
export const searchEditorialOpinionRelevanceQuery = `
*[
  _type == "opinion" &&
  ${SEARCH_PUBLISHED} &&
  ${SEARCH_TEXT_MATCH}
] ${SEARCH_SCORE_PIPE} ${SEARCH_SLICE_PROJECT}
`;

/** Opinion-only — newest */
export const searchEditorialOpinionNewestQuery = `
*[
  _type == "opinion" &&
  ${SEARCH_PUBLISHED} &&
  ${SEARCH_TEXT_MATCH}
] ${SEARCH_NEWEST_PIPE} ${SEARCH_SLICE_PROJECT}
`;

/** Analysis-only — relevance */
export const searchEditorialAnalysisRelevanceQuery = `
*[
  _type == "analysis" &&
  ${SEARCH_PUBLISHED} &&
  ${SEARCH_TEXT_MATCH}
] ${SEARCH_SCORE_PIPE} ${SEARCH_SLICE_PROJECT}
`;

/** Analysis-only — newest */
export const searchEditorialAnalysisNewestQuery = `
*[
  _type == "analysis" &&
  ${SEARCH_PUBLISHED} &&
  ${SEARCH_TEXT_MATCH}
] ${SEARCH_NEWEST_PIPE} ${SEARCH_SLICE_PROJECT}
`;

/** Sponsored-only — relevance */
export const searchEditorialSponsoredRelevanceQuery = `
*[
  _type == "sponsored" &&
  ${SEARCH_PUBLISHED} &&
  ${SEARCH_TEXT_MATCH}
] ${SEARCH_SCORE_PIPE} ${SEARCH_SLICE_PROJECT}
`;

/** Sponsored-only — newest */
export const searchEditorialSponsoredNewestQuery = `
*[
  _type == "sponsored" &&
  ${SEARCH_PUBLISHED} &&
  ${SEARCH_TEXT_MATCH}
] ${SEARCH_NEWEST_PIPE} ${SEARCH_SLICE_PROJECT}
`;

/** Total matches for current term + type scope (no pagination) */
export const searchEditorialCountAllQuery = defineQuery(`
  count(*[
    _type in ["post", "opinion", "analysis"] &&
    ${SEARCH_PUBLISHED} &&
    ${SEARCH_TEXT_MATCH}
  ])
`);

export const searchEditorialCountPostQuery = defineQuery(`
  count(*[
    _type == "post" &&
    ${SEARCH_PUBLISHED} &&
    ${SEARCH_TEXT_MATCH}
  ])
`);

export const searchEditorialCountOpinionQuery = defineQuery(`
  count(*[
    _type == "opinion" &&
    ${SEARCH_PUBLISHED} &&
    ${SEARCH_TEXT_MATCH}
  ])
`);

export const searchEditorialCountAnalysisQuery = defineQuery(`
  count(*[
    _type == "analysis" &&
    ${SEARCH_PUBLISHED} &&
    ${SEARCH_TEXT_MATCH}
  ])
`);

export const searchEditorialCountSponsoredQuery = defineQuery(`
  count(*[
    _type == "sponsored" &&
    ${SEARCH_PUBLISHED} &&
    ${SEARCH_TEXT_MATCH}
  ])
`);

export const eighthSectionQuery = defineQuery(`
  *[_type == "category" && slug.current in $categorySlugs] {
    "slug": slug.current,
    "name": name,
    "posts": *[_type == "post" && category->slug.current == slug.current] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...3] {
      ${postFields}
    }
  }
`);

// Query for fetching posts by their IDs (for bookmarks)
export const postsByIdsQuery = defineQuery(`
  *[_type == "post" && _id in $ids] {
    _id,
    title,
    "slug": slug.current,
    "date": coalesce(publishedAt, _updatedAt),
    cover{
      source,
      externalUrl,
      image,
      alt,
      epigraph,
      creditProvider,
      creditAuthor,
      creditSourceUrl,
      creditLicense
    }
  }
`);

export const mainHeadlinesQuery = defineQuery(`
  *[_type == "post" && mainHeadline == true && defined(slug.current)] 
  | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...5] {
    _id,
    title,
    "slug": slug.current,
    cover{
      source,
      externalUrl,
      image,
      alt,
      epigraph,
      creditProvider,
      creditAuthor,
      creditSourceUrl,
      creditLicense
    }
  }
`);

export const secondSectionQuery = defineQuery(`
  *[_type == "category" && slug.current in $categorySlugs] {
    "slug": slug.current,
    "name": name,
    "thirdMostViewed": *[_type == "post" && category->slug.current == slug.current] | order(publishedAt desc, _updatedAt desc) [0...5] {
      _id, title, "slug": slug.current, excerpt, 
      cover{
        source,
        externalUrl,
        image,
        alt
      },
      "date": coalesce(publishedAt, _updatedAt), publishedAt,
      "author": select(
        defined(author->name) => {
          "name": coalesce(author->name, "Anonymous"),
          "picture": author->picture
        }
      ),
      "category": select(
        defined(category->name) && defined(category->slug.current) => {
          "title": category->name,
          "slug": category->slug.current
        }
      )
    },
    "thirdLatest": *[_type == "post" && category->slug.current == slug.current] | order(publishedAt desc, _updatedAt desc) [0...5] {
      _id, title, "slug": slug.current, excerpt, 
      cover{
        source,
        externalUrl,
        image,
        alt
      },
      "date": coalesce(publishedAt, _updatedAt), publishedAt,
      "author": select(
        defined(author->name) => {
          "name": coalesce(author->name, "Anonymous"),
          "picture": author->picture
        }
      ),
      "category": select(
        defined(category->name) && defined(category->slug.current) => {
          "title": category->name,
          "slug": category->slug.current
        }
      )
    }
  }
`);
