import { articleTitleLink, sectionHeaderLink } from "./article-links";

/** Linked category label in ThirdSection (`SectionHeader` → `/category/[slug]`) */
export const sectionCategoryHeaderLink = sectionHeaderLink;

/** ThirdSection — left column: main featured story title */
export const leftColumnFeaturedTitle = `text-xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight ${articleTitleLink}`;

/** ThirdSection — left column: secondary grid card titles */
export const leftColumnSecondaryTitle = `text-xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight ${articleTitleLink}`;

/** ThirdSection — right column: featured image card titles */
export const rightColumnFeaturedTitle = `text-xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight ${articleTitleLink}`;

/** ThirdSection — right column: headline link list titles */
export const rightColumnHeadlineLinkTitle = `text-sm md:text-lg font-sans font-normal leading-snug tracking-normal flex-1 min-w-0 pt-0.5 ${articleTitleLink}`;
