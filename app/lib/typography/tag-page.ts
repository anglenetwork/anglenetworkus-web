import { articleTitleLink } from "./article-links";
import { homepageArticleTitleLink } from "./homepage-article-links";

/** Tag page header — main title */
export const tagPageTitle =
  "font-bold font-display text-[38px] text-news-text leading-[0.9] tracking-[-2px] sm:text-[52px] xl:text-[72px]";

/** Tag page header — date meta */
export const tagPageDateMeta =
  "font-mono text-xs text-news-muted tracking-wide";

/** Tag page — sidebar mini item headline (02–05) */
export const tagSidebarMiniHeadline = `font-semibold font-display text-[17px] text-news-text leading-[1.28] tracking-[-0.2px] ${homepageArticleTitleLink}`;

/** Tag page — sidebar mini read time */
export const tagSidebarMiniReadTime =
  "mt-2.5 font-mono text-[11px] text-news-muted uppercase";

/** Tag page — sidebar feature read time (01) */
export const tagSidebarFeatureReadTime =
  "mt-3 font-mono text-[11px] text-news-muted uppercase";

/** Tag page — sidebar item number */
export const tagSidebarItemNumber =
  "font-mono font-bold text-sm text-news-primary";

/** Tag page — ICYMI section heading */
export const tagIcymiHeading =
  "font-bold font-display text-[22px] text-news-text tracking-[-0.3px]";

/** Tag page — ICYMI column headline */
export const tagIcymiHeadline = `font-semibold font-display text-[18px] text-news-text leading-[1.28] tracking-[-0.2px] ${homepageArticleTitleLink}`;

/** Tag page — ICYMI photo credit */
export const tagIcymiCredit =
  "mt-2.5 font-mono text-[10.5px] text-news-muted tracking-wide";

/** Tag page — ICYMI read time */
export const tagIcymiReadTime =
  "font-mono text-[11px] text-news-muted uppercase";

/** Tag page — ICYMI item number */
export const tagIcymiItemNumber =
  "mb-4 block font-mono font-bold text-xs text-news-primary";

/** Tag page — ShowMoreSection full-width row */
export const tagShowMoreTitle = `font-medium font-display text-xl text-news-text leading-snug tracking-normal ${articleTitleLink}`;

/** Tag page — ICYMI square image frame (full column width, matches More in category). */
export const tagIcymiImageFrame =
  "relative aspect-square w-full min-w-0 overflow-hidden bg-news-secondary";

export const TAG_ICYMI_IMAGE_SIZES = "(max-width: 1023px) 80px, 25vw";
export const TAG_ICYMI_DESKTOP_IMAGE_SIZE = 400;
export const TAG_ICYMI_MOBILE_IMAGE_SIZE = 80;

/** Tag page — fixed square thumbnail (latest list rows). */
export const tagLatestRowImageFrame =
  "relative size-24 shrink-0 overflow-hidden bg-news-secondary";
