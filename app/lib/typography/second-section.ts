import { articleTitleLink } from "./article-links";
import { homepageArticleTitleLink } from "./homepage-article-links";

/** Homepage "More Sections" — hover: headline fades to ink-soft. */
const angleTitleHover = "transition-colors group-hover:text-angle-inkSoft";

/** "More Sections" section heading with horizontal rule. */
export const moreSectionsHeading =
  "font-sans text-[22px] font-bold tracking-[-0.3px] text-angle-ink";

/** Category column label (e.g. TECH) with red dot prefix. */
export const secCategoryLabel =
  "mb-[22px] flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.12em] text-angle-ink before:size-[7px] before:shrink-0 before:rounded-full before:bg-angle-red before:content-['']";

/** Lead story headline inside a category column. */
export const secMainHeadline = `mt-4 font-display text-[21px] font-semibold leading-[1.28] tracking-[-0.3px] text-angle-ink ${angleTitleHover}`;

/** Secondary row headline beneath the dashed divider. */
export const secSubHeadline = `font-display text-base font-semibold leading-[1.3] tracking-[-0.2px] text-angle-ink ${angleTitleHover}`;

/** Photo credit line under the lead image. */
export const secPhotoCredit =
  "mt-2.5 font-mono text-[10.5px] tracking-[0.02em] text-angle-inkSoft";

/** SecondSection — category column: lead story title */
export const categoryFeaturedTitle = {
  light: `font-semibold font-display text-xl text-news-text leading-snug tracking-tight md:text-xl ${articleTitleLink}`,
  news: `font-medium font-display text-xl text-news-text leading-snug tracking-normal  ${homepageArticleTitleLink}`,
  dark: `font-semibold font-display text-xl leading-snug tracking-tight text-white md:text-2xl ${articleTitleLink}`,
} as const;

/** SecondSection — category column: secondary row story title */
export const categorySecondaryRowTitle = {
  light: `font-semibold font-display text-base text-news-text leading-snug tracking-normal ${articleTitleLink}`,
  news: `font-semibold font-display text-base text-news-text leading-snug tracking-normal  ${homepageArticleTitleLink}`,
  dark: `font-semibold font-display text-base leading-snug tracking-normal text-white ${articleTitleLink}`,
} as const;

/** SecondSection — EXCLUSIVE badge (when applicable) */
export const categoryExclusiveBadge =
  "inline-block bg-news-primary px-1.5 py-0.5 font-bold font-sans text-[10px] text-white uppercase tracking-wide";

/** Category hero — dek/excerpt beneath the featured headline */
export const categoryFeaturedDek =
  "mt-4 max-w-2xl font-sans text-base text-news-muted leading-relaxed";

/** Category hero — main hero headline (24px base, 28px sm/tablet, 38px at xl+) */
export const categoryHeroHeadline = `font-semibold font-display text-news-text text-[24px] leading-[1.14] tracking-[-0.5px] sm:text-[28px] xl:text-[38px] ${homepageArticleTitleLink}`;

/** Category hero — main hero read time (12px base, 16px sm+) */
export const categoryHeroReadTime =
  "mt-3 font-sans text-news-muted text-xs uppercase tracking-wide sm:mt-4";

/** Category hero — side list "feature" item (first side article): stacked headline + read time */
export const categoryFeatureHeadline = `font-semibold font-display text-news-text text-[23px] leading-[1.26] tracking-[-0.3px] ${homepageArticleTitleLink}`;
export const categoryFeatureReadTime =
  "mt-3 font-sans text-news-muted text-[11px] uppercase tracking-wide";

/** Category hero — side list "mini" items: title + read time */
export const categoryTextItemTitle = `font-bold font-display text-[17px] text-news-text leading-[1.28] tracking-[-0.2px] ${homepageArticleTitleLink}`;
export const categoryTextItemReadTime =
  "mt-2.5 font-sans font-normal text-[11px] text-news-muted uppercase";
