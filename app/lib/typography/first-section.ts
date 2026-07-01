import { homepageArticleTitleLink } from "./homepage-article-links";

/** FirstSection — Just In lead story + More Top Headlines card titles (same size at all breakpoints) */
export const firstSectionFeaturedStoryTitle = `font-medium font-display text-xl text-news-text leading-snug tracking-normal ${homepageArticleTitleLink}`;

/** FirstSection — More Top Headlines grid (md+, 2-up) */
export const moreTopHeadlinesGridTitle = `font-semibold font-display text-base text-news-text leading-snug tracking-normal ${homepageArticleTitleLink}`;

/** FirstSection — left rail: remaining Just In stories */
export const justInSecondaryTitle = `font-semibold font-display text-lg text-news-text leading-snug tracking-normal ${homepageArticleTitleLink}`;

/** FirstSection — Just In category label above story titles */
export const justInCategoryLabel =
  "mb-1.5 block font-sans text-[10.5px] font-bold uppercase tracking-[0.07em] text-news-primary";

/** FirstSection — center: desktop main headline (lg+) */
export const mainHeadlineDesktopTitle = `text-6xl font-bold text-news-text !leading-tight tracking-tight text-center font-display ${homepageArticleTitleLink}`;

/** FirstSection — center: mobile/tablet main headline (below lg) */
export const mainHeadlineMobileTitle = `text-2xl md:text-3xl lg:hidden font-bold text-news-text leading-snug tracking-normal mb-4 font-display text-start md:text-center ${homepageArticleTitleLink}`;

/** FirstSection — center: main story excerpt overlay on hero image */
export const mainStoryExcerpt =
  "line-clamp-4 font-sans text-base font-medium leading-snug tracking-normal text-white md:text-base";

/** FirstSection — center: More Top Headlines, mobile stacked rows */
export const moreTopHeadlinesMobileTitle = `min-w-0 flex-1 font-display text-base font-semibold leading-snug tracking-tight text-news-text ${homepageArticleTitleLink}`;

/** FirstSection — right rail: featured side story titles (big cards) */
export const sideStoryTitle = `font-medium font-display text-xl text-news-text leading-snug tracking-normal ${homepageArticleTitleLink}`;

/** FirstSection — right rail: compact side story titles (image left, title right) */
export const sideStoryCompactTitle = `min-w-0 flex-1 font-semibold font-display text-base text-news-text leading-snug tracking-normal ${homepageArticleTitleLink}`;

/** FirstSection — right rail: What Matters list item titles */
const mostReadItemTitle = `text-news-text leading-tight font-display text-lg sm:text-base font-semibold tracking-normal ${homepageArticleTitleLink}`;
