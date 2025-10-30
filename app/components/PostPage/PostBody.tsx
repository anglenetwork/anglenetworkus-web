import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import SocialShareButtons from "./SocialShareButtons";

interface PostBodyProps {
  bodyTextOne: any;
  bodyTextTwo?: any;
  bodyTextThree?: any;
  bodyTextFour?: any;
  bodyTextFive?: any;
  coverImage?: any;
  title: string;
  epigraph?: string | null;
  imageSource?: string | null;
  bodyImageOne?: any;
  bodyImageTwo?: any;
  bodyImageThree?: any;
  bodyImageFour?: any;
  bodyImageFive?: any;
  bodyImages?: Array<{
    image: any;
    epigraph?: string | null;
    imageSource?: string | null;
  }> | null;
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
  coverImage,
  title,
  epigraph,
  imageSource,
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
  // Helper function to render body image
  const renderBodyImage = (image: any, index: number) => {
    if (!image) return null;

    const imageUrl = urlForImage(image);
    if (!imageUrl) return null;

    return (
      <div key={`body-image-${index}`} className="my-8">
        <Image
          src={imageUrl.width(1000).height(750).fit("max").quality(85).url()}
          alt={image.alt || `Body image ${index}`}
          width={1000}
          height={750}
          className="w-full h-auto rounded-lg shadow-lg"
        />
        <div className="mt-2 space-y-1">
          {(image.epigraph || image.imageSource) && (
            <p className="text-sm text-gray-500 font-secondary">
              {image.epigraph && (
                <span className="italic">{image.epigraph}</span>
              )}
              {image.epigraph && image.imageSource && (
                <span className="text-gray-400"> • </span>
              )}
              {image.imageSource && (
                <span className="text-gray-400">
                  Source: {image.imageSource}
                </span>
              )}
            </p>
          )}
          {image.alt && (
            <p
              className="text-sm text-white font-secondary font-light"
              aria-hidden="true"
            >
              {image.alt}
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

      {coverImage && (
        <div className="mb-8">
          {(() => {
            const imageUrl = urlForImage(coverImage);
            if (!imageUrl) return null;

            // Debug: Log image specifications
            console.log("Cover Image Debug:", {
              originalImage: coverImage,
              imageUrl: imageUrl.url(),
              width: coverImage.asset?.metadata?.dimensions?.width,
              height: coverImage.asset?.metadata?.dimensions?.height,
              format: coverImage.asset?.metadata?.format,
              size: coverImage.asset?.metadata?.size,
              hotspot: coverImage.hotspot,
              crop: coverImage.crop,
            });
            return (
              <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={imageUrl.fit("crop").crop("center").quality(95).url()}
                  alt={coverImage.alt || title}
                  className="w-full h-full object-cover object-center"
                  priority
                  fill
                />
              </div>
            );
          })()}
          <div className="mt-2 space-y-1">
            {(epigraph || imageSource) && (
              <p className="text-sm text-gray-500 font-secondary">
                {epigraph && <span className="italic">{epigraph}</span>}
                {epigraph && imageSource && (
                  <span className="text-gray-400"> • </span>
                )}
                {imageSource && (
                  <span className="text-gray-400">Source: {imageSource}</span>
                )}
              </p>
            )}
            {/* {coverImage.alt && (
              <p
                className="text-sm text-white font-secondary font-light"
                aria-hidden="true"
              >
                {coverImage.alt}
              </p>
            )} */}
          </div>
        </div>
      )}

      {/* Body Images */}
      {bodyImages && bodyImages.length > 0 && (
        <div className="space-y-8 mb-8">
          {bodyImages.map((bodyImage, index) => {
            if (!bodyImage.image) return null;

            const imageUrl = urlForImage(bodyImage.image);
            if (!imageUrl) return null;

            return (
              <div key={index} className="my-8">
                <Image
                  src={imageUrl
                    .width(1000)
                    .height(750)
                    .fit("max")
                    .quality(85)
                    .url()}
                  alt={bodyImage.image.alt || `Body image ${index + 1}`}
                  width={1000}
                  height={750}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <div className="mt-2 space-y-1">
                  {(bodyImage.epigraph || bodyImage.imageSource) && (
                    <p className="text-sm text-gray-500 font-secondary">
                      {bodyImage.epigraph && (
                        <span className="italic">{bodyImage.epigraph}</span>
                      )}
                      {bodyImage.epigraph && bodyImage.imageSource && (
                        <span className="text-gray-400"> • </span>
                      )}
                      {bodyImage.imageSource && (
                        <span className="text-gray-400">
                          Source: {bodyImage.imageSource}
                        </span>
                      )}
                    </p>
                  )}
                  {bodyImage.image.alt && (
                    <p
                      className="text-sm text-white font-secondary font-light"
                      aria-hidden="true"
                    >
                      {bodyImage.image.alt}
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
