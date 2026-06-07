/**
 * Homepage third section: latest post per editorial tag.
 * Slugs must match `scripts/seed-tags.mjs` (`slugify(title)`).
 */
export const HOMEPAGE_THIRD_SECTION_TAGS = [
  { slug: "congress", title: "Congress" },
  { slug: "artificial-intelligence", title: "Artificial Intelligence" },
  { slug: "white-house", title: "White House" },
  { slug: "china", title: "China" },
] as const;

export type HomepageThirdSectionTag =
  (typeof HOMEPAGE_THIRD_SECTION_TAGS)[number];

export type HomepageThirdSectionArticle = {
  tagSlug: HomepageThirdSectionTag["slug"];
  tagTitle: HomepageThirdSectionTag["title"];
  _id: string;
  title: string;
  slug: string;
  readTime?: number | null;
};
