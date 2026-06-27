import { homepageArticleTitleLink } from "./homepage-article-links";
import {
  categoryExclusiveBadge,
  categoryFeaturedTitle,
  categorySecondaryRowTitle,
} from "./second-section";

/** FourthSection — lead story per column; smaller at xl when shown 3-up */
const techFeaturedTitle = `${categoryFeaturedTitle.news} xl:text-xl xl:leading-snug`;
export const techSecondaryTitle = categorySecondaryRowTitle.news;
export const techExclusiveBadge = categoryExclusiveBadge;

/** FourthSection — Most Read feed header title */
export const mostReadFeedTitle =
  "font-bold font-sans text-3xl text-news-text leading-tight tracking-tight md:text-2xl";

/** FourthSection — Most Read feed “See all” link */
export const mostReadFeedSeeAllLink =
  "font-bold font-sans text-base text-news-text leading-none tracking-normal";

/** FourthSection — Most Read feed item headline */
export const mostReadFeedHeadline = `font-semibold font-sans text-lg text-news-text leading-snug tracking-normal md:text-base ${homepageArticleTitleLink}`;
