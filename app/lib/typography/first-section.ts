/** Homepage "Front" section — hover behavior: headline fades to ink-soft on hover. */
const angleTitleHover = "transition-colors group-hover:text-angle-inkSoft";

/** Single responsive lead headline above the Just In / Hero / Right rail grid. */
export const leadHeadlineTitle = `mx-auto max-w-[900px] text-center font-display text-[36px] font-bold leading-[1.04] tracking-[-0.5px] text-angle-ink lg:text-[56px] lg:tracking-[-1.5px] ${angleTitleHover}`;

/** "JUST IN" kicker label next to the outlined red dot. */
export const justInLabel =
  "font-mono text-xs font-bold uppercase tracking-[0.12em] leading-none text-angle-ink";

/** Category tag above a Just In / right rail headline (e.g. "WORLD"). */
export const justInCategoryLabel =
  "mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.08em] leading-none text-angle-ink";

/** Just In list-item headlines (uniform size for every row, including the lead). */
export const justInHeadline = `font-display text-[17px] font-semibold leading-[1.32] tracking-[-0.2px] text-angle-ink ${angleTitleHover}`;

/** Hero caption overlaid on the gradient at the bottom of the main image. */
export const heroCaption =
  "font-sans text-base font-medium leading-[1.45] text-white";

/** Photo credit line under the hero image. */
export const heroCredit =
  "mt-2.5 text-right font-mono text-[11px] tracking-[0.015em] text-angle-inkSoft";

/** "More Top Headlines" 2-up grid headline under the hero. */
export const belowHeadline = `mt-4 font-display text-lg font-semibold leading-[1.28] tracking-[-0.2px] text-angle-ink ${angleTitleHover}`;

/** Right rail featured story headline (image + headline). */
export const rightFeatureHeadline = `mt-4 font-display text-[19px] font-semibold leading-[1.28] tracking-[-0.2px] text-angle-ink ${angleTitleHover}`;

/** Right rail compact mini-list headline. */
export const rightMiniHeadline = `font-display text-[15px] font-semibold leading-[1.28] tracking-[-0.1px] text-angle-ink ${angleTitleHover}`;

/** "More {Category} news" / "More headlines" link label at the bottom of a column. */
export const colMoreLabel =
  "text-sm font-semibold text-angle-inkSoft transition-colors group-hover:text-angle-ink";
