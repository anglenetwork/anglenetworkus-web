/** Advertise promo block (`app/components/ui/thirdSection.tsx`) — headline wrapper */
export const promoHeadline =
  "text-center font-display leading-tight text-white";

/** Advertise promo block — headline line 1 */
export const promoHeadlineLine1 = "block text-lg font-medium md:text-xl";

/** Advertise promo block — headline line 2 */
export const promoHeadlineLine2 = "mt-2 block text-2xl font-medium md:text-4xl";

/** Advertise promo block — headline line 3 */
export const promoHeadlineLine3 =
  "mt-2 block text-4xl font-bold md:text-5xl lg:text-6xl";

/** Advertise promo block — CTA button */
export const promoCtaButton =
  "mt-6 inline-flex items-center rounded border-2 border-white bg-transparent px-6 py-3 font-sans text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/** Homepage fifth section — hover: headline fades to ink-soft. */
const angleTitleHover = "transition-colors group-hover:text-angle-inkSoft";

/** Category column label (WORLD, POLITICS) with red dot prefix. */
export const fifthCategoryLabel =
  "mb-7 flex items-center gap-2 font-sans text-[13px] font-bold uppercase tracking-[0.12em] text-angle-ink before:size-[7px] before:shrink-0 before:rounded-full before:bg-angle-red before:content-['']";

/** Featured hero title on gradient overlay (World column). */
export const fifthFeaturedOverlayTitle =
  "font-display text-2xl font-semibold leading-[1.22] tracking-[-0.3px] text-white max-[720px]:text-[21px] lg:text-[28px]";

/** Featured hero read time on gradient overlay. */
export const fifthFeaturedOverlayMeta =
  "mt-3 font-mono text-[11px] text-white/80";

/** Fallback featured headline when image is missing. */
export const fifthFeaturedHeadline = `font-display text-2xl font-semibold leading-[1.26] tracking-[-0.3px] text-angle-ink max-[720px]:text-[21px] ${angleTitleHover}`;

/** Politics list row headline. */
export const fifthListHeadline = `font-display text-[17px] font-semibold leading-[1.28] tracking-[-0.2px] text-angle-ink ${angleTitleHover}`;

/** Photo credit under featured hero. */
export const fifthFeaturedCredit =
  "mt-2.5 font-mono text-[10.5px] tracking-[0.02em] text-angle-inkSoft";

/** @deprecated Alias kept for ArticleFamilyIndexPage — use fifthFeaturedOverlayTitle. */
export const fifthSectionFeaturedOverlayTitle = fifthFeaturedOverlayTitle;
