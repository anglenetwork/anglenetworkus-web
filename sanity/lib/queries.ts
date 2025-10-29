// /sanity/lib/queries.ts
import { defineQuery } from "next-sanity";

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
  epigraph,
  imageSource,
  coverImage,
  "date": coalesce(date, _updatedAt),
  publishedAt,
  priority,
  featured,

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

  "bodyImages": bodyImages[]{ "image": image, epigraph, imageSource },
  bodyTextOne,
  bodyTextTwo,
  bodyTextThree,
  bodyTextFour,
  bodyTextFive,
  bodyImageOne,
  bodyImageTwo,
  bodyImageThree,
  bodyImageFour,
  bodyImageFive
`;

/** ---------------------------
 *  Basic queries
 *  --------------------------- */
export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

export const heroQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
    ${postFields}
  }
`);

export const moreStoriesQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    ${postFields}
  }
`);

export const indexQuery = defineQuery(`
  *[_type == "post"] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

export const postQueryWithRelated = defineQuery(`
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    ${postFields}
  },
  "latestNews": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...6] {
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [4...8] {
    ${postFields}
  },
  "nextArticles": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [8...18] {
    ${postFields}
  }
}
`);

export const postQueryWithCategoryRelated = defineQuery(`
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    ${postFields}
  },
  "latestNews": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...6] {
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [4...8] {
    ${postFields}
  },
  "newsForYou": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...4] {
    ${postFields}
  },
  "categoryArticles": *[_type == "post" && slug.current != $slug && category->slug.current == $categorySlug] | order(date desc, _updatedAt desc) [0...6] {
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
  _id, title, "slug": slug.current, excerpt, coverImage, publishedAt
}
`;

// Popular reads (sitewide trending with real views + fallbacks)
export const popularReadsTrendingQuery = `
*[
  _type == "post" &&
  status == "published" &&
  defined(publishedAt) && publishedAt <= now() &&
  _id != $currentPostId
]{
  _id, title, "slug": slug.current, excerpt, coverImage, publishedAt,
  priority, featured,
  views7d, views30d, viewsAll,
  readTime,
  "recencyBoost": select(publishedAt > dateTime(now()) - 60*60*24*14 => 1.5, 0),
  "editorialBoost": (coalesce(priority, 0) * 0.3) + select(featured == true => 0.4, 0),
  "hasViews": coalesce(views7d, 0) > 0,
  "totalScore": coalesce(views7d, 0) + recencyBoost + editorialBoost
} | order(
  hasViews desc,
  coalesce(views7d, 0) desc,
  (recencyBoost + editorialBoost) desc,
  publishedAt desc
)[0...4]
`;

// Fallback query for when no posts have views yet
export const popularReadsFallbackQuery = `
*[
  _type == "post" &&
  status == "published" &&
  defined(publishedAt) && publishedAt <= now() &&
  _id != $currentPostId
]{
  _id, title, "slug": slug.current, excerpt, coverImage, publishedAt,
  priority, featured,
  "recencyBoost": select(publishedAt > dateTime(now()) - 60*60*24*14 => 1.5, 0),
  "editorialBoost": (coalesce(priority, 0) * 0.3) + select(featured == true => 0.4, 0)
} | order(
  (recencyBoost + editorialBoost) desc,
  publishedAt desc
)[0...4]
`;

export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields}
  }
