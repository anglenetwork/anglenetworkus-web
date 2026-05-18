import type { ReactNode } from "react";
import type { PortableTextComponents } from "@portabletext/react";
import { formatImageCredit, urlForImage } from "@/sanity/lib/utils";
import ArticleImageFigure from "./ArticleImageFigure";
import { buildBodyImageData } from "./media-utils";
import { getVideoEmbedSrc } from "./video-utils";
import type { ArticleImageSource, PortableTextBlockValue } from "./types";

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
          epigraph={asString(imageValue.epigraph)}
          credit={formatImageCredit(imageValue)}
          showAltAsCaption
        />
      );
    },
    editorialImage: ({ value }: PortableTextComponentProps) => {
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
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 900px"
          quality={55}
          figureClassName={`my-8 text-left ${layoutClass}`}
          wrapperClassName="relative w-full aspect-[4/3] max-h-[700px] overflow-hidden rounded-lg shadow-lg"
          imageClassName="object-cover"
          epigraph={imageData.epigraph}
          credit={imageData.credit}
        />
      );
    },
    pullQuote: ({ value }: PortableTextComponentProps) => {
      const quoteValue = asRecord(value);
      const quote = asString(quoteValue.quote);
      if (!quote) return null;

      const attribution = asString(quoteValue.attribution);
      const sourceLabel = asString(quoteValue.sourceLabel);

      return (
        <blockquote className="my-10 md:my-12 border-l-2 border-neutral-300 pl-4 md:pl-6 text-left">
          <p className="font-sans text-2xl md:text-3xl leading-tight text-neutral-900">
            {quote}
          </p>
          {(attribution || sourceLabel) && (
            <footer className="mt-3 font-sans text-xs text-neutral-500">
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
            <figcaption className="mt-2 font-sans text-xs text-neutral-500">
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
          className="underline decoration-neutral-300 underline-offset-[3px] hover:decoration-neutral-700 transition-colors"
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h1: ({ children }: PortableTextComponentProps) => (
      <h1 className="font-sans font-semibold tracking-tight text-[34px] sm:text-[40px] md:text-[44px] text-neutral-900 mt-10 mb-4 leading-tight text-left">
        {children}
      </h1>
    ),
    h2: ({ children }: PortableTextComponentProps) => (
      <h2 className="font-sans font-semibold tracking-tight text-2xl sm:text-[28px] md:text-[32px] lg:text-[36px] text-neutral-900 mt-10 md:mt-12 mb-4 leading-snug text-left">
        {children}
      </h2>
    ),
    h3: ({ children }: PortableTextComponentProps) => (
      <h3 className="font-sans font-semibold text-[20px] sm:text-[22px] md:text-[24px] text-neutral-900 mt-8 mb-3 leading-snug text-left">
        {children}
      </h3>
    ),
    h4: ({ children }: PortableTextComponentProps) => (
      <h4 className="font-sans font-medium text-lg text-neutral-900 mt-6 mb-2 leading-snug text-left">
        {children}
      </h4>
    ),
    normal: ({ children }: PortableTextComponentProps) => (
      <p className="font-body text-xl !leading-relaxed sm:text-xl text-neutral-900 mb-4 text-left">
        {children}
      </p>
    ),
    blockquote: ({ children }: PortableTextComponentProps) => (
      <blockquote className="my-10 md:my-12 border-l-2 border-neutral-200 pl-4 md:pl-6 text-left">
        <div className="font-sans text-2xl md:text-3xl leading-tight text-neutral-900">
          {children}
        </div>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: PortableTextComponentProps) => (
      <ul className="font-body list-disc pl-6 space-y-2 text-neutral-900 mb-4 text-left">
        {children}
      </ul>
    ),
    number: ({ children }: PortableTextComponentProps) => (
      <ol className="font-body list-decimal pl-6 space-y-2 text-neutral-900 mb-4 text-left">
        {children}
      </ol>
    ),
  },
};
