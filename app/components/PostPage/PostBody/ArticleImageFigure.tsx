import { ImageRenderer } from "../../ui/image-renderer";
import ArticleCaption from "./ArticleCaption";

interface ArticleImageFigureProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  fill?: true;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  fetchPriority?: "auto" | "high" | "low";
  unoptimized?: boolean;
  blurDataURL?: string | null;
  figureClassName: string;
  wrapperClassName: string;
  imageClassName: string;
  caption?: string | null;
  credit?: string | null;
  license?: string | null;
  showAltAsCaption?: boolean;
  fallbackCaption?: string;
  captionClassName?: string;
}

export default function ArticleImageFigure({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  quality,
  priority,
  fetchPriority,
  unoptimized,
  blurDataURL,
  figureClassName,
  wrapperClassName,
  imageClassName,
  caption,
  credit,
  license,
  showAltAsCaption,
  fallbackCaption,
  captionClassName,
}: ArticleImageFigureProps) {
  return (
    <figure className={figureClassName}>
      <div className={wrapperClassName}>
        <ImageRenderer
          src={src}
          alt={alt}
          width={width}
          height={height}
          fill={fill}
          priority={priority}
          fetchPriority={fetchPriority}
          quality={quality}
          sizes={sizes}
          unoptimized={unoptimized}
          blurDataURL={blurDataURL}
          className={imageClassName}
        />
      </div>
      <ArticleCaption
        caption={caption}
        credit={credit}
        license={license}
        alt={alt}
        showAltAsCaption={showAltAsCaption}
        fallbackCaption={fallbackCaption}
        figcaptionClassName={captionClassName}
      />
    </figure>
  );
}
