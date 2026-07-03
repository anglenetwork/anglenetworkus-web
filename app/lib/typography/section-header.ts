/** SectionHeader modern — large sentence-case section title */
export const modernSectionTitle = {
  light:
    "font-bold font-display text-3xl text-neutral-900 leading-tight tracking-tight md:text-4xl xl:text-2xl",
  news: "font-bold font-display text-3xl text-news-text leading-tight tracking-tight md:text-4xl xl:text-2xl",
  dark: "font-bold font-display text-3xl text-white leading-tight tracking-tight md:text-4xl xl:text-3xl",
} as const;

/** SectionHeader modern — larger page title (e.g. analysis/opinion index) */
export const modernSectionTitleLarge = {
  light:
    "font-bold font-display text-4xl text-neutral-900 leading-tight tracking-tight md:text-5xl",
  news: "font-bold font-display text-4xl text-news-text leading-tight tracking-tight md:text-5xl",
  dark: "font-bold font-display text-4xl text-white leading-tight tracking-tight md:text-5xl",
} as const;

/** SectionHeader minimal — uppercase base-size kicker title */
export const minimalSectionTitle = {
  light: "font-bold font-sans text-base uppercase tracking-normal text-black",
  news: "font-bold font-sans text-base uppercase tracking-normal text-black",
  dark: "font-bold font-sans text-base uppercase tracking-normal text-white",
} as const;
