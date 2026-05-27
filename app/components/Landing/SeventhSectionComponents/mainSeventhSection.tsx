import Link from "next/link";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import { getCoverImage } from "@/sanity/lib/utils";

interface Post {
  _id: string;
  title: string;
  slug: string | null;
  excerpt?: string | null;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
  } | null;
  date: string;
  author?: {
    name: string;
    picture?: any;
  } | null;
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
}

interface MainSeventhSectionProps {
  posts: Post[];
  categoryTitle: string;
}

export default function MainSeventhSection({
  posts,
  categoryTitle,
}: MainSeventhSectionProps) {
  // Get the main article (first post) and the remaining articles for the sidebar
  const mainArticle = posts[0];
  const sidebarArticles = posts.slice(1, 10); // Get 9 articles for the sidebar

  return (
    <div className="min-h-screen">
      <div className="px-4 py-8">
        {/* Section Header */}
        <div className="mb-6">
          <div className="mb-4 flex items-center">
            <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
            <h2 className="font-sans font-semibold text-gray-700 text-sm uppercase tracking-wide">
              <Link
                href={`/category/${categoryTitle.toLowerCase().replace(/\s+/g, "-")}`}
                className="cursor-pointer transition-colors hover:text-red-600"
              >
                More from {categoryTitle}
              </Link>
            </h2>
          </div>
          <div className="mb-6 border-black border-t"></div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-[60%]">
            {mainArticle && (
              <Link
                href={`/post/${mainArticle.slug || "#"}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
                  {(() => {
                    const coverData = getCoverImage(
                      mainArticle.cover,
                      mainArticle.title || "Article image",
                    );
                    if (coverData?.src) {
                      return (
                        <ImageRenderer
                          src={coverData.src}
                          alt={coverData.alt}
                          width={1200}
                          height={750}
                          fill
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          unoptimized={coverData.unoptimized}
                          className="rounded-xl object-cover transition-opacity group-hover:opacity-90"
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
                <h2 className="mt-6 text-balance font-bold font-sans text-2xl text-neutral-900 leading-tight">
                  {mainArticle.title || "Untitled"}
                </h2>
              </Link>
            )}
          </div>

          <div className="flex flex-col lg:w-[40%]">
            {sidebarArticles.map((article, index) => (
              <div key={article._id}>
                <Link
                  href={`/post/${article.slug || "#"}`}
                  className="block py-4 transition-opacity hover:opacity-70"
                >
                  <h3 className="font-normal font-sans text-base text-neutral-900 leading-relaxed">
                    {article.title || "Untitled"}
                  </h3>
                </Link>
                {index < sidebarArticles.length - 1 && (
                  <div className="border-neutral-200 border-b" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
