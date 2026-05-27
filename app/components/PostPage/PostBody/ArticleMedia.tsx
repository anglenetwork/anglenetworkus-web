import ArticleImageFigure from "./ArticleImageFigure";
import CoverImageCarousel from "./CoverImageCarousel";
import {
  ARTICLE_MEDIA_CLASSES,
  DEFAULT_IMAGE_CAPTION,
  NON_REGULAR_POST_IMAGE_CAPTION_CLASS,
} from "./constants";
import { buildCoverImageData, buildGalleryImageData } from "./media-utils";
import type { MediaPresentation, PostBodyProps } from "./types";

function nonRegularCaptionClass(presentation: MediaPresentation) {
  return presentation === "editorial" || presentation === "nonRegularCover"
    ? NON_REGULAR_POST_IMAGE_CAPTION_CLASS
    : undefined;
}

interface ArticleMediaProps {
  cover: PostBodyProps["cover"];
  imageGallery: PostBodyProps["imageGallery"];
  title: string;
  presentation?: MediaPresentation;
}

export default function ArticleMedia({
  cover,
  imageGallery,
  title,
  presentation = "default",
}: ArticleMediaProps) {
  const coverImageData = buildCoverImageData(cover, title);
  const galleryImagesData = Array.isArray(imageGallery)
    ? imageGallery
        .map((image) => buildGalleryImageData(image))
        .filter((image): image is NonNullable<typeof image> => Boolean(image))
    : [];

  const hasGalleryImages = galleryImagesData.length > 0;
  const shouldShowCarousel = Boolean(coverImageData?.src || hasGalleryImages);

  if (!shouldShowCarousel) return null;

  if (hasGalleryImages) {
    return (
      <CoverImageCarousel
        coverImage={coverImageData}
        galleryImages={galleryImagesData}
        presentation={presentation}
        captionClassName={nonRegularCaptionClass(presentation)}
      />
    );
  }

  if (!coverImageData?.src) return null;

  const mediaClasses = ARTICLE_MEDIA_CLASSES[presentation];

  return (
    <ArticleImageFigure
      src={coverImageData.src}
      alt={coverImageData.alt}
      width={1200}
      height={675}
      fill
      priority
      fetchPriority="high"
      quality={70}
      sizes={mediaClasses.sizes}
      unoptimized={coverImageData.unoptimized}
      blurDataURL={coverImageData.blurDataURL}
      figureClassName={mediaClasses.figure}
      wrapperClassName={mediaClasses.wrapper}
      imageClassName={mediaClasses.image}
      caption={coverImageData.caption}
      credit={coverImageData.credit}
      license={coverImageData.licenseOrRights}
      fallbackCaption={DEFAULT_IMAGE_CAPTION}
      captionClassName={nonRegularCaptionClass(presentation)}
    />
  );
}
