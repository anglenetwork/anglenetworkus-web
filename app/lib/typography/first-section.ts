import { articleTitleLink } from "./article-links";

/** FirstSection — Just In lead story + More Top Headlines card titles (same size at all breakpoints) */
export const firstSectionFeaturedStoryTitle = `font-semibold font-sans text-xl text-neutral-900 leading-snug tracking-tight ${articleTitleLink}`;

/** FirstSection — More Top Headlines grid (md+, 2-up) */
export const moreTopHeadlinesGridTitle = `font-medium font-sans text-lg text-neutral-900 leading-snug tracking-tight ${articleTitleLink}`;

/** FirstSection — left rail: remaining Just In stories */
export const justInSecondaryTitle = `text-base font-sans font-semibold text-neutral-900 leading-snug tracking-tight ${articleTitleLink}`;

/** FirstSection — center: desktop main headline (lg+) */
export const mainHeadlineDesktopTitle = `text-6xl font-bold text-gray-900 !leading-tight tracking-tight text-center font-sans ${articleTitleLink}`;

/** FirstSection — center: mobile/tablet main headline (below lg) */
export const mainHeadlineMobileTitle = `text-2xl md:text-3xl lg:hidden font-bold text-gray-900 !leading-tight tracking-tight mb-4 font-sans text-start md:text-center ${articleTitleLink}`;

/** FirstSection — center: main story excerpt overlay on hero image */
export const mainStoryExcerpt =
  "line-clamp-4 font-sans text-base font-medium leading-relaxed tracking-normal text-white md:text-base";

/** FirstSection — center: More Top Headlines, mobile stacked rows */
export const moreTopHeadlinesMobileTitle = `min-w-0 flex-1 font-sans text-base font-semibold leading-snug tracking-tight text-neutral-900 ${articleTitleLink}`;

/** FirstSection — right rail: side story titles */
export const sideStoryTitle = `text-xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight ${articleTitleLink}`;

/** FirstSection — right rail: What Matters list item titles */
export const mostReadItemTitle = `text-neutral-900 leading-tight font-sans text-lg sm:text-base font-normal tracking-normal ${articleTitleLink}`;
