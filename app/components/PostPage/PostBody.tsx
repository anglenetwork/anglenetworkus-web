import { PortableText } from "@portabletext/react";
import {
  getCoverImage,
  urlForImage,
  formatImageCredit,
} from "@/sanity/lib/utils";
import SocialShareButtons from "./SocialShareButtons";
import { ImageRenderer } from "../ui/image-renderer";

interface BodyImage {
  source?: "asset" | "external";
  externalUrl?: string | null;
  image?: any;
  alt?: string | null;
  epigraph?: string | null;
  creditProvider?: string | null;
  creditAuthor?: string | null;
  creditSourceUrl?: string | null;
  creditLicense?: string | null;
}

interface BodyBlock {
  bodyText?: any;
  bodyImage?: BodyImage | null;
}

interface PostBodyProps {
  bodyTextOne: any;
  bodyBlocks?: Array<BodyBlock> | null;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
    epigraph?: string | null;
    creditProvider?: string | null;
    creditAuthor?: string | null;
    creditSourceUrl?: string | null;
    creditLicense?: string | null;
  } | null;
  title: string;
  author?: { name: string; picture?: any };
  date: string;
  updatedAt?: string | null;
  slug?: string;
}

/** Portable Text renderers (Spectral for body, DM Sans for headings) */
const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      const builder = urlForImage(value);
      if (!builder) return null;

      const imageUrl = builder.width(1200).height(800).fit("max").quality(75).url();
      return (
        <figure className="my-8 text-left">
          <ImageRenderer
            src={imageUrl}
            alt={value.alt || ""}
            width={1200}
            height={800}
            // Body images are content width; tell Next so it doesn't fetch overly large sizes
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 800px"
            className="w-full h-auto rounded-lg shadow-lg"
          />
          {(value.alt || value.epigraph || formatImageCredit(value)) && (
            <figcaption className="mt-2 text-left">
              {/* Epigraph + Source in secondary font */}
              {(value.epigraph || formatImageCredit(value)) && (
                <p className="font-secondary text-[12px] sm:text-xs text-neutral-500">
                  {value.epigraph && (
                    <span className="italic">{value.epigraph}</span>
                  )}
                  {value.epigraph && formatImageCredit(value) && (
                    <span className="text-neutral-400"> • </span>
                  )}
                  {formatImageCredit(value) && (
                    <span className="text-neutral-400">
                      {formatImageCredit(value)}
                    </span>
                  )}
                </p>
              )}
              {/* Optional alt-as-caption (muted) */}
              {value.alt && (
                <p
                  className="font-secondary text-[12px] sm:text-xs text-neutral-400"
                  aria-hidden="true"
                >
                  {value.alt}
                </p>
              )}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      const target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
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
    h1: ({ children }: any) => (
      <h1 className="font-sans font-semibold tracking-tight text-[34px] sm:text-[40px] md:text-[44px] text-neutral-900 mt-10 mb-4 leading-tight text-left">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-sans font-semibold tracking-tight text-2xl sm:text-[28px] md:text-[32px] lg:text-[36px] text-neutral-900 mt-10 md:mt-12 mb-4 leading-snug text-left">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-sans font-semibold text-[20px] sm:text-[22px] md:text-[24px] text-neutral-900 mt-8 mb-3 leading-snug text-left">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="font-sans font-medium text-lg text-neutral-900 mt-6 mb-2 leading-snug text-left">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="font-body text-xl !leading-relaxed sm:text-xl text-neutral-900 mb-4 text-left">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-10 md:my-12 border-l-2 border-neutral-200 pl-4 md:pl-6 text-left">
        <div className="font-sans text-2xl md:text-3xl leading-tight text-neutral-900">
          {children}
        </div>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="font-body list-disc pl-6 space-y-2 text-neutral-900 mb-4 text-left">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="font-body list-decimal pl-6 space-y-2 text-neutral-900 mb-4 text-left">
        {children}
      </ol>
    ),
  },
};

/** Helpers */
function buildBodyImage(bodyImage: BodyImage | null | undefined): {
  src: string | null;
  alt: string;
  unoptimized: boolean;
  epigraph?: string | null;
  credit?: string | null;
} | null {
  if (!bodyImage) return null;

  // Check if bodyImage is essentially empty (no actual image data)
  const hasExternalUrl =
    bodyImage.externalUrl && bodyImage.externalUrl.trim() !== "";
  const hasImageAsset =
    bodyImage.image && (bodyImage.image as any)?.asset?._ref;

  if (!hasExternalUrl && !hasImageAsset) {
    return null;
  }

  // Prefer explicit external URL when present or source === "external"
  if (
    hasExternalUrl &&
    (bodyImage.source === "external" || !bodyImage.source) &&
    bodyImage.externalUrl
  ) {
    return {
      src: bodyImage.externalUrl,
      alt: bodyImage.alt || "Body image",
      unoptimized: true,
      epigraph: bodyImage.epigraph,
      credit: formatImageCredit(bodyImage),
    };
  }

  // Fallback to Sanity asset
  if (
    hasImageAsset &&
    (bodyImage.source === "asset" || !bodyImage.source || !hasExternalUrl)
  ) {
    const builder = urlForImage(bodyImage.image);
    if (builder) {
      return {
        src: builder.width(1200).height(675).fit("max").quality(75).url(),
        alt: bodyImage.alt || bodyImage.image?.alt || "Body image",
        unoptimized: false,
        epigraph: bodyImage.epigraph,
        credit: formatImageCredit(bodyImage),
      };
    }
  }
  return null;
}

function renderBodyImage(
  bodyImage: BodyImage | null | undefined,
  key: string | number
) {
  const imageData = buildBodyImage(bodyImage);
  if (!imageData?.src) return null;

  return (
    <figure key={key} className="my-8 text-left">
      <div className="relative w-full aspect-[4/3] max-h-[600px] overflow-hidden rounded-lg shadow-lg">
        <ImageRenderer
          src={imageData.src}
          alt={imageData.alt}
          width={1200}
          height={900}
          fill
          unoptimized={imageData.unoptimized}
          // Same logical width assumptions as the cover/body images
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 800px"
          className="object-cover rounded-lg"
        />
      </div>
      {(imageData.epigraph || imageData.credit || imageData.alt) && (
        <figcaption className="mt-2 text-left">
          {(imageData.epigraph || imageData.credit) && (
            <p className="font-secondary text-[12px] sm:text-xs text-neutral-500">
              {imageData.epigraph && (
                <span className="">{imageData.epigraph}</span>
              )}
              {imageData.epigraph && imageData.credit && (
                <span className="text-neutral-400"> • </span>
              )}
              {imageData.credit && (
                <span className="text-neutral-400">{imageData.credit}</span>
              )}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
}

function renderBodyText(content: any, key: string | number) {
  if (!content) return null;
  return (
    <div key={key} className="font-body space-y-5 sm:space-y-6 text-left">
      <PortableText value={content} components={portableTextComponents} />
    </div>
  );
}

export default function PostBody({
  bodyTextOne,
  bodyBlocks,
  cover,
  title,
  author,
  date,
  updatedAt,
  slug,
}: PostBodyProps) {
  return (
    <div className="antialiased text-left mb-8">
      {/* Byline / Meta / Share — secondary font */}
      <div className="flex items-center justify-between mb-6 font-secondary">
        <div className="flex flex-col">
          <div className="text-xs text-muted-foreground">
            By{" "}
            <span className="text-blue-600 font-medium">
              {author?.name || "Unknown Author"}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          {updatedAt && updatedAt !== date && (
            <div className="text-xs text-muted-foreground">
              Updated:{" "}
              {new Date(updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>

        {slug && <SocialShareButtons title={title} url={`/post/${slug}`} />}
      </div>

      {/* Cover image with epigraphs in secondary font */}
      {(() => {
        const coverData = getCoverImage(cover, title);
        if (!coverData?.src) return null;

        return (
          <figure className="mb-12 text-left">
            <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg shadow-lg">
              <ImageRenderer
                src={coverData.src}
                alt={coverData.alt}
                width={1200}
                height={675}
                fill
                priority
                fetchPriority="high"
                quality={75}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 800px"
                unoptimized={coverData.unoptimized}
                className="object-cover object-center"
              />
            </div>
            {(cover?.epigraph || formatImageCredit(cover)) && (
              <figcaption className="mt-2 font-secondary text-sm tracking-tight leading-snug text-neutral-500 text-left">
                {cover?.epigraph && (
                  <span className="font-bold">{cover.epigraph}</span>
                )}
                {cover?.epigraph && formatImageCredit(cover) && (
                  <span className="text-neutral-500"> • </span>
                )}
                {formatImageCredit(cover) && (
                  <span className="text-neutral-500">
                    {formatImageCredit(cover)}
                  </span>
                )}
              </figcaption>
            )}
          </figure>
        );
      })()}

      {/* Main text */}
      <div className="space-y-8 text-left">
        {renderBodyText(bodyTextOne, "main-text")}
      </div>

      {/* Dynamic body blocks */}
      {bodyBlocks && bodyBlocks.length > 0 && (
        <div className="space-y-8 text-left mt-8">
          {bodyBlocks.map((block, index) => (
            <div key={`block-${index}`}>
              {renderBodyImage(block.bodyImage, `block-image-${index}`)}
              {renderBodyText(block.bodyText, `block-text-${index}`)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
