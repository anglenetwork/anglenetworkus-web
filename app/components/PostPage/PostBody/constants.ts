import { cn } from "@/lib/utils";
import {
  regularPostImageEpigraph,
  regularPostImageEpigraphCredit,
  regularPostMetaPrimary,
  regularPostMetaSecondary,
  regularPostMetaTimestamp,
} from "@/app/lib/typography/posts";

/** Byline typography */
export const ARTICLE_META_PRIMARY_CLASS = regularPostMetaPrimary;
export const ARTICLE_META_TIMESTAMP_CLASS = regularPostMetaTimestamp;
export const ARTICLE_META_SECONDARY_CLASS = regularPostMetaSecondary;

/** Image epigraph typography (figure captions / credits) */
export const ARTICLE_IMAGE_EPIGRAPH_CLASS = regularPostImageEpigraph;
export const ARTICLE_IMAGE_EPIGRAPH_CREDIT_CLASS =
  regularPostImageEpigraphCredit;

export const DEFAULT_IMAGE_CAPTION =
  "Catch up on the latest headlines and developing news.";

/** Corner radius + clip for article covers/thumbnails (matches `rounded-lg` / `--radius`). */
export const ARTICLE_IMAGE_FRAME_CLASS = "overflow-hidden rounded-lg";

/** Regular post — byline + share actions row */
export const REGULAR_POST_BYLINE_ROW_CLASS =
  "space-y-3 font-sans xl:flex xl:items-center xl:justify-between xl:gap-4 xl:space-y-0";

/** Regular post — Portable Text body column */
export const REGULAR_POST_BODY_COLUMN_CLASS =
  "space-y-5 font-body text-left sm:space-y-6";

/** Non-regular post — byline + share actions row */
export const NON_REGULAR_POST_BYLINE_ROW_CLASS =
  "space-y-2 font-sans xl:flex xl:items-center xl:justify-between xl:gap-3 xl:space-y-0";

/** Non-regular post — article column max width (body copy, byline) */
export const NON_REGULAR_POST_CONTENT_MAX_WIDTH_CLASS = "mx-auto max-w-[688px]";

/** Non-regular post — hero/cover width (2× content column, centered breakout) */
export const NON_REGULAR_POST_HERO_WIDTH_CLASS =
  "relative left-1/2 w-[min(1376px,100vw)] max-w-[1376px] -translate-x-1/2";

/** Non-regular post — gap between byline/social row and hero image */
export const NON_REGULAR_POST_MEDIA_SECTION_CLASS = "mt-4 space-y-8 text-left";

export const ARTICLE_MEDIA_CLASSES = {
  default: {
    figure: "mb-12 text-left",
    wrapper:
      "relative w-full h-64 overflow-hidden rounded-lg shadow-lg md:h-[500px]",
    image: "object-cover object-center",
    sizes: "(max-width: 640px) 100vw, (max-width: 1280px) 66vw, 720px",
  },
  editorial: {
    figure: "mb-8 w-full text-left",
    wrapper:
      "relative w-full aspect-[5/3] overflow-hidden rounded-none xl:rounded-md",
    image: "object-cover object-center",
    sizes: "(max-width: 768px) 100vw, 1376px",
  },
  nonRegularCover: {
    figure: "mb-10 w-full text-left",
    wrapper:
      "relative w-full h-[205px] overflow-hidden rounded-none shadow-lg md:h-[400px] xl:rounded-lg",
    image: "object-cover object-center",
    sizes: "(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1376px",
  },
  /** Standard post redesign — hero sits inside the (narrower) main column, not full-bleed. */
  postStandard: {
    figure: "mt-7 mb-0 text-left",
    wrapper:
      "relative w-full h-[280px] overflow-hidden rounded-lg md:h-[440px]",
    image: "object-cover object-center",
    sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 800px",
  },
} as const;

/** Standard post redesign — article body measure (matches the design's 660px column) */
export const POST_ARTICLE_BODY_MAX_WIDTH_CLASS = "max-w-[660px]";

/** Standard post redesign — Portable Text body column, incl. drop-cap on the first paragraph */
export const POST_ARTICLE_BODY_COLUMN_CLASS = cn(
  "space-y-6 pt-10 font-body text-left",
  POST_ARTICLE_BODY_MAX_WIDTH_CLASS,
  "[&>p:first-of-type::first-letter]:float-left",
  "[&>p:first-of-type::first-letter]:mr-2",
  "[&>p:first-of-type::first-letter]:mt-1",
  "[&>p:first-of-type::first-letter]:font-display",
  "[&>p:first-of-type::first-letter]:text-6xl",
  "[&>p:first-of-type::first-letter]:font-bold",
  "[&>p:first-of-type::first-letter]:leading-[0.8]",
  "[&>p:first-of-type::first-letter]:text-neutral-900",
);

/** Non-regular post — caption / credit under hero and in-body images */
export const NON_REGULAR_POST_IMAGE_CAPTION_CLASS =
  "mt-2 pl-4 text-left xl:pl-0";

/** Non-regular post — in-body editorial image (2× content column width) */
export const NON_REGULAR_POST_BODY_EDITORIAL_IMAGE_FIGURE_CLASS =
  "my-8 w-full text-left";

export const NON_REGULAR_POST_BODY_EDITORIAL_IMAGE_WRAPPER_CLASS =
  "relative left-1/2 aspect-[4/3] max-h-[560px] w-[min(1376px,100vw)] max-w-[1376px] -translate-x-1/2 overflow-hidden rounded-none shadow-lg xl:rounded-lg";

export const NON_REGULAR_POST_BODY_EDITORIAL_IMAGE_SIZES =
  "(max-width: 768px) 100vw, 1376px";
