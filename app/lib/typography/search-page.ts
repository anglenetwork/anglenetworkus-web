import { articleTitleLink } from "./article-links";
import { modernSectionTitle } from "./section-header";

/** Search page — empty-state heading */
export const searchPageTitle = modernSectionTitle.light;

/** Search page — empty-state / helper copy */
export const searchPageIntro =
  "font-sans text-base text-news-muted leading-relaxed";

/** Search page — results count / status line */
export const searchResultsStatus =
  "font-sans text-base font-normal text-news-text leading-snug";

/** Search page — emphasized term in results status (search query) */
export const searchResultsStatusEmphasis = "font-semibold text-news-text";

/** Search page — desktop filter group labels (Type, Sort) */
export const searchFilterLabel =
  "font-bold font-sans text-sm uppercase tracking-normal text-news-text";

/** Search page — result type / category kicker (News, Opinion, etc.) */
const searchResultTypeLabel =
  "font-bold font-sans text-xs uppercase tracking-wider text-news-primary";

/** Search page — sponsored attribution on result cards */
export const searchResultSponsorLabel =
  "font-semibold font-sans text-xs text-amber-800";

/** Search page — result card title */
export const searchResultTitle = `mb-2 font-display text-sm font-semibold leading-snug tracking-normal text-news-text md:text-base ${articleTitleLink}`;

/** Search page — result excerpt (ArticleFamilyCard search variant) */
export const searchResultExcerpt =
  "search-result-excerpt mb-2 line-clamp-3 font-sans text-sm font-normal leading-relaxed tracking-normal text-news-text";

/** Search page — result author line */
export const searchResultAuthor =
  "mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-news-muted";

/** Search page — result date line */
export const searchResultDate =
  "mt-1 font-sans text-xs font-medium uppercase tracking-wide text-news-muted";

/** Search page — empty results message */
export const searchEmptyMessage = searchPageIntro;

/** Search page — pagination status */
export const searchPaginationLabel =
  "font-sans text-sm font-medium text-news-muted";

/** Search page — pagination buttons */
export const searchPaginationButton =
  "rounded-xl bg-transparent p-6 font-sans text-base font-semibold text-news-text";

/** Search page — mobile filter dialog title */
export const searchMobileDialogTitle =
  "flex-1 text-center font-bold font-sans text-2xl text-news-text leading-tight tracking-tight";

/** Search page — mobile filter radio labels */
export const searchMobileFilterOption =
  "cursor-pointer font-sans text-lg font-normal leading-snug tracking-normal text-news-text";

/** Search page — mobile filter radio labels (selected) */
export const searchMobileFilterOptionActive =
  "cursor-pointer font-sans text-lg font-semibold leading-snug tracking-normal text-news-primary";

/** Search page — error message */
export const searchErrorMessage =
  "mb-4 font-sans text-base font-medium text-news-primary";
