import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/utils";

interface Post {
  _id: string;
  title: string;
  slug: string | null;
  excerpt?: string | null;
  coverImage?: any;
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
      <div className="py-8 px-4">
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-outfit">
              <Link
                href={`/category/${categoryTitle.toLowerCase().replace(/\s+/g, "-")}`}
                className="hover:text-red-600 transition-colors cursor-pointer"
              >
                More from {categoryTitle}
              </Link>
            </h2>
          </div>
          <div className="border-t border-black mb-6"></div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-[60%]">
            {mainArticle && (
              <Link
                href={`/post/${mainArticle.slug || "#"}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
                  {mainArticle.coverImage ? (
                    <Image
                      src={
                        urlForImage(mainArticle.coverImage)
                          ?.width(800)
                          .height(500)
                          .url() || ""
                      }
                      alt={mainArticle.title || "Article image"}
                      fill
                      className="object-cover transition-opacity group-hover:opacity-90"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-200">
                      <span className="text-neutral-500">No Image</span>
                    </div>
                  )}
                </div>
                <h2 className="mt-6 text-balance text-2xl font-bold leading-tight text-neutral-900 font-outfit">
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
                  <h3 className="text-base font-normal leading-relaxed text-neutral-900 font-outfit">
                    {article.title || "Untitled"}
                  </h3>
                </Link>
                {index < sidebarArticles.length - 1 && (
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
