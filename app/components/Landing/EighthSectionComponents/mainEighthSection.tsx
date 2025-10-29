import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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

interface CategoryData {
  slug: string | null;
  name: string | null;
  posts: Post[];
}

interface MainEighthSectionProps {
  categoriesData: CategoryData[];
}

export default function MainEighthSection({
  categoriesData,
}: MainEighthSectionProps) {
  // Filter out categories without required data and limit to 3 posts per category
  const validCategories = categoriesData
    .filter(
      (category) => category.slug && category.name && category.posts.length > 0
    )
    .map((category) => ({
      ...category,
      posts: category.posts.slice(0, 3), // Take only the first 3 posts
    }));

  return (
    <main className="bg-background px-4 border-2 border-yellow-500">
      <div className="">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {validCategories.map((category, index) => {
            const [mainPost, secondPost, thirdPost] = category.posts;

            return (
              <article key={category.slug} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center mb-4">
                  <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
                  <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider font-inter">
                    {category.name}
                  </h2>
                </div>
                <div className="border-b border-gray-300 mb-6"></div>

                {/* Featured Image */}
                <Link href={`/post/${mainPost.slug}`}>
                  {mainPost?.coverImage && (
                    <div className="relative overflow-hidden rounded-lg bg-black">
                      <Image
                        src={
                          urlForImage(mainPost.coverImage)?.url() ||
                          "/placeholder.svg"
                        }
                        alt={mainPost.title}
                        width={800}
                        height={300}
                        className="h-[300px] w-full object-cover rounded-xl"
                      />
                      <span className="absolute bottom-4 right-4 text-xs text-white">
                        {mainPost.author?.name || "The Associated Press"}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Main Article */}
                {mainPost && mainPost.slug && (
                  <div className="space-y-2">
                    <Link href={`/post/${mainPost.slug}`}>
                      <h1 className=" text-base font-outfit font-medium leading-tight tracking-wide text-foreground">
                        {mainPost.title}
                      </h1>
                    </Link>
                  </div>
                )}

                {/* Divider */}
                <hr className="border-border" />

                {/* Related Articles */}
                <div className="space-y-4">
                  {secondPost && secondPost.slug && (
                    <Link href={`/post/${secondPost.slug}`}>
                      <h3 className="text-base font-outfit font-medium leading-tight tracking-wide text-foreground mb-4">
                        {secondPost.title}
                      </h3>
                    </Link>
                  )}
                  {thirdPost && thirdPost.slug && (
                    <Link href={`/post/${thirdPost.slug}`}>
                      <h3 className="text-base font-outfit font-medium leading-tight tracking-wide text-foreground">
                        {thirdPost.title}
                      </h3>
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
