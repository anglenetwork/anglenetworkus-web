import { articleTitleLink } from "./article-links";

/** My profile — section header block (title + description) */
export const profileSectionHeader =
  "mb-8 border-red-500 border-l-4 bg-neutral-100 px-4 py-4 sm:mb-12 sm:px-5 sm:py-5";

/** My profile — section header title */
export const profileSectionTitle =
  "mb-2 font-sans font-semibold text-2xl text-slate-900 sm:text-3xl";

/** My profile — section header description */
export const profileSectionDescription =
  "font-sans text-slate-600 text-sm sm:text-base";

/** My profile — BookmarksList saved article title */
export const bookmarksListTitle = `mb-2 line-clamp-2 font-sans font-semibold text-base text-slate-900 sm:text-lg ${articleTitleLink}`;