`);

export const postsByCategoryQuery = defineQuery(`
  *[_type == "post" && category->slug.current == $categorySlug] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

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
  *[_type == "category" && defined(slug.current)] | order(coalesce(views, 0) desc, name asc) {
    "slug": slug.current,
    name,
    views
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

export const postsByTagQuery = defineQuery(`
  *[_type == "post" && $tagSlug in tags[]->slug.current] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

/** ---------------------------
 *  Authors / comments
 *  --------------------------- */
export const authorQuery = defineQuery(`
  *[_type == "author" && slug.current == $slug][0] {
    name,
    picture,
    "posts": *[_type == "post" && author->slug.current == $slug] | order(date desc, _updatedAt desc) {
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
  *[_type == "post" && category->slug.current == $categorySlug] | order(date desc, _updatedAt desc) [0...4] {
    ${postFields}
  }
`);

export const mostViewedQuery = defineQuery(`
  *[_type == "post" && category->slug.current == $categorySlug] | order(coalesce(views7d, 0) desc, publishedAt desc) [0...5] {
    ${postFields}
  }
`);

export const thirdLatestArticleQuery = defineQuery(`
  *[_type == "post" && category->slug.current == $categorySlug] | order(date desc, _updatedAt desc) [2...3] {
    ${postFields}
  }
`);

export const thirdSectionQuery = defineQuery(`
  *[_type == "post" && category->slug.current == $categorySlug] | order(date desc, _updatedAt desc) [0...4] {
    ${postFields}
  }
`);

export const mostReadQuery = defineQuery(`
  *[_type == "post"] | order(date desc, _updatedAt desc) [0...5] {
    ${postFields}
  }
`);

export const mostViewedPostsQuery = `
*[
  _type == "post" &&
  status == "published" &&
  defined(publishedAt) && publishedAt <= now()
]{
  _id, title, "slug": slug.current, excerpt, coverImage, publishedAt,
  priority, featured,
  views7d, views30d, viewsAll,
  "recencyBoost": select(publishedAt > dateTime(now()) - 60*60*24*14 => 1.5, 0),
  "editorialBoost": (coalesce(priority, 0) * 0.3) + select(featured == true => 0.4, 0),
  "hasViews": coalesce(views7d, 0) > 0,
  "totalScore": coalesce(views7d, 0) + recencyBoost + editorialBoost
} | order(
  hasViews desc,
  totalScore desc,
  publishedAt desc
)[0...5]
`;

export const sixthSectionQuery = defineQuery(`
  *[_type == "post" && category->slug.current == $categorySlug] | order(date desc, _updatedAt desc) [0...20] {
    ${postFields}
  }
`);

/** ---------------------------
 *  SEARCH (posts-only) with safe relevance
 *  --------------------------- */
const SEARCH_BASE = `_type == "post" && status == "published" && defined(publishedAt) && publishedAt <= now()`;
const SEARCH_FILTER = `(
  title match $term ||
  excerpt match $term ||
  epigraph match $term ||
  pt::text(bodyRich) match $term ||
  pt::text(bodyTextOne) match $term ||
  pt::text(bodyTextTwo) match $term ||
  pt::text(bodyTextThree) match $term ||
  pt::text(bodyTextFour) match $term ||
  pt::text(bodyTextFive) match $term ||
  category->name match $term ||
  coalesce(tags[]->title, tags[]->name) match $term ||   // <— supports both
  author->name match $term
)`;

const SEARCH_FIELDS = `
  _id, _type, title, slug, excerpt, coverImage, publishedAt, priority, featured, date,
  views7d, views30d, viewsAll,
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
  "tags": tags[]->{
    "title": coalesce(title, name),
    "slug": slug.current
  }
`;

export const searchPostsRelevanceQuery = `
*[
  ${SEARCH_BASE} && ${SEARCH_FILTER}
]{
  ${SEARCH_FIELDS}
} | order(
  coalesce(views7d, 0) desc,
  publishedAt desc
) [0...$limit]
`;

export const searchPostsNewestQuery = `
*[
  ${SEARCH_BASE} && ${SEARCH_FILTER}
]{
  ${SEARCH_FIELDS}
} | order(publishedAt desc) [0...$limit]
`;

/** ---------------------------
 *  Tag / Topic search (unchanged)
 *  --------------------------- */
export const searchTagsQuery = `
*[_type == "tag" && (
  title match $term ||
  description match $term ||
  $term in aliases
)] | order(order asc, title asc) [0...$limit] {
  _id,
  title,
  "slug": slug.current,
  description,
  emoji,
  color,
  featured,
  views
}
`;

export const searchTopicsQuery = `
*[_type == "topic" && (
  title match $term ||
  description match $term
)] | order(title asc) [0...$limit] {
  _id,
  title,
  "slug": slug.current,
  kind,
  description,
  image
}
`;

export const searchAllQuery = defineQuery(`
{
  "posts": *[${SEARCH_BASE} && ${SEARCH_FILTER}] | order(publishedAt desc) [0...$postLimit] {
    ${postFields}
  },
  "tags": *[_type == "tag" && (
    title match $term ||
    description match $term ||
    $term in aliases
  )] | order(order asc, title asc) [0...$tagLimit] {
    _id,
    title,
    "slug": slug.current,
    description,
    emoji,
    color,
    featured,
    views
  },
  "topics": *[_type == "topic" && (
    title match $term ||
    description match $term
  )] | order(title asc) [0...$topicLimit] {
    _id,
    title,
    "slug": slug.current,
    kind,
    description,
    image
  }
}
`);

export const eighthSectionQuery = defineQuery(`
  *[_type == "category" && slug.current in $categorySlugs] {
    "slug": slug.current,
    "name": name,
    "posts": *[_type == "post" && category->slug.current == slug.current] | order(date desc, _updatedAt desc) [0...3] {
      ${postFields}
    }
  }
`);

export const secondSectionQuery = defineQuery(`
  *[_type == "category" && slug.current in $categorySlugs] {
    "slug": slug.current,
    "name": name,
    "thirdMostViewed": *[_type == "post" && category->slug.current == slug.current] | order(coalesce(views7d, 0) desc, publishedAt desc) [0...5] {
      _id, title, "slug": slug.current, excerpt, coverImage, "date": coalesce(date, _updatedAt), publishedAt,
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
      views7d
    },
    "thirdLatest": *[_type == "post" && category->slug.current == slug.current] | order(publishedAt desc, _updatedAt desc) [0...5] {
      _id, title, "slug": slug.current, excerpt, coverImage, "date": coalesce(date, _updatedAt), publishedAt,
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
      views7d
    }
  }
`);
