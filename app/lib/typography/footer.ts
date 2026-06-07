import { articleTitleLink } from "./article-links";
import { categorySecondaryRowTitle } from "./second-section";

/** Footer — site name beside logo */
export const footerBrandTitle =
  "font-bold font-sans text-4xl text-white leading-tight tracking-tight";

/** Footer — column headings (Sections, Topics, Company) */
export const footerColumnHeading =
  "mb-4 font-bold font-sans text-sm uppercase tracking-normal text-red-600";

/** Footer — navigation links (matches landing dark secondary row titles) */
export const footerNavLink = categorySecondaryRowTitle.dark;

/** Footer — static nav labels (fallback list items) */
export const footerNavLabel = categorySecondaryRowTitle.dark;

/** Footer — copyright line */
export const footerCopyright =
  "font-sans text-sm font-medium text-white leading-snug";

/** Footer — bottom legal links */
export const footerLegalLink = `font-sans text-sm font-medium text-white leading-snug hover:text-white ${articleTitleLink}`;

/** Footer — bottom legal static label */
export const footerLegalLabel =
  "font-sans text-sm font-medium text-white leading-snug";
