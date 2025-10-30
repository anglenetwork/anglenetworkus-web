import { LeftColumnFifth } from "./leftColumnFifth";
import { CenterColumnFifth } from "./centerColumnFifth";
import { RightColumnFifth } from "./rightColumnFifth";
import { FourthSectionQueryResult } from "@/sanity.types";
import { urlForImage } from "@/sanity/lib/utils";

interface MainFifthSectionProps {
  posts: FourthSectionQueryResult;
  categoryTitle: string;
}

export default function MainFifthSection({
  posts,
  categoryTitle,
}: MainFifthSectionProps) {
  // Helper function to get image URL from Sanity image
  const getImageUrl = (coverImage: any) => {
    const imageUrl = urlForImage(coverImage);
    return imageUrl ? imageUrl.url() : "/placeholder.svg";
  };

  // First 4 to center column
  const centerArticles = posts.slice(0, 4).map((post: any, index: number) => ({
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

  // Remaining 5 (of 9) to right column under Most Read block
  const mostReadArticles = posts
    .slice(4, 9)
    .map((post: any, index: number) => ({
      id: post._id,
      title: post.title || "Untitled",
      image: post.coverImage ? getImageUrl(post.coverImage) : undefined,
      imageAlt: post.title || "Article image",
      hasImage: !!post.coverImage,
      slug: post.slug || "#",
    }));

  return (
    <div className="border-2 border-blue-500">
      {/* Main container with three columns */}
      <div className="border-2 border-orange-500">
        <div className="grid grid-cols-12 gap-0">
          {/* Mobile order: Center, Left, Right */}
          {/* Desktop order: Left, Center, Right */}
          <div className="col-span-12 md:col-span-3 md:order-1 order-2">
            <LeftColumnFifth />
          </div>
          <div className="col-span-12 md:col-span-6 md:order-2 order-1">
            <CenterColumnFifth
              centerArticles={centerArticles}
              categoryTitle={categoryTitle}
            />
          </div>
          <div className="col-span-12 md:col-span-3 md:order-3 order-3">
            <RightColumnFifth mostReadArticles={mostReadArticles} />
          </div>
        </div>
      </div>
      {/* <div className="border-t border-gray-300 py-4"></div> */}
    </div>
  );
}
