import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { getCoverImage, urlForImage } from "@/sanity/lib/utils";
import SocialShareButtons from "./SocialShareButtons";

interface BodyImage {
  source?: "asset" | "external";
  externalUrl?: string | null;
  image?: any;
  alt?: string | null;
  epigraph?: string | null;
  imageSource?: string | null;
}

interface PostBodyProps {
  bodyTextOne: any;
  bodyTextTwo?: any;
  bodyTextThree?: any;
  bodyTextFour?: any;
  bodyTextFive?: any;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
    epigraph?: string | null;
    imageSource?: string | null;
  } | null;
  title: string;
  bodyImageOne?: BodyImage | null;
  bodyImageTwo?: BodyImage | null;
  bodyImageThree?: BodyImage | null;
  bodyImageFour?: BodyImage | null;
  bodyImageFive?: BodyImage | null;
  bodyImages?: Array<BodyImage> | null;
  author?: { name: string; picture?: any };
  date: string;
  slug?: string;
}

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null;
      }
      const imageUrl = urlForImage(value);
      if (!imageUrl) {
        return null;
      }
      return (
        <div className="my-8">
          <Image
            src={imageUrl.width(1000).height(750).fit("max").quality(85).url()}
            alt={value.alt || ""}
            width={1000}
            height={750}
            className="w-full h-auto rounded-lg shadow-lg"
          />
          {value.alt && (
            <p
              className="text-sm text-white mt-2 text-center italic"
              aria-hidden="true"
            >
              {value.alt}
            </p>
          )}
        </div>
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
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {children}
        </a>
      );
    },
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4 font-secondary">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3 font-secondary">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold text-gray-900 mt-5 mb-2 font-secondary">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-bold text-gray-900 mt-4 mb-2 font-secondary">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-gray-800 leading-relaxed mb-4 font-secondary text-lg font-light">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-6 font-secondary">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1">
        {children}
      </ol>
    ),
  },
};

