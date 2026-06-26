import { articleTitleLink } from "./article-links";

/** Footer — category column heading */
export const footerCategoryHeading = `font-sans text-sm font-bold leading-snug text-white ${articleTitleLink}`;

/** Footer — tag links under each category */
export const footerTagLink = `font-sans text-sm font-normal leading-snug text-white transition-opacity hover:opacity-80 ${articleTitleLink}`;

/** Footer — top utility nav (Opinion, Analysis) */
export const footerTopNavLink = `font-sans text-sm font-normal leading-none text-white transition-opacity hover:opacity-80 ${articleTitleLink}`;

/** Footer — “Follow us on” label */
export const footerFollowLabel =
  "font-sans text-xs font-bold uppercase tracking-[0.08em] text-white";

/** Footer — copyright line (below legal links) */
export const footerCopyright =
  "mt-3 font-sans text-[11px] font-normal leading-relaxed text-[#b0b0b0]";

/** Footer — bottom legal links row */
export const footerLegalLink = `font-sans text-[11px] font-normal leading-snug text-[#b0b0b0] transition-colors hover:text-white ${articleTitleLink}`;

/** Footer — bottom legal static label */
export const footerLegalLabel =
  "font-sans text-[11px] font-normal leading-snug text-[#b0b0b0]";
