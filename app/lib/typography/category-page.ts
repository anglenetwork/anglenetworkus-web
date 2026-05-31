import { articleTitleLink } from "./article-links";

/** Category page — FeatureHero lead story title (add light/dark text color in component) */
export const categoryFeatureHeroTitle = `font-sans font-semibold text-2xl md:text-3xl lg:text-3xl text-start leading-snug tracking-tight ${articleTitleLink}`;

/** Category page — FeatureSideItem mobile + desktop row title (add variant text color in component) */
export const categoryFeatureSideTitle = `font-normal font-sans text-lg leading-normal tracking-wide sm:text-base ${articleTitleLink}`;

/** Category page — FeatureSideItem desktop card title */
export const categoryFeatureSideDesktopTitle = `font-normal font-sans text-lg mb-2 leading-snug tracking-normal ${articleTitleLink}`;

/** Category page — LatestArticlesSection title link */
export const categoryLatestStoryLink = articleTitleLink;

/** Category page — MostReadItem title link (wraps text inside h3) */
export const categoryMostReadStoryLink = articleTitleLink;
