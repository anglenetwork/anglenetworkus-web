import type { ReactNode } from "react";
import type { PortableTextComponents } from "@portabletext/react";
import {
  NON_REGULAR_POST_BODY_EDITORIAL_IMAGE_FIGURE_CLASS,
  NON_REGULAR_POST_BODY_EDITORIAL_IMAGE_SIZES,
  NON_REGULAR_POST_BODY_EDITORIAL_IMAGE_WRAPPER_CLASS,
} from "./constants";
import {
  regularPostBodyBulletList,
  regularPostBodyH1,
  regularPostBodyH2,
  regularPostBodyH3,
  regularPostBodyH4,
  regularPostBodyNumberedList,
  regularPostBodyParagraph,
  regularPostBodyQuote,
  regularPostBodyQuoteAttribution,
  regularPostBodyVideoCaption,
} from "@/app/lib/typography/posts";
import {
  formatImageCredit,
  formatImageLicense,
  normalizeImageMeta,
  urlForImage,
} from "@/sanity/lib/utils";
import ArticleImageFigure from "./ArticleImageFigure";
import { buildBodyImageData } from "./media-utils";
import { getVideoEmbedSrc } from "./video-utils";
import { cn } from "@/lib/utils";
import type { ArticleImageSource, PortableTextBlockValue } from "./types";

const BODY_PARAGRAPH_LAYOUT = "mb-4 text-left";
const BODY_H1_LAYOUT = "mt-10 mb-4 text-left";
const BODY_H2_LAYOUT = "mt-10 mb-4 text-left md:mt-12";
const BODY_H3_LAYOUT = "mt-8 mb-3 text-left";
const BODY_H4_LAYOUT = "mt-6 mb-2 text-left";
const BODY_LIST_LAYOUT = "mb-4 space-y-2 pl-6 text-left";

type PortableTextComponentProps = {
  children?: ReactNode;
  value?: unknown;
};

