import Link from "next/link";
import { BreakingNewsLabel } from "../../ui/breaking-news-label";
import { ImageRenderer } from "../../ui/image-renderer";
import type { JustInCarouselImage } from "./just-in-image-carousel";

type JustInStaticImageProps = {
  image: JustInCarouselImage;
  postSlug: string;
  breakingNews?: boolean | null;
  developingStory?: boolean | null;
};

/** Server-rendered Just In thumbnail (no carousel JS). */
export function JustInStaticImage({
  image,
  postSlug,
  breakingNews,
  developingStory,
}: JustInStaticImageProps) {
  return (
    <div className="mb-3 block">
      <Link href={`/post/${postSlug}`}>
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-news-secondary md:aspect-auto md:h-64">
          <ImageRenderer
            src={image.src}
            alt={image.alt}
            width={600}
            height={240}
            fill
            unoptimized={image.unoptimized}
            quality={55}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 300px"
            className="object-cover object-center"
          />
          {(breakingNews || developingStory) && (
            <div className="absolute bottom-3 left-3 z-10">
              <BreakingNewsLabel
                text={breakingNews ? "Breaking" : "Developing story"}
              />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
