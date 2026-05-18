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
  figureClassName: string;
  wrapperClassName: string;
  imageClassName: string;
  epigraph?: string | null;
  credit?: string | null;
  showAltAsCaption?: boolean;
  fallbackEpigraph?: string;
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
  figureClassName,
  wrapperClassName,
  imageClassName,
  epigraph,
  credit,
  showAltAsCaption,
  fallbackEpigraph,
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
          className={imageClassName}
        />
      </div>
      <ArticleCaption
        epigraph={epigraph}
        credit={credit}
        alt={alt}
        showAltAsCaption={showAltAsCaption}
        fallbackEpigraph={fallbackEpigraph}
      />
    </figure>
  );
}
