import Link from "next/link";
import { getCoverImage } from "@/sanity/lib/utils";
import CategorySidebar from "./CategorySidebar";
import { ImageRenderer } from "../ui/image-renderer";

interface Post {
  _id: string;
  title: string;
  slug: string | null;
  href?: string;
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

interface CategoryContentProps {
  posts: Post[];
  categoryName: string;
}

export default function CategoryContent({
  posts,
  categoryName,
}: CategoryContentProps) {
  // Helper function to get image data from cover
  const getImageData = (cover: any, fallbackTitle: string = "Article") => {
    const coverData = getCoverImage(cover, fallbackTitle);
    return coverData
      ? {
          src: coverData.src,
          alt: coverData.alt,
          unoptimized: coverData.unoptimized,
        }
      : {
          src: "/placeholder.svg",
          alt: fallbackTitle,
          unoptimized: false,
        };
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="mb-4 font-bold text-2xl text-gray-900">
          No articles found
        </h2>
        <p className="mb-6 text-gray-600">
          There are no articles in the {categoryName} category yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse all articles
        </Link>
      </div>
    );
  }

  // Get main article (first post)
  const mainArticle = posts[0];
  // Get secondary articles (next 2 posts)
  const secondaryArticles = posts.slice(1, 3);
  // Get remaining articles for grid
  const remainingArticles = posts.slice(3);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Main and Secondary Articles */}
          <div className="space-y-8 lg:col-span-2">
            {/* Main Featured Article */}
            {mainArticle && (
              <article className="border-gray-200 border-b pb-8">
                <div className="relative mb-4">
                  <Link
                    href={
                      mainArticle.href ?? `/post/${mainArticle.slug || "#"}`
                    }
                  >
                    {(() => {
                      const imageData = getImageData(
                        mainArticle.cover,
                        mainArticle.title || "Article image",
                      );
                      return (
                        <ImageRenderer
                          src={imageData.src}
                          alt={imageData.alt}
                          width={800}
                          height={400}
                          unoptimized={imageData.unoptimized}
                          className="h-64 w-full cursor-pointer rounded-lg object-cover transition-opacity hover:opacity-90 md:h-80"
                        />
                      );
                    })()}
                  </Link>
                  <div className="absolute right-4 bottom-4 rounded bg-black/70 px-3 py-1 text-sm text-white">
                    {mainArticle.author?.name || "Anonymous"}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <span>{formatDate(mainArticle.date)}</span>
                    <span>•</span>
                    <span>{mainArticle.author?.name || "Anonymous"}</span>
                  </div>

                  <Link
                    href={
                      mainArticle.href ?? `/post/${mainArticle.slug || "#"}`
                    }
                  >
                    <h2 className="cursor-pointer font-bold text-2xl text-gray-900 leading-tight transition-colors hover:text-blue-600 md:text-3xl">
                      {mainArticle.title || "Untitled"}
                    </h2>
                  </Link>

                  {mainArticle.excerpt && (
                    <p className="text-gray-600 leading-relaxed">
                      {mainArticle.excerpt}
                    </p>
                  )}
                </div>
              </article>
            )}

            {/* Secondary Articles Row */}
            {secondaryArticles.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {secondaryArticles.map((article) => (
                  <article
                    key={article._id}
                    className="border-gray-200 border-b pb-6"
                  >
                    <div className="relative mb-4">
                      <Link
                        href={article.href ?? `/post/${article.slug || "#"}`}
                      >
                        {(() => {
                          const imageData = getImageData(
                            article.cover,
                            article.title || "Article image",
                          );
                          return (
                            <ImageRenderer
                              src={imageData.src}
                              alt={imageData.alt}
                              width={400}
                              height={250}
                              unoptimized={imageData.unoptimized}
                              className="h-48 w-full cursor-pointer rounded-lg object-cover transition-opacity hover:opacity-90"
                            />
                          );
                        })()}
                      </Link>
                      <div className="absolute right-2 bottom-2 rounded bg-black/70 px-2 py-1 text-white text-xs">
                        {article.author?.name || "Anonymous"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-gray-500 text-xs">
                        <span>{formatDate(article.date)}</span>
                        <span>•</span>
                        <span>{article.author?.name || "Anonymous"}</span>
                      </div>

                      <Link
                        href={article.href ?? `/post/${article.slug || "#"}`}
                      >
                        <h3 className="cursor-pointer font-bold text-gray-900 text-lg leading-tight transition-colors hover:text-blue-600">
                          {article.title || "Untitled"}
                        </h3>
                      </Link>

                      {article.excerpt && (
                        <p className="line-clamp-3 text-gray-600 text-sm leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Remaining Articles Grid */}
            {remainingArticles.length > 0 && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {remainingArticles.map((article) => (
                  <article
                    key={article._id}
                    className="border-gray-200 border-b pb-4"
                  >
                    <div className="relative mb-3">
                      <Link
                        href={article.href ?? `/post/${article.slug || "#"}`}
                      >
                        {(() => {
                          const imageData = getImageData(
                            article.cover,
                            article.title || "Article image",
                          );
                          return (
                            <ImageRenderer
                              src={imageData.src}
                              alt={imageData.alt}
                              width={300}
                              height={200}
                              unoptimized={imageData.unoptimized}
                              className="h-40 w-full cursor-pointer rounded-lg object-cover transition-opacity hover:opacity-90"
                            />
                          );
                        })()}
                      </Link>
                      <div className="absolute right-1 bottom-1 rounded bg-black/70 px-1 py-0.5 text-white text-xs">
                        {article.author?.name || "Anonymous"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <span>{formatDate(article.date)}</span>
                        <span>•</span>
                        <span>{article.author?.name || "Anonymous"}</span>
                      </div>

                      <Link
                        href={article.href ?? `/post/${article.slug || "#"}`}
                      >
                        <h4 className="line-clamp-2 cursor-pointer font-bold text-gray-900 text-sm leading-tight transition-colors hover:text-blue-600">
                          {article.title || "Untitled"}
                        </h4>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <CategorySidebar posts={posts} categoryName={categoryName} />
          </div>
        </div>
      </div>
    </div>
  );
}
