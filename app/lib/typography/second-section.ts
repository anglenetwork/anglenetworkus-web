import { articleTitleLink } from "./article-links";

/** SecondSection — category column: lead story title */
export const categoryFeaturedTitle = {
  light: `font-semibold font-sans text-xl text-neutral-900 leading-snug tracking-tight md:text-xl ${articleTitleLink}`,
  dark: `font-semibold font-sans text-xl leading-snug tracking-tight text-white md:text-2xl ${articleTitleLink}`,
} as const;

/** SecondSection — category column: secondary row story title */
export const categorySecondaryRowTitle = {
  light: `font-semibold font-sans text-base text-neutral-900 leading-snug tracking-normal ${articleTitleLink}`,
  dark: `font-semibold font-sans text-base leading-snug tracking-normal text-white ${articleTitleLink}`,
} as const;

/** SecondSection — EXCLUSIVE badge (when applicable) */
export const categoryExclusiveBadge =
  "inline-block bg-blue-600 px-1.5 py-0.5 font-bold font-sans text-[10px] text-white uppercase tracking-wide";
