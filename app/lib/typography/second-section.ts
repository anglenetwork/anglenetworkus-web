import { articleTitleLink } from "./article-links";

/** SecondSection — category column: lead story title */
export const categoryFeaturedTitle = {
  light: `text-xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight ${articleTitleLink}`,
  dark: `text-lg md:text-xl font-sans font-semibold leading-snug tracking-normal text-white ${articleTitleLink}`,
} as const;

/** SecondSection — category column: secondary row story title */
export const categorySecondaryRowTitle = {
  light: `flex-1 min-w-0 text-base font-sans font-normal leading-snug text-neutral-900 ${articleTitleLink}`,
  dark: `flex-1 min-w-0 text-base font-sans font-normal leading-snug text-white ${articleTitleLink}`,
} as const;
