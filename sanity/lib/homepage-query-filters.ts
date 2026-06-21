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

/** Prefer editorial flag matches, then fall back to latest published posts. */
export const homepageJustInOrder = `
  select(justIn == true => 1, 0) desc,
  ${homepagePublishedPostOrder}
`;

export const homepageMainHeadlineOrder = `
  select(mainHeadline == true => 1, 0) desc,
  ${homepagePublishedPostOrder}
`;

export const homepageFrontlineOrder = `
  select(frontline == true => 1, 0) desc,
  ${homepagePublishedPostOrder}
`;

export const homepageRightHeadlineOrder = `
  select(rightHeadline == true => 1, 0) desc,
  ${homepagePublishedPostOrder}
`;
