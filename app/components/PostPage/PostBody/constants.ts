/** Shared sans meta/caption typography (image epigraphs, byline) */
export const ARTICLE_META_PRIMARY_CLASS =
  "font-sans text-sm sm:text-base font-semibold leading-snug text-neutral-700";
export const ARTICLE_META_TIMESTAMP_CLASS =
  "font-sans text-xs sm:text-sm font-normal leading-snug text-neutral-700";
export const ARTICLE_META_SECONDARY_CLASS =
  "font-sans text-xs sm:text-sm font-normal italic text-neutral-500";

export const DEFAULT_IMAGE_EPIGRAPH =
  "Catch up on the latest headlines and developing news.";

/** Corner radius + clip for article covers/thumbnails (matches `rounded-lg` / `--radius`). */
export const ARTICLE_IMAGE_FRAME_CLASS = "overflow-hidden rounded-lg";

export const ARTICLE_MEDIA_CLASSES = {
  default: {
    figure: "mb-12 text-left",
    wrapper:
      "relative w-full h-64 md:h-[500px] overflow-hidden rounded-lg shadow-lg",
    image: "object-cover object-center",
    sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 800px",
  },
  editorial: {
    figure: "mb-8 text-left",
    wrapper:
      "relative w-full aspect-[4/3] overflow-hidden rounded-md",
    image: "object-cover object-center",
    sizes: "(max-width: 768px) 100vw, 860px",
  },
} as const;
