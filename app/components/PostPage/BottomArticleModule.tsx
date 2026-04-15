import Link from "next/link";
import { getCoverImage } from "@/sanity/lib/utils";
import { SectionHeader } from "@/app/components/ui/section-header";
import { ImageRenderer } from "../ui/image-renderer";
import type { ArticleSidebarPost } from "@/app/lib/article-family/types";

interface BottomArticleModuleProps {
  posts: ArticleSidebarPost[];
}

export default function BottomArticleModule({
  posts,
}: BottomArticleModuleProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="">
      <div className="py-12 px-0">
        {/* Section Header */}
        <SectionHeader
          title="Related Articles"
          variant="light"
          accentStyle="geometric-square"
          size="large"
        />

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-[60%]">
            {posts[0] && (
              <Link
                href={posts[0].href}
                className="group block"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
                  {(() => {
                    // Use 800px thumbnail for bottom module (smaller than cover but larger than sidebar)
                    const coverData = getCoverImage(
                      posts[0].cover as Parameters<typeof getCoverImage>[0],
                      posts[0].title || "Article image",
                      800
                    );
                    if (coverData?.src) {
                      return (
                        <ImageRenderer
                          src={coverData.src}
                          alt={coverData.alt}
                          width={1200}
                          height={750}
                          fill
                          quality={50}
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          unoptimized={coverData.unoptimized}
                          className="object-cover transition-opacity group-hover:opacity-90"
                          // Lazy load bottom module images (below the fold)
                        />
                      );
                    }
                    return (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-200">
                        <span className="text-neutral-500">No Image</span>
                      </div>
                    );
                  })()}
                </div>
                <h2 className="text-2xl md:text-3xl font-sans font-semibold text-neutral-900 leading-snug tracking-tight text-start mt-4">
                  {posts[0].title || "Untitled"}
                </h2>
              </Link>
            )}
          </div>

          <div className="flex flex-col lg:w-[40%]">
            {posts.slice(1).map((post, index) => (
              <div key={post._id}>
                <Link
                  href={post.href}
                  className="block py-4 transition-opacity"
                >
                  <h3 className="text-lg font-sans font-normal text-neutral-900 leading-normal tracking-normal mb-2">
                    {post.title || "Untitled"}
                  </h3>
                </Link>
                {index < posts.slice(1).length - 1 && (
                  <div className="border-b border-neutral-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
