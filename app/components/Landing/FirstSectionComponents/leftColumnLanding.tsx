import Link from "next/link";

interface Post {
  _id: string;
  title: string;
  slug: string;
}

interface LeftColumnLandingProps {
  latestNews: Post[];
}

export function LeftColumnLanding({ latestNews }: LeftColumnLandingProps) {
  return (
    <div className="lg:border-r border-neutral-300 lg:sticky lg:top-20 lg:h-[calc(100vh-180px)] lg:overflow-hidden text-left px-0 md:px-4">
      <div className="flex items-center justify-start mb-4">
        <div className="w-2 h-2 bg-red-600 rounded-full mr-3"></div>
        <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider font-outfit">
          Latest News
        </h2>
      </div>

      <div className="border-b border-neutral-300 mb-6"></div>

      <div className="space-y-6">
        {latestNews.map((post, index) => (
          <article
            key={post._id}
            className={`${index < latestNews.length - 1 ? "border-b border-neutral-200" : ""} pb-4`}
          >
            <Link href={`/post/${post.slug}`} className="hover:text-red-600">
              <h3 className="text-neutral-900 leading-snug mb-2 font-outfit text-base line-clamp-2 font-semibold tracking-normal">
                {post.title}
              </h3>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
