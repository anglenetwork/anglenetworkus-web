import { LeftColumnFifth } from "./leftColumnFifth";
import { CenterColumnFifth } from "./centerColumnFifth";
import { RightColumnFifth } from "./rightColumnFifth";
import { FourthSectionQueryResult } from "@/sanity.types";
import { getCoverImage, formatImageCredit } from "@/sanity/lib/utils";

interface MainFifthSectionProps {
  posts: FourthSectionQueryResult;
  categoryTitle: string;
}

export default function MainFifthSection({
  posts,
  categoryTitle,
}: MainFifthSectionProps) {
  // Helper function to get image data from cover
  const getImageData = (cover: any, fallbackTitle: string = "Article") => {
    const coverData = getCoverImage(cover, fallbackTitle);
    return coverData
      ? {
          src: coverData.src,
          alt: coverData.alt,
          unoptimized: coverData.unoptimized,
        }
      : null;
  };

  // First 4 to center column
  const centerArticles = posts.slice(0, 4).map((post: any, index: number) => {
    const imageData = getImageData(post.cover, post.title || "Article image");
    return {
      id: post._id,
      title: post.title || "Untitled",
      author: post.author?.name || "Anonymous",
      coAuthor: "", // We'll use a single author for now
      thirdAuthor: undefined,
      image: imageData?.src || "/placeholder.svg",
      imageAlt: imageData?.alt || post.title || "Article image",
      imageUnoptimized: imageData?.unoptimized || false,
      imageSource: formatImageCredit(post.cover) || undefined,
      isMain: index === 0,
      slug: post.slug || "#",
    };
  });

  // Remaining 5 (of 9) to right column under Most Read block
  const mostReadArticles = posts.slice(4, 9).map((post: any, index: number) => {
    const imageData = getImageData(post.cover, post.title || "Article image");
    return {
      id: post._id,
      title: post.title || "Untitled",
      image: imageData?.src,
      imageAlt: imageData?.alt || post.title || "Article image",
      imageUnoptimized: imageData?.unoptimized || false,
      imageSource: formatImageCredit(post.cover) || undefined,
      hasImage: !!imageData,
      slug: post.slug || "#",
    };
  });

  return (
    <div className="">
      {/* Main container with three columns */}
      <div className="">
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
