import Link from "next/link";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import {
  mostReadItemTitle,
  mostReadRankNumber,
  sideStoryTitle,
} from "@/app/lib/typography/first-section";

interface Post {
  _id: string;
  title: string;
  slug: string;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
    imageSource?: string | null;
  } | null;
  author?: {
    name: string;
    picture?: any;
  } | null;
}

interface RightColumnLandingProps {
  sideStories: Post[];
  mostRead: Post[];
}

export function RightColumnLanding({
  sideStories,
  mostRead,
}: RightColumnLandingProps) {
  return (
    <div className="px-0 text-left md:px-4">
      {sideStories.map((post, index) => (
        <article key={post._id} className="mb-4">
          {(() => {
            const coverData = getCoverImage(post.cover, post.title);
            if (!coverData) return null;
            return (
              <div className="mb-4">
                <Link href={`/post/${post.slug}`}>
                  <div className="relative h-48 w-full overflow-hidden rounded-sm">
                    <ImageRenderer
                      src={coverData.src}
                      alt={coverData.alt}
                      width={600}
                      height={400}
                      unoptimized={coverData.unoptimized}
                      quality={55}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 500px"
                      className="rounded-sm object-cover"
                      fill
                    />
                  </div>
                </Link>
              </div>
            );
          })()}
          <Link href={`/post/${post.slug}`} className="hover:text-red-600">
            <h3 className={sideStoryTitle}>{post.title}</h3>
          </Link>
        </article>
      ))}

      {/* What Matters section */}
      <div className="rounded-xl bg-neutral-200 p-8">
        <SectionHeader
          title="What Matters"
          variant="light"
          accentStyle="small-dot"
          size="regular"
        />

        <div className="space-y-6">
          {/* Numbered list of most read articles */}
          <div className="space-y-4">
            {mostRead.map((post, index) => (
              <article
                key={post._id}
                className="flex items-start justify-start space-x-3 pb-2 lg:justify-start"
              >
                <span className={mostReadRankNumber}>{index + 1}</span>
                <Link
                  href={`/post/${post.slug}`}
                  className="hover:text-red-600"
                >
                  <h3 className={mostReadItemTitle}>{post.title}</h3>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
