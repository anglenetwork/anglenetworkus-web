// /sanity/lib/queries.ts
import { HOMEPAGE_JUST_IN_LIMIT } from "@/app/lib/homepage/first-section";
import { defineQuery } from "next-sanity";
import { articleFamilyListFragment } from "./article-family-queries";
import {
  homepageFrontlinePostFilter,
  homepageJustInPostFilter,
  homepageMainHeadlinePostFilter,
  homepagePublishedEditorialFilter,
  homepagePublishedPostFilter,
  homepagePublishedPostOrder,
  homepageRightHeadlinePostFilter,
} from "./homepage-query-filters";
import {
  imageFieldsProjection,
  imageGalleryFieldsProjection,
} from "./image-fields-projection";

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
  readTime,
  // New cover (external or asset)
  cover{
    ${imageFieldsProjection}
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
      ${imageFieldsProjection},
      layout
    },
    _type == "tweetEmbed" => {
      _type,
      _key,
      url,
      caption
    }
  },
  ${imageGalleryFieldsProjection},
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

/** First section right rail: compact image + title rows. */
const postFieldsHeroRightRail = `
  _id,
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  readTime,
  cover{
    ${imageFieldsProjection}
  }
`;

/** Homepage SecondSection: 1 lead + 2 small cards (no body/tags/seo). */
const postFieldsHighlightedStories = `
  _id,
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  readTime,
  cover{
    ${imageFieldsProjection}
  },
  ${imageGalleryFieldsProjection},
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

// Lightweight post fields for landing page.
const postFieldsLightweight = `
  _id,
  _type,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  readTime,
  cover{
    ${imageFieldsProjection}
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

  ${imageGalleryFieldsProjection}
`;

export const homepageHeroJustInQuery = defineQuery(`
  *[
    ${homepageJustInPostFilter}
  ] | order(
    ${homepagePublishedPostOrder}
  )[0...${HOMEPAGE_JUST_IN_LIMIT}] {
    ${postFieldsLightweight}
  }
`);

export const homepageHeroMainHeadlineQuery = defineQuery(`
  *[
    ${homepageMainHeadlinePostFilter}
  ] | order(
    ${homepagePublishedPostOrder}
  )[0...1] {
    ${postFieldsLightweight}
  }
`);

export const homepageHeroFrontlineQuery = defineQuery(`
  *[
    ${homepageFrontlinePostFilter}
  ] | order(
    ${homepagePublishedPostOrder}
  )[0...2] {
    ${postFieldsLightweight}
  }
`);

export const homepageHeroRightHeadlineQuery = defineQuery(`
  *[
    ${homepageRightHeadlinePostFilter}
  ] | order(
    ${homepagePublishedPostOrder}
  )[0...10] {
    ${postFieldsHeroRightRail}
  }
`);

export const homepageHeroRelatedByCategoryQuery = defineQuery(`
  *[
    ${homepagePublishedPostFilter} &&
    category->slug.current == $categorySlug &&
    _id != $excludePostId
  ] | order(
    ${homepagePublishedPostOrder}
  )[0...3] {
    ${postFieldsLightweight}
  }
`);

/**
 * Homepage hero bundle: fetches justIn / mainHeadline / frontline / rightHeadline
 * in a single GROQ request instead of 4 separate calls.
 * The related-by-category query stays as a follow-up because it depends on the
 * resolved main story's category slug.
 */
export const homepageHeroBundleQuery = defineQuery(`
  {
    "justInPosts": *[
      ${homepageJustInPostFilter}
    ] | order(
      ${homepagePublishedPostOrder}
    )[0...${HOMEPAGE_JUST_IN_LIMIT}] {
      ${postFieldsLightweight}
    },
    "mainHeadlinePosts": *[
      ${homepageMainHeadlinePostFilter}
    ] | order(
      ${homepagePublishedPostOrder}
    )[0...1] {
      ${postFieldsLightweight}
    },
    "frontlinePosts": *[
      ${homepageFrontlinePostFilter}
    ] | order(
      ${homepagePublishedPostOrder}
    )[0...2] {
      ${postFieldsLightweight}
    },
    "rightHeadlinePosts": *[
      ${homepageRightHeadlinePostFilter}
    ] | order(
      ${homepagePublishedPostOrder}
    )[0...10] {
      ${postFieldsHeroRightRail}
    }
  }
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
  readTime,
  cover{
    ${imageFieldsProjection}
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
  _id, title, "slug": slug.current, excerpt, readTime,
  cover{
    ${imageFieldsProjection}
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

/** Fourth-section Most Read fallback when metrics are unavailable. */
export const homepageFourthSectionMostReadFallbackQuery = `
*[
  _type == "post" &&
  status == "published" &&
  defined(publishedAt) && publishedAt <= now()
]{
  _id,
  title,
  "slug": slug.current,
  readTime,
  publishedAt,
  priority,
  featured,
  "category": select(
    defined(category->name) && defined(category->slug.current) => {
      "title": category->name,
      "slug": category->slug.current
    }
  ),
  "recencyBoost": select(publishedAt > dateTime(now()) - 60*60*24*14 => 1.5, 0),
  "editorialBoost": (coalesce(priority, 0) * 0.3) + select(featured == true => 0.4, 0)
} | order(
  (recencyBoost + editorialBoost) desc,
  publishedAt desc
)[0...5]
`;

export {
  articlesByCategoryEditorialQuery as postsByCategoryQuery,
  articlesByCategoryStandardPostsLimitedQuery as postsByCategoryStandardPostsLimitedQuery,
} from "./article-family-queries";

export const categorySlugsQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)]{ "slug": slug.current, name, views }
`);

export const categoriesByViewsQuery = defineQuery(`
  *[_type == "category" && defined(slug.current)] | order(coalesce(order, 999) asc, name asc) {
    "slug": slug.current,
    name,
    views,
    order
  }
`);

export const navTagsWithCategoryQuery = defineQuery(`
  *[
    _type == "tag" &&
    defined(slug.current) &&
    defined(category->slug.current) &&
    hidden != true &&
    deprecated != true
  ] | order(coalesce(order, 999) asc, title asc) {
    "slug": slug.current,
    title,
    "categorySlug": category->slug.current
  }
`);

/** Tags Glimpse: candidate tags for a category page section (caller fills up to four with articles). */
export const tagsByCategorySlugQuery = defineQuery(`
  *[
    _type == "tag" &&
    category->slug.current == $categorySlug &&
    defined(slug.current) &&
    hidden != true &&
    deprecated != true
  ] | order(coalesce(order, 999) asc, title asc) [0...$tagLimit] {
    "slug": slug.current,
    title
  }
`);

/** Tags Glimpse: latest post or analysis per tag (cover + gallery for featured column). */
export const latestArticleByTagGlimpseQuery = defineQuery(`
  *[
    _type in ["post", "analysis"] &&
    status == "published" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now() &&
    $tagSlug in tags[]->slug.current &&
    !(_id in $excludeIds)
  ] | order(${homepagePublishedPostOrder}) [0...1] {
    _type,
    ${postFieldsHighlightedStories}
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

export const authorSlugsQuery = defineQuery(`
  *[_type == "author" && defined(slug.current)][].slug.current
`);

/** Homepage second section: 1 featured + 1 secondary post per category column. */
export const fourthSectionQuery = defineQuery(`
  *[
    ${homepagePublishedPostFilter} &&
    category->slug.current == $categorySlug
  ] | order(${homepagePublishedPostOrder}) [0...2] {
    ${postFields}
  }
`);

/**
 * Homepage second section bundle: 1 featured + 1 secondary per category, for
 * the 3 hardcoded second-section slugs. Returns a shape that mirrors the
 * previous per-category call sites so the loader can group by input order.
 * Trims to lightweight projection (no body/tags/seo).
 */
export const homepageSecondSectionBundleQuery = defineQuery(`
  {
    "slug0Posts": *[
      ${homepagePublishedPostFilter} &&
      category->slug.current == $slug0
    ] | order(${homepagePublishedPostOrder}) [0...2] {
      ${postFieldsLightweight}
    },
    "slug1Posts": *[
      ${homepagePublishedPostFilter} &&
      category->slug.current == $slug1
    ] | order(${homepagePublishedPostOrder}) [0...2] {
      ${postFieldsLightweight}
    },
    "slug2Posts": *[
      ${homepagePublishedPostFilter} &&
      category->slug.current == $slug2
    ] | order(${homepagePublishedPostOrder}) [0...2] {
      ${postFieldsLightweight}
    }
  }
`);

/** Homepage fourth section: Tech rail (2 featured + 4 secondary; right column is Latest feed). */
export const homepageFourthSectionTechQuery = defineQuery(`
  *[
    ${homepagePublishedPostFilter} &&
    category->slug.current == $categorySlug
  ] | order(${homepagePublishedPostOrder}) [0...6] {
    ${postFieldsLightweight}
  }
`);

export const thirdLatestArticleQuery = defineQuery(`
  *[
    ${homepagePublishedPostFilter} &&
    category->slug.current == $categorySlug
  ] | order(${homepagePublishedPostOrder}) [2...3] {
    ${postFields}
  }
`);

/**
 * Homepage seventh section bundle: the "third latest" article per category
 * (offset [2...3]) for the 6 hardcoded featured-carousel slugs, in a single
 * request. Trims to lightweight projection.
 */
export const homepageSeventhSectionBundleQuery = defineQuery(`
  {
    "slug0Third": *[
      ${homepagePublishedPostFilter} &&
      category->slug.current == $slug0
    ] | order(${homepagePublishedPostOrder}) [2...3] {
      ${postFieldsLightweight}
    },
    "slug1Third": *[
      ${homepagePublishedPostFilter} &&
      category->slug.current == $slug1
    ] | order(${homepagePublishedPostOrder}) [2...3] {
      ${postFieldsLightweight}
    },
    "slug2Third": *[
      ${homepagePublishedPostFilter} &&
      category->slug.current == $slug2
    ] | order(${homepagePublishedPostOrder}) [2...3] {
      ${postFieldsLightweight}
    },
    "slug3Third": *[
      ${homepagePublishedPostFilter} &&
      category->slug.current == $slug3
    ] | order(${homepagePublishedPostOrder}) [2...3] {
      ${postFieldsLightweight}
    },
    "slug4Third": *[
      ${homepagePublishedPostFilter} &&
      category->slug.current == $slug4
    ] | order(${homepagePublishedPostOrder}) [2...3] {
      ${postFieldsLightweight}
    },
    "slug5Third": *[
      ${homepagePublishedPostFilter} &&
      category->slug.current == $slug5
    ] | order(${homepagePublishedPostOrder}) [2...3] {
      ${postFieldsLightweight}
    }
  }
`);

/** Homepage ThirdSection: latest editorial doc per tag (Congress, AI, White House, Markets). */
export const homepageThirdSectionByTagQuery = defineQuery(`
  *[
    ${homepagePublishedEditorialFilter} &&
    $tagSlug in tags[]->slug.current &&
    !(_id in $excludeIds)
  ] | order(${homepagePublishedPostOrder}) [0] {
    _id,
    _type,
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    readTime
  }
`);

/**
 * Homepage third section bundle: fetches a pool of recent editorial docs that
 * match ANY of the target tags in one request. The loader performs the
 * "first unused per tag, in tag order" dedup entirely in memory instead of
 * making follow-up fetches on collision.
 */
export const homepageThirdSectionBundleQuery = defineQuery(`
  *[
    ${homepagePublishedEditorialFilter} &&
    count(tags[@->slug.current in $tagSlugs]) > 0
  ] | order(${homepagePublishedPostOrder}) [0...$poolSize] {
    _id,
    _type,
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    readTime,
    "tagSlugs": tags[]->slug.current
  }
`);

/** Homepage SixthSection: latest featured post per category (1 per column). */
export const highlightedStoriesByCategoryQuery = defineQuery(`
  *[
    ${homepagePublishedPostFilter} &&
    category->slug.current == $categorySlug
  ] | order(${homepagePublishedPostOrder}) [0...1] {
    ${postFieldsHighlightedStories}
  }
`);

/**
 * Homepage sixth section bundle: latest featured post per category for the
 * 3 hardcoded highlighted-stories columns (left/center/right), in one request.
 */
export const homepageSixthSectionBundleQuery = defineQuery(`
  {
    "leftPost": *[
      ${homepagePublishedPostFilter} &&
      category->slug.current == $leftSlug
    ] | order(${homepagePublishedPostOrder}) [0] {
      ${postFieldsHighlightedStories}
    },
    "centerPost": *[
      ${homepagePublishedPostFilter} &&
      category->slug.current == $centerSlug
    ] | order(${homepagePublishedPostOrder}) [0] {
      ${postFieldsHighlightedStories}
    },
    "rightPost": *[
      ${homepagePublishedPostFilter} &&
      category->slug.current == $rightSlug
    ] | order(${homepagePublishedPostOrder}) [0] {
      ${postFieldsHighlightedStories}
    }
  }
`);

/**
 * Homepage fifth section bundle: left column (1 post) + right column (5 posts)
 * for the two hardcoded fifth-section categories, in one request.
 */
export const homepageFifthSectionBundleQuery = defineQuery(`
  {
    "leftPosts": *[
      _type == "post" &&
      status == "published" &&
      defined(publishedAt) && publishedAt <= now() &&
      defined(slug.current) &&
      category->slug.current == $leftSlug
    ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...$leftLimit] {
      ${articleFamilyListFragment}
    },
    "rightPosts": *[
      _type == "post" &&
      status == "published" &&
      defined(publishedAt) && publishedAt <= now() &&
      defined(slug.current) &&
      category->slug.current == $rightSlug
    ] | order(coalesce(publishedAt, _updatedAt) desc, _updatedAt desc) [0...$rightLimit] {
      ${articleFamilyListFragment}
    }
  }
`);

/** Fetch post cards by Sanity ids (homepage / sidebars; order preserved in application code). */
export const postsByIdsLightweightQuery = defineQuery(`
  *[_type == "post" && _id in $ids] {
    ${postFieldsLightweight}
  }
`);

export const newsTickerQuery = defineQuery(`
  *[
    ${homepagePublishedPostFilter} &&
    defined(tickerTitle)
  ] | order(${homepagePublishedPostOrder}) [0...6] {
    tickerTitle,
    "slug": slug.current
  }
`);

const categoryTickerQuery = defineQuery(`
  *[
    ${homepagePublishedPostFilter} &&
    category->slug.current == $categorySlug &&
    defined(tickerTitle)
  ] | order(${homepagePublishedPostOrder}) [0...4] {
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
  cover.caption match $term
)`;

/** score()/boost() only allow document-local match expressions (no coalesce, derefs, pt::text, count). */
const SEARCH_SCORE_PIPE = `
| score(
  boost(title match $term, 100),
  boost(tickerTitle match $term, 80),
  boost(excerpt match $term, 65),
  boost(cover.caption match $term, 55),
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

export const mainHeadlinesQuery = defineQuery(`
  *[
    ${homepageMainHeadlinePostFilter}
  ] | order(
    ${homepagePublishedPostOrder}
  ) [0...5] {
    _id,
    title,
    "slug": slug.current,
    cover{
      ${imageFieldsProjection}
    }
  }
`);
