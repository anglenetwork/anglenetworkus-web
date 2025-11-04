import { LeftColumnLanding } from "./leftColumnLanding";
import { CenterColumnLanding } from "./centerColumnLanding";
import { RightColumnLanding } from "./rightColumnLanding";

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
  labels?: string[] | null;
}

// Type for LeftColumnLanding - only needs slug
interface PostForLeftColumn {
  _id: string;
  title: string;
  slug: string;
}

// Type for CenterColumnLanding - needs slug and cover (optional, not nullable)
interface PostForCenterColumn {
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

// Type for RightColumnLanding - needs slug and cover (nullable)
interface PostForRightColumn {
  _id: string;
  title: string;
  slug: string;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
  } | null;
  author?: {
    name: string;
    picture?: any;
  } | null;
}

interface MainFirstSectionProps {
  posts: Post[];
  mostReadPosts: Post[];
}

export function MainFirstSection({
  posts,
  mostReadPosts,
}: MainFirstSectionProps) {
  // Filter and type posts for LeftColumnLanding (needs slug, cover, and labels for first article)
  const validPostsForLeft = posts
    .filter((post) => !!post.slug)
    .map((post) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug!,
      cover: post.cover,
      labels: post.labels,
    }));
  const latestNews = validPostsForLeft.slice(0, 4);

  // Filter and type posts for CenterColumnLanding (needs slug and cover as optional, not null)
  const validPostsForCenter = posts
    .filter((post) => !!post.slug)
    .map(
      (post): PostForCenterColumn => ({
        _id: post._id,
        title: post.title,
        slug: post.slug!,
        excerpt: post.excerpt,
        cover:
          post.cover && typeof post.cover === "object"
            ? {
                source: post.cover.source,
                externalUrl: post.cover.externalUrl ?? undefined,
                image: post.cover.image,
                alt: post.cover.alt ?? undefined,
              }
            : undefined,
        author: post.author,
      })
    );
  const mainStory = validPostsForCenter.slice(0, 2);
  const moreTopHeadlines = validPostsForCenter.slice(2, 7);

  // Filter and type posts for RightColumnLanding (needs slug and cover nullable)
  const validPostsForRight = posts
    .filter(
      (post) =>
        !!post.slug &&
        (!post.category || (!!post.category.title && !!post.category.slug))
    )
    .map((post) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug!,
      cover: post.cover,
      author: post.author,
    })) as PostForRightColumn[];
  const sideStories = validPostsForRight.slice(7, 9);

  // Filter most read posts
  const validMostReadPosts = mostReadPosts
    .filter(
      (post) =>
        !!post.slug &&
        (!post.category || (!!post.category.title && !!post.category.slug))
    )
    .map((post) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug!,
      cover: post.cover,
      author: post.author,
    })) as PostForRightColumn[];
  const mostRead = validMostReadPosts.slice(0, 5);

  return (
    <main className="w-full px-4 md:px-0 pt-8">
      {/* Mobile order: Center, Left, Right */}
      {/* Desktop order: Left, Center, Right */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
        <div className="lg:col-span-1 lg:order-1 order-2">
          <LeftColumnLanding latestNews={latestNews} />
        </div>
        <div className="lg:col-span-3 lg:order-2 order-1">
          <CenterColumnLanding
            mainStory={mainStory}
            moreTopHeadlines={moreTopHeadlines}
          />
        </div>
        <div className="lg:col-span-1 lg:order-3 order-3">
          <RightColumnLanding sideStories={sideStories} mostRead={mostRead} />
        </div>
      </div>

      {/* <div className="border-b border-gray-300 mt-12"></div> */}
    </main>
  );
}
