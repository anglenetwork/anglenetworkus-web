/** SectionHeader modern — large sentence-case section title */
export const modernSectionTitle = {
  light:
    "font-bold font-sans text-3xl text-neutral-900 leading-tight tracking-tight md:text-4xl xl:text-2xl",
  dark: "font-bold font-sans text-3xl text-white leading-tight tracking-tight md:text-4xl xl:text-3xl",
} as const;

/** SectionHeader small-dot — uppercase kicker title (regular size) */
export const smallDotSectionTitle = {
  light:
    "font-bold font-sans text-sm uppercase tracking-normal text-foreground",
  dark: "font-bold font-sans text-sm uppercase tracking-normal text-white",
} as const;

/** SectionHeader small-dot — uppercase kicker title (large size) */
export const smallDotSectionTitleLarge = {
  light:
    "font-bold font-sans text-lg uppercase tracking-normal text-foreground",
  dark: "font-bold font-sans text-lg uppercase tracking-normal text-white",
} as const;
