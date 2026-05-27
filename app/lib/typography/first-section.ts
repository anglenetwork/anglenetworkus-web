import { articleTitleLink } from "./article-links";

/** FirstSection — left rail: first Just In story */
export const justInPrimaryTitle = `text-xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight ${articleTitleLink}`;

/** FirstSection — left rail: remaining Just In stories */
export const justInSecondaryTitle = `text-base font-sans font-normal text-neutral-900 leading-normal tracking-normal ${articleTitleLink}`;

/** FirstSection — center: desktop main headline (lg+) */
export const mainHeadlineDesktopTitle = `text-6xl font-bold text-gray-900 !leading-tight tracking-tight text-center font-sans ${articleTitleLink}`;

/** FirstSection — center: mobile/tablet main headline (below lg) */
export const mainHeadlineMobileTitle = `text-2xl md:text-3xl lg:hidden font-bold text-gray-900 !leading-tight tracking-tight mb-4 font-sans text-start md:text-center ${articleTitleLink}`;

/** FirstSection — center: main story excerpt overlay on hero image */
export const mainStoryExcerpt =
  "line-clamp-4 font-sans text-base font-medium leading-relaxed text-white md:text-lg";

/** FirstSection — center: More Top Headlines, mobile stacked rows */
export const moreTopHeadlinesMobileTitle = `min-w-0 flex-1 font-sans text-base font-semibold leading-snug tracking-tight text-neutral-900 group-hover:text-red-600 ${articleTitleLink}`;

/** FirstSection — center: More Top Headlines, md+ grid and third story */
export const moreTopHeadlinesGridTitle = `font-sans text-xl font-semibold leading-snug tracking-tight text-neutral-900 ${articleTitleLink}`;

/** FirstSection — right rail: side story titles */
export const sideStoryTitle = `text-xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight ${articleTitleLink}`;

/** FirstSection — right rail: What Matters rank number */
export const mostReadRankNumber =
  "text-lg font-bold text-blue-600 flex-shrink-0 font-sans";

/** FirstSection — right rail: What Matters list item titles */
export const mostReadItemTitle = `text-neutral-900 leading-tight font-sans text-lg sm:text-base font-normal tracking-normal ${articleTitleLink}`;
