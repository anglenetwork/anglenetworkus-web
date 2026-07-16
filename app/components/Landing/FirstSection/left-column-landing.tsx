import Link from "next/link";
import { HOMEPAGE_JUST_IN_LIMIT } from "@/app/lib/homepage/first-section";
import { justInHeadline, justInLabel } from "@/app/lib/typography/first-section";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { JustInCarouselLoader } from "./just-in-carousel-loader";
import { JustInStaticImage } from "./just-in-static-image";
import { carouselImagesForPost } from "./just-in-carousel-images";
import type { JustInCarouselPost } from "./just-in-carousel-images";

interface Post extends JustInCarouselPost {
  _id: string;
  slug: string;
  readTime?: number | null;
  breakingNews?: boolean | null;
  developingStory?: boolean | null;
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
}

interface LeftColumnLandingProps {
  justInNews: Post[];
}

export function LeftColumnLanding({ justInNews }: LeftColumnLandingProps) {
  const articles = justInNews.slice(0, HOMEPAGE_JUST_IN_LIMIT);

  return (
    <div className="flex h-full flex-col px-6 py-9 lg:py-10 lg:pr-8 lg:pl-0">
      <div>
        <div className="mb-6 flex items-center gap-2.5">
          <span
            className="block size-2 shrink-0 rounded-full border-2 border-angle-red"
            aria-hidden
          />
          <span className={justInLabel}>Just in</span>
        </div>

        <div className="flex flex-col">
          {articles.map((post, index) => {
            const isFirstArticle = index === 0;
            const carouselImages = isFirstArticle
              ? carouselImagesForPost(post)
              : [];
            const showCarousel = isFirstArticle && carouselImages.length > 1;
            const showStaticImage =
              isFirstArticle && carouselImages.length === 1;

            return (
              <article
                key={post._id}
                className="divider-dashed mt-[22px] pt-[22px] first:mt-0 first:bg-none first:pt-0"
              >
                {showCarousel ? (
                  <JustInCarouselLoader
                    images={carouselImages}
                    postSlug={post.slug}
                    breakingNews={post.breakingNews}
                    developingStory={post.developingStory}
                  />
                ) : showStaticImage ? (
                  <JustInStaticImage
                    image={carouselImages[0]}
                    postSlug={post.slug}
                    breakingNews={post.breakingNews}
                    developingStory={post.developingStory}
                  />
                ) : null}
                <Link href={`/post/${post.slug}`} className="group block">
                  <h3 className={justInHeadline}>{post.title}</h3>
                  <ReadTimeLabel minutes={post.readTime} variant="angle" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
