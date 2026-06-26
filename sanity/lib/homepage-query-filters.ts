/**
 * Shared GROQ filters for homepage post queries.
 * Aligns with seed articles: status published, slug set, publishedAt in the past.
 */

export const homepagePublishedPostFilter = `
  _type == "post" &&
  status == "published" &&
  defined(slug.current) &&
  defined(publishedAt) &&
  publishedAt <= now()
`;

/** Posts, analysis, and opinion — used when a homepage slot may fall back across editorial types. */
export const homepagePublishedEditorialFilter = `
  _type in ["post", "analysis", "opinion"] &&
  status == "published" &&
  defined(slug.current) &&
  defined(publishedAt) &&
  publishedAt <= now()
`;

export const homepagePublishedPostOrder = `
  dateTime(publishedAt) desc,
  dateTime(_updatedAt) desc
`;

/** Homepage Just In rail — only posts explicitly flagged in Studio. */
export const homepageJustInPostFilter = `
  ${homepagePublishedPostFilter} &&
  justIn == true
`;

/** Homepage frontline / More Top Headlines — only posts explicitly flagged in Studio. */
export const homepageFrontlinePostFilter = `
  ${homepagePublishedPostFilter} &&
  frontline == true
`;

/** Homepage right rail — only posts explicitly flagged in Studio. */
export const homepageRightHeadlinePostFilter = `
  ${homepagePublishedPostFilter} &&
  rightHeadline == true
`;

/** Homepage main headline — only posts explicitly flagged in Studio. */
export const homepageMainHeadlinePostFilter = `
  ${homepagePublishedPostFilter} &&
  mainHeadline == true
`;
