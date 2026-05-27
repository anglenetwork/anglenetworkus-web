/**
 * Clickable article headline — underline on hover.
 * Uses Tailwind utilities (not only globals.css) so underline wins over utility-layer title styles.
 * - `hover:underline` when the headline itself is hovered
 * - `group-hover:underline` when a parent `.group` link/card is hovered (e.g. thumbnail + title row)
 */
export const articleTitleLink =
  "article-title-link underline-offset-2 hover:underline group-hover:underline";
