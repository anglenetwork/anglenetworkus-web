import { articleTitleLink } from "./article-links";
import {
  categoryExclusiveBadge,
  categoryFeaturedTitle,
  categorySecondaryRowTitle,
} from "./second-section";

/** FourthSection — lead story per column; smaller at xl when shown 3-up */
export const techFeaturedTitle = `${categoryFeaturedTitle.light} xl:text-xl xl:leading-snug`;
export const techSecondaryTitle = categorySecondaryRowTitle.light;
export const techExclusiveBadge = categoryExclusiveBadge;

/** FourthSection — Most Read feed header title */
export const mostReadFeedTitle =
  "font-bold font-sans text-3xl text-neutral-900 leading-tight tracking-tight md:text-2xl";

/** FourthSection — Most Read feed “See all” link */
export const mostReadFeedSeeAllLink =
  "font-bold font-sans text-base text-neutral-900 leading-none tracking-normal";

/** FourthSection — Most Read feed item headline */
export const mostReadFeedHeadline = `font-semibold font-sans text-base text-neutral-900 leading-snug tracking-tight md:text-lg ${articleTitleLink}`;