export default function PostBody({
  bodyTextOne,
  bodyTextTwo,
  bodyTextThree,
  bodyTextFour,
  bodyTextFive,
  cover,
  title,
  bodyImageOne,
  bodyImageTwo,
  bodyImageThree,
  bodyImageFour,
  bodyImageFive,
  bodyImages,
  author,
  date,
  slug,
}: PostBodyProps) {
  // Helper function to get body image URL and metadata
  const getBodyImage = (bodyImage: BodyImage | null | undefined): {
    src: string | null;
    alt: string;
    unoptimized: boolean;
    epigraph?: string | null;
    imageSource?: string | null;
  } | null => {
    if (!bodyImage) return null;

    // 1) External URL takes priority if source is external OR if externalUrl exists (fallback for missing source)
    if (bodyImage.externalUrl && (bodyImage.source === "external" || !bodyImage.source)) {
      return {
        src: bodyImage.externalUrl,
        alt: bodyImage.alt || `Body image`,
        unoptimized: true,
        epigraph: bodyImage.epigraph,
        imageSource: bodyImage.imageSource,
      };
    }
    // 2) Asset image - check if source is asset OR if image exists (fallback for missing source)
    if (bodyImage.image && (bodyImage.source === "asset" || !bodyImage.source || !bodyImage.externalUrl)) {
      const imageUrl = urlForImage(bodyImage.image);
      if (imageUrl) {
        return {
          src: imageUrl.width(1000).height(750).fit("max").quality(85).url(),
          alt: bodyImage.alt || bodyImage.image?.alt || `Body image`,
          unoptimized: false,
          epigraph: bodyImage.epigraph,
          imageSource: bodyImage.imageSource,
        };
      }
    }
    return null;
  };

  // Helper function to render body image
  const renderBodyImage = (bodyImage: BodyImage | null | undefined, index: number) => {
    const imageData = getBodyImage(bodyImage);
    if (!imageData || !imageData.src) return null;

    return (
      <div key={`body-image-${index}`} className="my-8">
        <Image
          src={imageData.src}
          alt={imageData.alt}
          width={1000}
          height={750}
          unoptimized={imageData.unoptimized}
          className="w-full h-auto rounded-lg shadow-lg"
        />
        <div className="mt-2 space-y-1">
          {(imageData.epigraph || imageData.imageSource) && (
            <p className="text-sm text-gray-500 font-secondary">
              {imageData.epigraph && (
                <span className="italic">{imageData.epigraph}</span>
              )}
              {imageData.epigraph && imageData.imageSource && (
                <span className="text-gray-400"> • </span>
              )}
              {imageData.imageSource && (
                <span className="text-gray-400">
                  Source: {imageData.imageSource}
                </span>
              )}
            </p>
          )}
          {imageData.alt && (
            <p
              className="text-sm text-white font-secondary font-light"
              aria-hidden="true"
            >
              {imageData.alt}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Helper function to render body text
  const renderBodyText = (content: any, index: number) => {
    if (!content) return null;

    return (
      <div
        key={`body-text-${index}`}
        className="text-gray-700 leading-relaxed mb-8"
      >
        <PortableText value={content} components={portableTextComponents} />
      </div>
    );
  };

  return (
    <div className="">
      {/* Author, Date, and Social Share Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <div className="text-xs font-secondary text-muted-foreground">
            By{" "}
            <span className="text-blue-600 font-medium font-secondary">
              {author?.name || "Unknown Author"}
            </span>
          </div>
          <div className="text-xs font-secondary text-muted-foreground">
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* Social Share Buttons */}
        {slug && <SocialShareButtons title={title} url={`/post/${slug}`} />}
      </div>

      {(() => {
        const coverData = getCoverImage(cover, title);
        if (!coverData || !coverData.src) {
          return null;
        }

        return (
          <div className="mb-8">
            <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg shadow-lg">
              <Image
                src={coverData.src}
                alt={coverData.alt}
                className="w-full h-full object-cover object-center"
                priority
                fill
                unoptimized={coverData.unoptimized}
              />
            </div>
            <div className="mt-2 space-y-1">
              {(cover?.epigraph || cover?.imageSource) && (
                <p className="text-sm text-gray-500 font-secondary">
                  {cover.epigraph && <span className="italic">{cover.epigraph}</span>}
                  {cover.epigraph && cover.imageSource && (
                    <span className="text-gray-400"> • </span>
                  )}
                  {cover.imageSource && (
                    <span className="text-gray-400">Source: {cover.imageSource}</span>
                  )}
                </p>
              )}
            </div>
          </div>
        );
      })()}

      {/* Body Images */}
      {bodyImages && bodyImages.length > 0 && (
        <div className="space-y-8 mb-8">
          {bodyImages.map((bodyImage, index) => {
            const imageData = getBodyImage(bodyImage);
            if (!imageData || !imageData.src) return null;

            return (
              <div key={index} className="my-8">
                <Image
                  src={imageData.src}
                  alt={imageData.alt}
                  width={1000}
                  height={750}
                  unoptimized={imageData.unoptimized}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <div className="mt-2 space-y-1">
                  {(imageData.epigraph || imageData.imageSource) && (
                    <p className="text-sm text-gray-500 font-secondary">
                      {imageData.epigraph && (
                        <span className="italic">{imageData.epigraph}</span>
                      )}
                      {imageData.epigraph && imageData.imageSource && (
                        <span className="text-gray-400"> • </span>
                      )}
                      {imageData.imageSource && (
                        <span className="text-gray-400">
                          Source: {imageData.imageSource}
                        </span>
                      )}
                    </p>
                  )}
                  {imageData.alt && (
                    <p
                      className="text-sm text-white font-secondary font-light"
                      aria-hidden="true"
                    >
                      {imageData.alt}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New alternating text-image pattern */}
      <div className="space-y-8">
        {/* bodyTextOne (required) */}
        {renderBodyText(bodyTextOne, 1)}
        {renderBodyImage(bodyImageOne, 1)}

        {/* bodyTextTwo + bodyImageTwo */}
        {renderBodyText(bodyTextTwo, 2)}
        {renderBodyImage(bodyImageTwo, 2)}

        {/* bodyTextThree + bodyImageThree */}
        {renderBodyText(bodyTextThree, 3)}
        {renderBodyImage(bodyImageThree, 3)}

        {/* bodyTextFour + bodyImageFour */}
        {renderBodyText(bodyTextFour, 4)}
        {renderBodyImage(bodyImageFour, 4)}

        {/* bodyTextFive + bodyImageFive */}
        {renderBodyText(bodyTextFive, 5)}
        {renderBodyImage(bodyImageFive, 5)}
      </div>
    </div>
  );
}
