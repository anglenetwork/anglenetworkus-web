import { articleTitleLink } from "./article-links";

// ### Standard post page — redesigned editorial layout
// Scoped exclusively to the `post` document type (see article-family-post-layout.tsx).
// Kept separate from `posts.ts` / `post-page.ts` so the shared `sponsored` layout is untouched.

/** Header — category kicker (dot + uppercase label) */
export const postArticleKicker =
  "font-display text-xs font-bold uppercase tracking-[0.08em] text-red-600";

/** Header — h1 headline */
export const postArticleTitle =
  "font-display text-3xl font-bold leading-[1.1] tracking-tight text-neutral-900 sm:text-4xl md:text-[46px] md:leading-[1.08]";

/** Header — italic serif dek */
export const postArticleDek =
  "font-body text-lg italic leading-relaxed text-neutral-700 md:text-xl";

/** Body — paragraph copy (drop cap applied via wrapper selector, see PostBody/index.tsx) */
export const postArticleBodyParagraph =
  "font-body text-lg leading-[1.75] text-neutral-900 md:text-xl";

/** Body — in-article h2 */
export const postArticleBodyH2 =
  "font-display text-xl font-bold leading-snug text-neutral-900 md:text-[25px]";

/** Body — in-article h3 */
export const postArticleBodyH3 =
  "font-display text-lg font-bold leading-snug text-neutral-900 md:text-xl";

/** Body — in-article h4 */
export const postArticleBodyH4 =
  "font-display text-base font-semibold leading-snug text-neutral-900 md:text-lg";

/** Body — pull quote / blockquote */
export const postArticleQuote =
  "font-body text-2xl italic font-medium leading-snug text-neutral-900 md:text-[28px]";

/** Body — pull quote attribution (cite) */
export const postArticleQuoteAttribution =
  "font-display text-[13px] font-semibold not-italic tracking-wide text-neutral-500";

/** Body — bullet / numbered lists */
export const postArticleBodyBulletList = "font-body text-neutral-900";
export const postArticleBodyNumberedList = "font-body text-neutral-900";

/** Tags row — outline pill */
export const postTagPill =
  "font-display text-[12.5px] font-semibold text-neutral-700 border border-neutral-300 rounded-full px-4 py-[7px] transition-colors hover:border-neutral-900 hover:text-neutral-900";

/** Author card */
export const postAuthorCardName = "font-display text-[15px] font-bold text-neutral-900";
export const postAuthorCardBio =
  "font-sans text-[13.5px] leading-relaxed text-neutral-500";

/** Sidebar — eyebrow (Popular Reads / News for You) */
export const postSidebarEyebrow =
  "font-display text-[12.5px] font-bold uppercase tracking-[0.07em] text-neutral-900";

/** Sidebar — ranked list item title (Popular Reads) */
export const postSidebarRankedTitle = `font-display text-[15px] font-semibold leading-[1.32] text-neutral-900 ${articleTitleLink}`;

/** Sidebar — thumbnail list item title (News for You) */
export const postSidebarThumbTitle = `font-display text-[15px] font-semibold leading-[1.32] text-neutral-900 ${articleTitleLink}`;

/** Sidebar — read time label */
export const postSidebarReadTime =
  "font-sans text-xs font-medium text-neutral-400";

/** Sidebar — rank number (01, 02, ...) */
export const postSidebarRankNumber =
  "font-display text-[28px] font-bold leading-none text-neutral-300";

/** Newsletter box (dark, presentational) */
export const postNewsletterEyebrow =
  "font-display text-xs font-bold uppercase tracking-[0.07em] text-neutral-400";
export const postNewsletterHeading =
  "font-display text-xl font-bold leading-[1.3] text-white";
export const postNewsletterBody = "font-sans text-[13.5px] leading-relaxed text-neutral-300";
