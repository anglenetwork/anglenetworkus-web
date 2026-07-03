import { homepageArticleTitleLink } from "./homepage-article-links";

/** Category page — Latest Articles list item title */
export const categoryLatestArticleTitle = `font-medium font-display text-xl text-news-text leading-snug tracking-normal ${homepageArticleTitleLink}`;

/** More in [Category] — section heading */
export const moreInCategoryHeading =
  "font-bold font-display text-[22px] text-news-text tracking-tight";

/** More in [Category] — top row + region article headline */
export const moreInCategoryTopHeadline = `font-semibold font-display text-[19px] text-news-text leading-[1.28] tracking-tight ${homepageArticleTitleLink}`;
export const moreInCategoryRegionHeadline = moreInCategoryTopHeadline;

/** More in [Category] — read time meta */
export const moreInCategoryMeta =
  "font-sans text-[11px] text-news-muted uppercase tracking-wide";

/** More in [Category] — region column label */
export const moreInCategoryRegionLabel =
  "font-bold font-sans text-xs text-news-text uppercase tracking-wide";

/** More in [Category] — region "More" link */
export const moreInCategoryRegionMore =
  "font-semibold font-sans text-[13px] text-news-muted transition-colors group-hover/more:text-news-text";

/** More in [Category] — region photo credit */
export const moreInCategoryCredit =
  "mt-2.5 font-sans text-[10.5px] text-news-muted tracking-wide";