function asRecord(value: unknown): PortableTextBlockValue {
  return value && typeof value === "object"
    ? (value as PortableTextBlockValue)
    : {};
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function hasAssetRef(value: PortableTextBlockValue): boolean {
  const asset = asRecord(value.asset);
  return typeof asset._ref === "string" && asset._ref.length > 0;
}

function renderEditorialImageBlock(
  value: unknown,
  {
    wrapperClassName,
    sizes,
    figureClassName = "my-8 text-left",
  }: {
    wrapperClassName: string;
    sizes: string;
    figureClassName?: string;
  },
) {
  const imageValue = asRecord(value);
  const imageData = buildBodyImageData(imageValue as ArticleImageSource);
  if (!imageData?.src) return null;

  const layout = asString(imageValue.layout);
  const layoutClass =
    layout === "full"
      ? "w-full"
      : layout === "wide"
        ? "w-full md:w-[110%] md:-ml-[5%]"
        : "w-full";

  return (
    <ArticleImageFigure
      src={imageData.src}
      alt={imageData.alt}
      width={1200}
      height={900}
      fill
      unoptimized={imageData.unoptimized}
      blurDataURL={imageData.blurDataURL}
      sizes={sizes}
      quality={55}
      figureClassName={`${figureClassName} ${layoutClass}`}
      wrapperClassName={wrapperClassName}
      imageClassName="object-cover"
      caption={imageData.caption}
      credit={imageData.credit}
      license={imageData.licenseOrRights}
    />
  );
}

/** Portable Text: `font-body` for paragraphs/lists; `font-sans` for headings, block quotes, captions, and meta. */
export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: PortableTextComponentProps) => {
      const imageValue = asRecord(value);
      if (!hasAssetRef(imageValue)) return null;

      const builder = urlForImage(
        imageValue as Parameters<typeof urlForImage>[0],
      );
      if (!builder) return null;

      const imageUrl = builder
        .width(1200)
        .height(800)
        .fit("max")
        .quality(60)
        .url();

      return (
        <ArticleImageFigure
          src={imageUrl}
          alt={asString(imageValue.alt) || ""}
          width={1200}
          height={800}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 800px"
          quality={55}
          figureClassName="my-8 text-left"
          wrapperClassName="relative w-full aspect-[3/2] overflow-hidden rounded-lg shadow-lg"
          imageClassName="object-cover"
          caption={normalizeImageMeta(imageValue).caption}
          credit={formatImageCredit(imageValue)}
          license={formatImageLicense(imageValue)}
          showAltAsCaption
        />
      );
    },
    editorialImage: ({ value }: PortableTextComponentProps) =>
      renderEditorialImageBlock(value, {
        wrapperClassName:
          "relative w-full aspect-[4/3] max-h-[700px] overflow-hidden rounded-lg shadow-lg",
        sizes: "(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 900px",
      }),
    pullQuote: ({ value }: PortableTextComponentProps) => {
      const quoteValue = asRecord(value);
      const quote = asString(quoteValue.quote);
      if (!quote) return null;

      const attribution = asString(quoteValue.attribution);
      const sourceLabel = asString(quoteValue.sourceLabel);

      return (
        <blockquote className="my-10 border-neutral-300 border-l-2 pl-4 text-left md:my-12 md:pl-6">
          <p className={regularPostBodyQuote}>{quote}</p>
          {(attribution || sourceLabel) && (
            <footer className={`mt-3 ${regularPostBodyQuoteAttribution}`}>
              {attribution || ""}
              {attribution && sourceLabel ? " • " : ""}
              {sourceLabel || ""}
            </footer>
          )}
        </blockquote>
      );
    },
    articleDivider: ({ value }: PortableTextComponentProps) => {
      const dividerValue = asRecord(value);
      if (dividerValue.style === "spacer") {
        return <div className="my-8 h-8" aria-hidden="true" />;
      }
      return <hr className="my-10 border-neutral-200" />;
    },
    videoEmbed: ({ value }: PortableTextComponentProps) => {
      const videoValue = asRecord(value);
      const src = getVideoEmbedSrc(asString(videoValue.url));
      if (!src) return null;

      const title = asString(videoValue.title);

      return (
        <figure className="my-8 text-left">
          <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
            <div className="relative w-full pt-[56.25%]">
              <iframe
                src={src}
                title={title || "Embedded video"}
                className="absolute inset-0 h-full w-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
          {title && (
            <figcaption className={`mt-2 ${regularPostBodyVideoCaption}`}>
              {title}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }: PortableTextComponentProps) => {
      const linkValue = asRecord(value);
      const href = asString(linkValue.href) || undefined;
      const target = href?.startsWith("http") ? "_blank" : undefined;

      return (
        <a
          href={href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          className="underline decoration-neutral-300 underline-offset-[3px] transition-colors hover:decoration-neutral-700"
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h1: ({ children }: PortableTextComponentProps) => (
      <h1 className={cn(regularPostBodyH1, BODY_H1_LAYOUT)}>{children}</h1>
    ),
    h2: ({ children }: PortableTextComponentProps) => (
      <h2 className={cn(regularPostBodyH2, BODY_H2_LAYOUT)}>{children}</h2>
    ),
    h3: ({ children }: PortableTextComponentProps) => (
      <h3 className={cn(regularPostBodyH3, BODY_H3_LAYOUT)}>{children}</h3>
    ),
    h4: ({ children }: PortableTextComponentProps) => (
      <h4 className={cn(regularPostBodyH4, BODY_H4_LAYOUT)}>{children}</h4>
    ),
    normal: ({ children }: PortableTextComponentProps) => (
      <p className={cn(regularPostBodyParagraph, BODY_PARAGRAPH_LAYOUT)}>
        {children}
      </p>
    ),
    blockquote: ({ children }: PortableTextComponentProps) => (
      <blockquote className="my-10 border-neutral-200 border-l-2 pl-4 text-left md:my-12 md:pl-6">
        <div className={regularPostBodyQuote}>{children}</div>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: PortableTextComponentProps) => (
      <ul
        className={cn(regularPostBodyBulletList, BODY_LIST_LAYOUT, "list-disc")}
      >
        {children}
      </ul>
    ),
    number: ({ children }: PortableTextComponentProps) => (
      <ol
        className={cn(
          regularPostBodyNumberedList,
          BODY_LIST_LAYOUT,
          "list-decimal",
        )}
      >
        {children}
      </ol>
    ),
  },
};

/** Non-regular article body — smaller in-body editorial images */
export const nonRegularPortableTextComponents: PortableTextComponents = {
  ...portableTextComponents,
  types: {
    ...portableTextComponents.types,
    editorialImage: ({ value }: PortableTextComponentProps) =>
      renderEditorialImageBlock(value, {
        figureClassName: NON_REGULAR_POST_BODY_EDITORIAL_IMAGE_FIGURE_CLASS,
        wrapperClassName: NON_REGULAR_POST_BODY_EDITORIAL_IMAGE_WRAPPER_CLASS,
        sizes: NON_REGULAR_POST_BODY_EDITORIAL_IMAGE_SIZES,
      }),
  },
};
