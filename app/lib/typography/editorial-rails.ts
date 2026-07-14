import { homepageArticleTitleLink } from "./homepage-article-links";

/** Featured opinion lead — red quote + OPINION kicker row */
export const editorialFeaturedKicker =
  "font-sans text-xs font-bold uppercase tracking-[0.12em] text-news-primary";

/** Featured opinion lead — decorative opening quote */
export const editorialFeaturedQuote =
  "font-display text-2xl font-bold leading-none text-news-primary";

/** Featured opinion lead — large impact headline */
export const editorialFeaturedHeadline = `max-w-3xl font-display text-3xl font-bold leading-[1.12] tracking-[-0.02em] text-news-text md:text-4xl ${homepageArticleTitleLink}`;

/** Featured opinion lead — summary under the headline */
export const editorialFeaturedExcerpt =
  "max-w-2xl font-sans text-base leading-relaxed text-news-muted md:text-[17px]";

/** Featured opinion lead — monospace byline */
export const editorialFeaturedByline =
  "font-mono text-xs tracking-[0.02em] text-news-text";

/** Compact rail card — category kicker */
export const editorialRailKicker =
  "font-sans text-xs font-semibold uppercase tracking-wide text-news-primary";

/** Compact rail card — title */
export const editorialRailTitle = `font-display text-base font-semibold leading-snug tracking-normal text-news-text ${homepageArticleTitleLink}`;

/** Compact rail card — byline */
export const editorialRailByline = "font-sans text-xs text-news-muted";
