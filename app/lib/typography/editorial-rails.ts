/** Title hover on the dark opinion block */
const editorialOnPrimaryTitleLink =
  "cursor-pointer transition-opacity hover:opacity-80 group-hover:opacity-80";

/** Featured opinion lead — OPINION kicker */
export const editorialFeaturedKicker =
  "font-display text-[1em] font-bold uppercase leading-none tracking-[0.02em] text-white";

/** Featured opinion lead — decorative opening quote (hangs above the red stamp) */
export const editorialFeaturedQuote =
  "pointer-events-none absolute left-[0.12em] top-0 z-10 -translate-y-[38%] select-none font-display text-[1em] font-bold leading-none text-white";

/** Featured opinion lead — red editorial stamp wrapping “ + OPINION */
export const editorialFeaturedStamp =
  "relative inline-block bg-news-primary pt-[0.2em] pb-[0.06em] pl-[0.64em] pr-[0.22em] text-[1.56rem] shadow-[4px_4px_0_0_rgba(255,255,255,0.18)] md:text-[1.755rem] lg:text-[5.85rem]";



/** Featured opinion lead — large impact headline */
export const editorialFeaturedHeadline = `max-w-3xl font-mono text-3xl font-bold leading-[1.12] tracking-[-0.02em] text-white md:text-4xl ${editorialOnPrimaryTitleLink}`;

/** Featured opinion lead — summary under the headline */
export const editorialFeaturedExcerpt =
  "max-w-2xl font-sans text-base leading-relaxed text-white/85 md:text-[17px]";

/** Featured opinion lead — monospace byline */
export const editorialFeaturedByline =
  "font-mono text-xs tracking-[0.02em] text-white/90";

/** Compact rail card — category kicker */
export const editorialRailKicker =
  "font-sans text-xs font-semibold uppercase tracking-wide text-white";

/** Compact rail card — title */
export const editorialRailTitle = `font-mono text-base font-semibold leading-snug tracking-normal text-white ${editorialOnPrimaryTitleLink}`;

/** Compact rail card — byline */
export const editorialRailByline = "font-sans text-xs text-white/75";
