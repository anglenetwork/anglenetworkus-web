/**
 * Clickable article headline — underline on hover.
 * Uses Tailwind utilities (not only globals.css) so underline wins over utility-layer title styles.
 * - `hover:underline` when the headline itself is hovered
 * - `group-hover:underline` when a parent `.group` link/card is hovered (e.g. thumbnail + title row)
 */
export const articleTitleLink =
  "article-title-link underline-offset-2 hover:underline group-hover:underline";

/** Linked SectionHeader title (category index, opinion index, etc.) */
export const sectionHeaderLink =
  "cursor-pointer transition-colors group-hover:text-red-600 hover:text-red-600 dark:group-hover:text-red-400 dark:hover:text-red-400";
