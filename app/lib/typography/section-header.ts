/** SectionHeader modern — large sentence-case section title */
export const modernSectionTitle = {
  light:
    "font-bold font-sans text-3xl text-neutral-900 leading-tight tracking-tight md:text-4xl xl:text-2xl",
  news: "font-bold font-sans text-3xl text-news-text leading-tight tracking-tight md:text-4xl xl:text-2xl",
  dark: "font-bold font-sans text-3xl text-white leading-tight tracking-tight md:text-4xl xl:text-3xl",
} as const;

/** SectionHeader modern — larger page title (e.g. analysis/opinion index) */
export const modernSectionTitleLarge = {
  light:
    "font-bold font-sans text-4xl text-neutral-900 leading-tight tracking-tight md:text-5xl",
  news: "font-bold font-sans text-4xl text-news-text leading-tight tracking-tight md:text-5xl",
  dark: "font-bold font-sans text-4xl text-white leading-tight tracking-tight md:text-5xl",
} as const;

/** SectionHeader small-dot — uppercase kicker title (regular size) */
export const smallDotSectionTitle = {
  light:
    "font-bold font-sans text-sm uppercase tracking-normal text-foreground",
  news: "font-bold font-sans text-sm uppercase tracking-normal text-news-text",
  dark: "font-bold font-sans text-sm uppercase tracking-normal text-white",
} as const;

/** SectionHeader small-dot — uppercase kicker title (large size) */
export const smallDotSectionTitleLarge = {
  light:
    "font-bold font-sans text-lg uppercase tracking-normal text-foreground",
  news: "font-bold font-sans text-lg uppercase tracking-normal text-news-text",
  dark: "font-bold font-sans text-lg uppercase tracking-normal text-white",
} as const;
