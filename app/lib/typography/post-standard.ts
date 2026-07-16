import { articleTitleLink } from "./article-links";

// ### Standard post page — redesigned editorial layout
// Scoped exclusively to the `post` document type (see article-family-post-layout.tsx).
// Kept separate from `posts.ts` / `post-page.ts` so the shared `sponsored` layout is untouched.

/** Header — category kicker (uppercase label, no accent dot) */
export const postArticleKicker =
  "font-sans text-xs font-bold uppercase tracking-[0.08em] text-news-text";

/** Header — h1 headline */
export const postArticleTitle =
  "font-display text-xl font-bold leading-[1.2] tracking-tight text-news-text sm:text-2xl md:text-3xl lg:text-4xl lg:leading-[1.35]";

/** Header — dek / excerpt */
export const postArticleDek =
  "font-sans text-sm leading-relaxed text-news-muted lg:text-base";

/** Body — paragraph copy (drop cap applied via wrapper selector, see PostBody/index.tsx) */
export const postArticleBodyParagraph =
  "font-body text-lg leading-[1.75] text-news-text md:text-xl";

/** Body — in-article h2 */
export const postArticleBodyH2 =
  "font-display text-xl font-bold leading-snug text-news-text md:text-[25px]";

/** Body — in-article h3 */
export const postArticleBodyH3 =
  "font-display text-lg font-bold leading-snug text-news-text md:text-xl";

/** Body — in-article h4 */
export const postArticleBodyH4 =
  "font-display text-base font-semibold leading-snug text-news-text md:text-lg";

/** Body — pull quote / blockquote */
export const postArticleQuote =
  "font-body text-2xl italic font-medium leading-snug text-news-text md:text-[28px]";

/** Body — pull quote attribution (cite) */
export const postArticleQuoteAttribution =
  "font-display text-[13px] font-semibold not-italic tracking-wide text-news-muted";

/** Body — bullet / numbered lists */
export const postArticleBodyBulletList = "font-body text-news-text";
export const postArticleBodyNumberedList = "font-body text-news-text";

/** Tags row — outline pill */
export const postTagPill =
  "font-display text-[12.5px] font-semibold text-news-muted border border-news-border rounded-full px-4 py-[7px] transition-colors hover:border-news-text hover:text-news-text";

/** Author card */
export const postAuthorCardName =
  "font-display text-[15px] font-bold text-news-text";
export const postAuthorCardBio =
  "font-sans text-[13.5px] leading-relaxed text-news-muted";

/** Sidebar — eyebrow (Popular Reads / News for You) */
export const postSidebarEyebrow =
  "font-display text-[12.5px] font-bold uppercase tracking-[0.07em] text-news-text";

/** Sidebar — ranked list item title (Popular Reads) */
export const postSidebarRankedTitle = `font-display text-[15px] font-semibold leading-[1.32] text-news-text ${articleTitleLink}`;

/** Sidebar — thumbnail list item title (News for You) */
export const postSidebarThumbTitle = `font-display text-[15px] font-semibold leading-[1.32] text-news-text ${articleTitleLink}`;

/** Sidebar — read time label */
export const postSidebarReadTime =
  "font-sans text-xs font-medium text-news-muted";

/** Sidebar — rank number (01, 02, ...) */
export const postSidebarRankNumber =
  "font-display text-[28px] font-bold leading-none text-news-primary";

/** Newsletter box (dark, presentational) */
export const postNewsletterEyebrow =
  "font-display text-xs font-bold uppercase tracking-[0.07em] text-news-muted";
export const postNewsletterHeading =
  "font-display text-xl font-bold leading-[1.3] text-white";
export const postNewsletterBody =
  "font-sans text-[13.5px] leading-relaxed text-news-border";
