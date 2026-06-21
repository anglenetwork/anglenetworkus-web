import { articleTitleLink } from "./article-links";
import { homepageArticleTitleLink } from "./homepage-article-links";

/** NewsHeadlineRow — compact headline in a bordered multi-column row */
export const headlineRowTitle = {
  news: `font-bold font-sans text-base text-news-text leading-snug tracking-normal ${homepageArticleTitleLink}`,
  light: `font-bold font-sans text-base text-neutral-900 leading-snug tracking-normal ${articleTitleLink}`,
} as const;
