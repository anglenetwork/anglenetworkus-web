import { articleTitleLink } from "./article-links";

/** My profile — section header block (title + description) */
export const profileSectionHeader =
  "mb-8 border-red-600 border-l-8 bg-neutral-100 px-4 py-4 xl:mb-12 xl:px-5 xl:py-5";

/** My profile — section header title */
export const profileSectionTitle =
  "mb-2 font-sans font-semibold text-2xl text-slate-900 xl:text-3xl";

/** My profile — section header description */
export const profileSectionDescription =
  "font-sans text-slate-600 text-sm xl:text-base";

/** My profile — BookmarksList saved article title */
export const bookmarksListTitle = `mb-2 line-clamp-2 font-sans font-semibold text-lg text-slate-900 ${articleTitleLink}`;
