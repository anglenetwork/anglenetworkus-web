import { articleTitleLink } from "./article-links";

/** Post page — Popular Reads / News for You section heading */
const postSidebarSectionTitle =
  "mb-6 font-bold font-display text-foreground text-2xl";

/** Post page — Popular Reads / News for You list item title */
export const postSidebarListTitle = `font-medium font-display text-base text-news-text leading-6 tracking-normal ${articleTitleLink}`;

/** Post page — BottomArticleModule classic hero title */
export const postRelatedClassicHeroTitle = `mt-4 text-start font-display font-semibold text-2xl text-news-text leading-snug tracking-tight md:text-3xl ${articleTitleLink}`;

/** Post page — BottomArticleModule classic list item title */
export const postRelatedClassicListTitle = `mb-2 font-semibold font-display text-lg text-news-text leading-normal tracking-normal ${articleTitleLink}`;

/** Post page — BottomArticleModule modern section title ("More in World") */
export const postRelatedModernSectionTitle =
  "font-display text-[27px] font-bold leading-tight text-news-text";

/** Post page — BottomArticleModule modern "View all" link */
export const postRelatedModernViewAllLink =
  "font-display text-[13.5px] font-semibold text-news-primary transition-colors hover:text-news-primary-hover";

/** Post page — BottomArticleModule modern grid card category kicker */
export const postRelatedModernCardCategory =
  "font-display text-[11.5px] font-bold uppercase tracking-[0.06em] text-news-primary";

/** Post page — BottomArticleModule modern grid card title */
export const postRelatedModernCardTitle = `mt-0 break-words font-display text-[16.5px] font-semibold leading-[1.32] text-news-text ${articleTitleLink} group-hover:text-news-primary-hover`;

/** Post page — BottomArticleModule modern grid card read time */
export const postRelatedModernCardReadTime =
  "font-sans text-xs font-medium text-news-muted";

/** Post page — BottomArticleModule modern Top Stories rail eyebrow */
export const postRelatedModernRailEyebrow =
  "font-display text-[12.5px] font-bold uppercase tracking-[0.07em] text-news-primary";

/** Post page — BottomArticleModule modern rail date */
export const postRelatedModernRailDate =
  "font-display text-[11.5px] font-bold uppercase tracking-[0.05em] text-news-primary";

/** Post page — BottomArticleModule modern sidebar item title */
export const postRelatedModernSideTitle = `break-words font-display text-[15px] font-semibold leading-[1.38] text-news-text ${articleTitleLink} group-hover:text-news-primary-hover`;
