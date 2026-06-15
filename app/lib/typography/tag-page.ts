import { articleTitleLink } from "./article-links";

export {
  formatReadTimeLabel,
  readTimeLabelClassName,
  tagReadTimeLabel,
} from "./read-time";

/** Tag page — TagFeaturedArticle lead title on image overlay */
export const tagFeaturedOverlayTitle =
  "line-clamp-4 font-sans text-xl font-semibold leading-snug tracking-tight text-white md:text-2xl xl:text-3xl";

/** Tag page — TagArticleItem row with thumbnail */
export const tagArticleRowTitle = `font-normal font-sans text-lg text-neutral-900 leading-normal tracking-normal ${articleTitleLink}`;

/** Tag page — TagTextNewsItem text-only row */
export const tagTextOnlyTitle = `font-normal font-sans text-base text-neutral-900 leading-normal tracking-normal ${articleTitleLink}`;

/** Tag page — TagNewsItem dark rail row */
export const tagDarkRailTitle = `font-normal font-sans text-base text-white leading-normal tracking-normal ${articleTitleLink}`;

/** Tag page — TagSidebar trending list */
const tagSidebarTrendingTitle = `line-clamp-2 font-medium text-gray-900 text-sm transition-colors group-hover:text-blue-600 ${articleTitleLink}`;

/** Tag page — TagPostsList card title */
const tagPostListTitle = `mb-2 font-semibold text-gray-900 text-xl transition-colors hover:text-blue-600 ${articleTitleLink}`;

/** Tag page — ShowMoreSection full-width row */
export const tagShowMoreTitle = `font-medium font-sans text-xl text-news-text leading-snug tracking-normal ${articleTitleLink}`;
