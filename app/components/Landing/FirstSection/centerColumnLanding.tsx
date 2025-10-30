import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: any;
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
  return (
    <div className="lg:border-r border-gray-300 lg:px-8">
      <div className="flex items-center mb-4">
        <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
        <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider font-secondary">
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
                <h1 className="text-3xl md:text-3xl lg:text-5xl font-semibold md:font-bold text-gray-900 leading-tight mb-4 font-sans text-start">
                  {post.title}
                </h1>
              </Link>

              {post.coverImage &&
                (() => {
                  const imageUrl = urlForImage(post.coverImage);
                  if (!imageUrl) return null;
                  return (
                    <Link href={`/post/${post.slug}`}>
                      <div className="mb-8">
                        <Image
                          src={imageUrl.url()}
                          alt={post.title}
                          width={800}
                          height={400}
                          className="w-full h-80 md:h-[500px] object-cover rounded-xl"
                        />
                      </div>
                    </Link>
                  );
                })()}
            </>
          ) : (
            <div className="flex gap-4 md:grid md:grid-cols-5 md:gap-8 md:items-start">
              <div className="flex-shrink-0 md:col-span-3 md:order-2">
                {post.coverImage &&
                  (() => {
                    const imageUrl = urlForImage(post.coverImage);
                    if (!imageUrl) return null;
                    return (
                      <Link href={`/post/${post.slug}`}>
                        <Image
                          src={imageUrl.url()}
                          alt={post.title}
                          width={600}
                          height={256}
                          className="w-32 h-24 md:w-full md:h-64 object-cover rounded-xl"
                        />
                      </Link>
                    );
                  })()}
              </div>
              <div className="flex-1 md:col-span-2 md:order-1">
                <Link
                  href={`/post/${post.slug}`}
                  className="hover:text-red-600"
                >
                  <h3 className="text-lg md:text-2xl font-medium md:font-semibold text-neutral-900 leading-tight mb-2 md:mb-4 font-sans">
                    {post.title}
                  </h3>
                </Link>
              </div>
            </div>
          )}
        </article>
      ))}

      <div className="border-b border-gray-300 mb-4"></div>

      <div className="flex items-center mb-6">
        <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
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
              {post.coverImage &&
                (() => {
                  const imageUrl = urlForImage(post.coverImage);
                  if (!imageUrl) return null;
                  return (
                    <Link href={`/post/${post.slug}`}>
                      <div className="flex-shrink-0 mb-0 md:mb-4">
                        <Image
                          src={imageUrl.url()}
                          alt={post.title}
                          width={400}
                          height={192}
                          className="w-24 h-20 md:w-full md:h-48 object-cover rounded-xl"
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
                  <h3 className="text-sm md:text-xl font-sans font-medium md:font-medium text-neutral-900 tracking-wide leading-snug mb-2">
                    {post.title}
                  </h3>
                </Link>
                {/* {post.author && (
                  <p className="text-xs text-neutral-400 font-sans font-light">
                    By{" "}
                    <span className="font-semibold text-neutral-500">
                      {post.author.name}
                    </span>
                  </p>
                )} */}
              </div>
            </article>
          ))}
        </div>

        {/* Second row: 3 smaller stories (mobile layout unified with first row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {moreTopHeadlines.slice(2, 5).map((post) => (
            <article key={post._id} className="flex gap-4 md:block">
              {post.coverImage &&
                (() => {
                  const imageUrl = urlForImage(post.coverImage);
                  if (!imageUrl) return null;
                  return (
                    <Link href={`/post/${post.slug}`}>
                      <div className="flex-shrink-0 mb-0 md:mb-3">
                        <Image
                          src={imageUrl.url()}
                          alt={post.title}
                          width={300}
                          height={128}
                          className="w-24 h-20 md:w-full md:h-32 object-cover rounded-xl"
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
                  <h3 className="text-sm md:text-base font-sans font-medium md:font-medium text-neutral-900 tracking-wide leading-tight mb-2">
                    {post.title}
                  </h3>
                </Link>
                {/* {post.author && (
                  <p className="text-xs text-neutral-400 font-sans font-light">
                    By{" "}
                    <span className="font-semibold text-neutral-500">
                      {post.author.name}
                    </span>
                  </p>
                )} */}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
