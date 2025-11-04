import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import { PlayCircle } from "lucide-react";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string;
    image?: any;
    alt?: string;
  };
  author?: {
    name: string;
    picture?: any;
  } | null;
}

interface CenterColumnLandingProps {
  mainStory: Post[];
  moreTopHeadlines: Post[];
}

export function CenterColumnLanding({
  mainStory,
  moreTopHeadlines,
}: CenterColumnLandingProps) {
  const getCover = (
    post: Post
  ): { src: string | null; alt: string; unoptimized: boolean } => {
    // 1) External URL
    if (post.cover?.source === "external" && post.cover?.externalUrl) {
      return {
        src: post.cover.externalUrl,
        alt: post.cover.alt || post.title,
        unoptimized: true, // unless domain is whitelisted in next.config
      };
    }
    // 2) New asset image
    if (post.cover?.source === "asset" && post.cover?.image) {
      const b = urlForImage(post.cover.image);
      if (b) {
        return {
          src: b.url(),
          alt: post.cover.alt || post.cover.image?.alt || post.title,
          unoptimized: false,
        };
      }
    }
    return { src: null, alt: post.title, unoptimized: false };
  };

  return (
    <div className="lg:border-r border-gray-300 lg:px-8">
      <div className="flex items-center mb-4">
        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
        <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider font-sans">
          Top News
        </h2>
      </div>

      <div className="border-b border-gray-300 mb-6"></div>

      {/* Main Story */}
      {mainStory.map((post, index) => (
        <article key={post._id} className="mb-8">
          {index === 0 ? (
            <>
              <Link href={`/post/${post.slug}`} className="hover:text-red-600">
                <h1 className="text-3xl md:text-3xl lg:text-5xl font-semibold text-gray-900 leading-tight mb-4 font-sans text-start md:text-center">
                  {post.title}
                </h1>
              </Link>

              {(() => {
                const { src, alt, unoptimized } = getCover(post);
                if (!src) return null;
                return (
                  <Link href={`/post/${post.slug}`}>
                    <div className="mb-8">
                      <Image
                        src={src}
                        alt={alt}
                        width={800}
                        height={400}
                        unoptimized={unoptimized}
                        className="w-full h-80 md:h-[500px] object-cover rounded-sm"
                      />
                    </div>
                  </Link>
                );
              })()}
            </>
          ) : (
            // <div className="flex gap-4 md:grid md:grid-cols-5 md:gap-8 md:items-start">
            //   <div className="flex-shrink-0 md:col-span-3 md:order-2">
            //     {(() => {
            //       const { src, alt, unoptimized } = getCover(post);
            //       if (!src) return null;
            //       return (
            //         <Link href={`/post/${post.slug}`}>
            //           <Image
            //             src={src}
            //             alt={alt}
            //             width={600}
            //             height={256}
            //             unoptimized={unoptimized}
            //             className="w-32 h-24 md:w-full md:h-64 object-cover rounded-sm"
            //           />
            //         </Link>
            //       );
            //     })()}
            //   </div>
            //   <div className="flex-1 md:col-span-2 md:order-1">
            //     <Link
            //       href={`/post/${post.slug}`}
            //       className="hover:text-red-600"
            //     >
            //       <h3 className="text-xl md:text-3xl font-medium text-neutral-900 leading-tight mb-2 md:mb-4 font-sans">
            //         {post.title}
            //       </h3>
            //     </Link>
            //   </div>
            // </div>
            <main className=" bg-white">
              <div className="mx-auto max-w-5xl px-6 py-4">
                {/* Live Updates Section */}
                <article className="border-b border-gray-200 pb-8 font-sans">
                  <h1 className="text-xl font-medium leading-tight text-balance">
                    <span className="text-red-600">Live Updates:</span>{" "}
                    <span className="text-black">
                      Voting underway in races that pose early test of Trump
                      presidency
                    </span>
                  </h1>
                </article>

                {/* Analysis Section 1 */}
                <article className="border-b border-gray-200 py-8 font-sans">
                  <h2 className="text-xl font-medium leading-tight text-balance">
                    <span className="text-black">Analysis:</span>{" "}
                    <span className="text-black">
                      5 big questions about Election Day
                    </span>
                  </h2>
                </article>

                {/* Video Section */}
                <article className="border-b border-gray-200 py-8 font-sans">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-medium leading-tight text-balance flex-1">
                      New Yorkers share who they voted for mayor on Election Day
                    </h2>
                  </div>
                </article>
              </div>
            </main>
          )}
        </article>
      ))}

      <div className="border-b border-gray-300 mb-4"></div>

      <div className="flex items-center mb-6">
        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
        <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider font-sans">
          More Top Headlines
        </h2>
      </div>

      {/* MORE TOP HEADLINES */}
      {/* Mobile spacing normalized; desktop untouched */}
      <div className="space-y-6 md:space-y-8 mb-8 md:mb-0">
        {/* First row: 2 main stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {moreTopHeadlines.slice(0, 2).map((post) => (
            <article key={post._id} className="flex gap-4 md:block">
              {(() => {
                const { src, alt, unoptimized } = getCover(post);
                if (!src) return null;
                return (
                  <Link href={`/post/${post.slug}`}>
                    <div className="flex-shrink-0 mb-0 md:mb-4">
                      <Image
                        src={src}
                        alt={alt}
                        width={400}
                        height={192}
                        unoptimized={unoptimized}
                        className="w-24 h-20 md:w-full md:h-48 object-cover rounded-sm"
                      />
                    </div>
                  </Link>
                );
              })()}
              <div className="flex-1 md:block">
                <Link
                  href={`/post/${post.slug}`}
                  className="hover:text-red-600"
                >
                  <h3 className="text-sm md:text-xl font-sans font-medium text-neutral-900 tracking-wide leading-normal mb-2">
                    {post.title}
                  </h3>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Second row: 3 smaller stories (mobile layout unified with first row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {moreTopHeadlines.slice(2, 5).map((post) => (
            <article key={post._id} className="flex gap-4 md:block">
              {(() => {
                const { src, alt, unoptimized } = getCover(post);
                if (!src) return null;
                return (
                  <Link href={`/post/${post.slug}`}>
                    <div className="flex-shrink-0 mb-0 md:mb-3">
                      <Image
                        src={src}
                        alt={alt}
                        width={300}
                        height={128}
                        unoptimized={unoptimized}
                        className="w-24 h-20 md:w-full md:h-32 object-cover rounded-sm"
                      />
                    </div>
                  </Link>
                );
              })()}
              <div className="flex-1 md:block">
                <Link
                  href={`/post/${post.slug}`}
                  className="hover:text-red-600"
                >
                  <h3 className="text-sm md:text-base font-sans font-medium text-neutral-900 tracking-wide leading-normal mb-2">
                    {post.title}
                  </h3>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
