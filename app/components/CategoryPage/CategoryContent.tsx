import Image from "next/image";
import Link from "next/link";
import { getCoverImage } from "@/sanity/lib/utils";
import CategorySidebar from "./CategorySidebar";

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
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No articles found
        </h2>
        <p className="text-gray-600 mb-6">
          There are no articles in the {categoryName} category yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main and Secondary Articles */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Featured Article */}
            {mainArticle && (
              <article className="border-b border-gray-200 pb-8">
                <div className="relative mb-4">
                  <Link href={`/post/${mainArticle.slug || "#"}`}>
                    {(() => {
                      const imageData = getImageData(
                        mainArticle.cover,
                        mainArticle.title || "Article image"
                      );
                      return (
                        <Image
                          src={imageData.src}
                          alt={imageData.alt}
                          width={800}
                          height={400}
                          unoptimized={imageData.unoptimized}
                          className="w-full h-64 md:h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                        />
                      );
                    })()}
                  </Link>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded">
                    {mainArticle.author?.name || "Anonymous"}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{formatDate(mainArticle.date)}</span>
                    <span>•</span>
                    <span>{mainArticle.author?.name || "Anonymous"}</span>
                  </div>

                  <Link href={`/post/${mainArticle.slug || "#"}`}>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight cursor-pointer hover:text-blue-600 transition-colors">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {secondaryArticles.map((article) => (
                  <article
                    key={article._id}
                    className="border-b border-gray-200 pb-6"
                  >
                    <div className="relative mb-4">
                      <Link href={`/post/${article.slug || "#"}`}>
                        {(() => {
                          const imageData = getImageData(
                            article.cover,
                            article.title || "Article image"
                          );
                          return (
                            <Image
                              src={imageData.src}
                              alt={imageData.alt}
                              width={400}
                              height={250}
                              unoptimized={imageData.unoptimized}
                              className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                            />
                          );
                        })()}
                      </Link>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {article.author?.name || "Anonymous"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{formatDate(article.date)}</span>
                        <span>•</span>
                        <span>{article.author?.name || "Anonymous"}</span>
                      </div>

                      <Link href={`/post/${article.slug || "#"}`}>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight cursor-pointer hover:text-blue-600 transition-colors">
                          {article.title || "Untitled"}
                        </h3>
                      </Link>

                      {article.excerpt && (
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {remainingArticles.map((article) => (
                  <article
                    key={article._id}
                    className="border-b border-gray-200 pb-4"
                  >
                    <div className="relative mb-3">
                      <Link href={`/post/${article.slug || "#"}`}>
                        {(() => {
                          const imageData = getImageData(
                            article.cover,
                            article.title || "Article image"
                          );
                          return (
                            <Image
                              src={imageData.src}
                              alt={imageData.alt}
                              width={300}
                              height={200}
                              unoptimized={imageData.unoptimized}
                              className="w-full h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                            />
                          );
                        })()}
                      </Link>
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                        {article.author?.name || "Anonymous"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatDate(article.date)}</span>
                        <span>•</span>
                        <span>{article.author?.name || "Anonymous"}</span>
                      </div>

                      <Link href={`/post/${article.slug || "#"}`}>
                        <h4 className="text-sm font-bold text-gray-900 leading-tight cursor-pointer hover:text-blue-600 transition-colors line-clamp-2">
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
