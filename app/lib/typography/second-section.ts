import { articleTitleLink } from "./article-links";
import { homepageArticleTitleLink } from "./homepage-article-links";

/** SecondSection — category column: lead story title */
export const categoryFeaturedTitle = {
  light: `font-semibold font-display text-xl text-neutral-900 leading-snug tracking-tight md:text-xl ${articleTitleLink}`,
  news: `font-medium font-display text-xl text-news-text leading-snug tracking-normal  ${homepageArticleTitleLink}`,
  dark: `font-semibold font-display text-xl leading-snug tracking-tight text-white md:text-2xl ${articleTitleLink}`,
} as const;

/** SecondSection — category column: secondary row story title */
export const categorySecondaryRowTitle = {
  light: `font-semibold font-display text-base text-neutral-900 leading-snug tracking-normal ${articleTitleLink}`,
  news: `font-semibold font-display text-base text-news-text leading-snug tracking-normal  ${homepageArticleTitleLink}`,
  dark: `font-semibold font-display text-base leading-snug tracking-normal text-white ${articleTitleLink}`,
} as const;

/** SecondSection — EXCLUSIVE badge (when applicable) */
export const categoryExclusiveBadge =
  "inline-block bg-news-primary px-1.5 py-0.5 font-bold font-sans text-[10px] text-white uppercase tracking-wide";

/** Category hero — dek/excerpt beneath the featured headline */
export const categoryFeaturedDek =
  "mt-4 max-w-2xl font-sans text-base text-news-muted leading-relaxed";

/** Category hero — "Also in {category}" text-only side list: kicker + title */
export const categoryTextItemKicker =
  "mb-2 block font-sans font-semibold text-[11px] text-news-primary uppercase tracking-wide";
export const categoryTextItemTitle = `font-semibold font-display text-lg text-news-text leading-snug tracking-normal ${homepageArticleTitleLink}`;
