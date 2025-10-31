import { LeftColumnFourth } from "./leftColumnFourth";
import { CenterColumnFourthSection } from "./CenterColumnFourthSection";
import { RightColumnFourth } from "./rightColumnFourth";
import { FourthSectionQueryResult } from "@/sanity.types";
import { getCoverImage } from "@/sanity/lib/utils";

interface MainFourthSectionProps {
  posts: FourthSectionQueryResult;
  categoryTitle: string;
  categorySlug?: string;
}

const videosData = [
  {
    thumbnail:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop",
    title:
      "'My Life Became a Living Hell': One Woman's Career in Delta Force, the Army's Most Elite Unit",
    number: 1,
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop",
    title:
      "Good government group backtracks amid redistricting fight, won't oppose efforts 'counterbalancing' Texas",
    number: 2,
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop",
    title: "Sherrod Brown to run for Senate",
    number: 3,
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop",
    title:
      "Trump-backed judge rules administration's withholding of funds illegal",
    number: 4,
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop",
    title:
      "Paxton urges Texas judge to jail Beto O'Rourke over fundraising related to redistricting fight",
    number: 5,
  },
];

export default function MainFourthSection({
  posts,
  categoryTitle,
  categorySlug,
}: MainFourthSectionProps) {
  // Helper function to get image data from cover
  const getImageData = (cover: any, fallbackTitle: string = "Article") => {
    const coverData = getCoverImage(cover, fallbackTitle);
    return coverData?.src || "/placeholder.svg";
  };

  // Transform posts data into the format expected by CenterColumnFourthSection
  const newsSectionData = {
    section: categoryTitle,
    mainStory: posts[0]
      ? {
          image: getImageData(posts[0].cover, posts[0].title || "Untitled"),
          title: posts[0].title || "Untitled",
          authors: posts[0].author ? [posts[0].author.name] : ["Anonymous"],
          slug: posts[0].slug || "#",
        }
      : {
          image: "/placeholder.svg",
          title: "No articles available",
          authors: ["No Author"],
          slug: "#",
        },
    extraStories: posts.slice(1, 4).map((post) => ({
      image: getImageData(post.cover, post.title || "Untitled"),
      title: post.title || "Untitled",
      authors: post.author ? [post.author.name] : ["Anonymous"],
      slug: post.slug || "#",
    })),
  };

  return (
    <div className="min-h-screen">
      {/* Main container with three columns */}
      <div className="py-8">
        <div className="grid grid-cols-12 gap-0">
          {/* Mobile order: Center, Left, Right */}
          {/* Desktop order: Left, Center, Right */}
          <div className="col-span-12 md:col-span-3 md:order-1 order-2">
            <LeftColumnFourth />
          </div>
          <div className="col-span-12 md:col-span-6 md:order-2 order-1">
            <CenterColumnFourthSection
              data={newsSectionData}
              categoryTitle={categoryTitle}
              categorySlug={
                categorySlug || posts[0]?.category?.slug || undefined
              }
            />
          </div>
          <div className="col-span-12 md:col-span-3 md:order-3 order-3">
            <RightColumnFourth videosData={videosData} />
          </div>
        </div>
      </div>
      {/* <div className="border-t border-gray-300 py-4"></div> */}
    </div>
  );
}
