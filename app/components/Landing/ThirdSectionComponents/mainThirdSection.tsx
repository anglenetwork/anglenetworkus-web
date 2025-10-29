import { LeftColumnThird } from "./leftColumnThird";
import { CenterColumnThird } from "./centerColumnThird";
import { RightColumnThird } from "./rightColumnThird";
import { FourthSectionQueryResult } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";

interface MainThirdSectionProps {
  posts: FourthSectionQueryResult;
  categoryTitle: string;
  mostReadPosts: FourthSectionQueryResult;
}

export default function MainThirdSection({
  posts,
  categoryTitle,
  mostReadPosts,
}: MainThirdSectionProps) {
  // Helper function to get image URL from Sanity image
  const getImageUrl = (coverImage: any) => {
    const imageUrl = urlForImage(coverImage);
    return imageUrl ? imageUrl.url() : "/placeholder.svg";
  };

  // Transform posts data into the format expected by CenterColumnThird
  const congressArticles = posts.map((post: any, index: number) => ({
    id: post._id,
    title: post.title || "Untitled",
    author: post.author?.name || "Anonymous",
    coAuthor: "", // We'll use a single author for now
    thirdAuthor: undefined,
    image: getImageUrl(post.coverImage),
    imageAlt: post.title || "Article image",
    isMain: index === 0,
    slug: post.slug || "#",
  }));

  // Transform most read posts data
  const mostReadArticles = mostReadPosts.map((post: any, index: number) => ({
    id: post._id,
    title: post.title || "Untitled",
    image: post.coverImage ? getImageUrl(post.coverImage) : undefined,
    imageAlt: post.title || "Article image",
    hasImage: !!post.coverImage,
    slug: post.slug || "#",
  }));

  return (
    <div className="min-h-screen">
      {/* Main container with three columns */}
      <div>
        <div className="grid grid-cols-12 gap-0">
          {/* Mobile order: Center, Left, Right */}
          {/* Desktop order: Left, Center, Right */}
          <div className="col-span-12 md:col-span-3 md:order-1 order-2">
            <LeftColumnThird />
          </div>
          <div className="col-span-12 md:col-span-6 md:order-2 order-1">
            <CenterColumnThird
              congressArticles={congressArticles}
              categoryTitle={categoryTitle}
            />
          </div>
          <div className="col-span-12 md:col-span-3 md:order-3 order-3">
            <RightColumnThird mostReadArticles={mostReadArticles} />
          </div>
        </div>
      </div>
      {/* <div className="border-t border-gray-300 py-4"></div> */}
    </div>
  );
}
