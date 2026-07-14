import { homepageArticleTitleLink } from "./homepage-article-links";
import {
  categoryExclusiveBadge,
  categoryFeaturedTitle,
  categorySecondaryRowTitle,
} from "./second-section";

/** Homepage Tech module — hover: headline fades to ink-soft. */
const angleTitleHover = "transition-colors group-hover:text-angle-inkSoft";

/** Tech section category label (e.g. TECH) with red dot prefix. */
export const techCategoryLabel =
  "mb-7 flex items-center gap-2 font-sans text-[13px] font-bold uppercase tracking-[0.12em] text-angle-ink before:size-[7px] before:shrink-0 before:rounded-full before:bg-angle-red before:content-['']";

/** Tech column lead story headline. */
export const techMainHeadline = `mt-5 mb-3 max-w-[96%] font-display text-2xl font-semibold leading-[1.26] tracking-[-0.3px] text-angle-ink max-[720px]:text-[21px] ${angleTitleHover}`;

/** Tech column lead story read time. */
export const techMainMeta = "font-mono text-xs text-angle-inkSoft";

/** Tech column secondary row headline. */
export const techSubHeadline = `font-display text-[17px] font-semibold leading-[1.28] tracking-[-0.2px] text-angle-ink ${angleTitleHover}`;

/** Most Read panel title with red dot. */
export const mostReadTitle =
  "mb-[26px] flex items-center gap-2.5 font-sans text-[26px] font-bold tracking-[-0.4px] text-inherit before:size-2 before:shrink-0 before:rounded-full before:bg-angle-red before:content-[''] max-[520px]:text-[22px]";

/** Most Read item headline — responsive dark/light panel. */
export const mostReadHeadline = `font-display text-[17px] font-semibold leading-[1.32] tracking-[-0.2px] text-angle-bg transition-colors group-hover:text-angle-bg/65 max-[1100px]:text-angle-ink max-[1100px]:group-hover:text-angle-inkSoft`;

/** Most Read item read time — responsive dark/light panel. */
export const mostReadMeta =
  "mt-2.5 font-mono text-[11px] text-angle-bg/55 max-[1100px]:text-angle-inkSoft";

/** Most Read item headline — dark panel (desktop). */
export const mostReadHeadlineDark = mostReadHeadline;

/** Most Read item headline — light panel (tablet/mobile). */
export const mostReadHeadlineLight = mostReadHeadline;

/** Most Read item read time — dark panel. */
export const mostReadMetaDark = mostReadMeta;

/** Most Read item read time — light panel. */
export const mostReadMetaLight = mostReadMeta;

/** @deprecated Legacy FourthSection tokens — kept for featured-story-column. */
export const techSecondaryTitle = categorySecondaryRowTitle.news;
export const techExclusiveBadge = categoryExclusiveBadge;

/** FourthSection — Most Read feed “See all” link */
export const mostReadFeedSeeAllLink =
  "font-bold font-sans text-base text-news-text leading-none tracking-normal";

/** @deprecated Use mostReadHeadlineDark / mostReadHeadlineLight instead. */
export const mostReadFeedHeadline = `font-semibold font-display text-lg text-news-text leading-snug tracking-normal md:text-base ${homepageArticleTitleLink}`;
