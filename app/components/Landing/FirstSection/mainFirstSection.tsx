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
    creditProvider?: string | null;
    creditAuthor?: string | null;
    creditSourceUrl?: string | null;
    creditLicense?: string | null;
  } | null;
  date: string;
  publishedAt?: string | null;
  author?: {
    name: string;
    picture?: any;
  } | null;
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
  labels?: string[] | null;
  justIn?: boolean | null;
  justInRank?: number | null;
  justInUntil?: string | null;
  breakingNews?: boolean | null;
  developingStory?: boolean | null;
  mainHeadline?: boolean | null;
  mainHeadlineRank?: number | null;
  mainHeadlineUntil?: string | null;
  frontline?: boolean | null;
  frontRank?: number | null;
  frontUntil?: string | null;
  rightHeadline?: boolean | null;
  rightHeadlineRank?: number | null;
  rightHeadlineUntil?: string | null;
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
    creditProvider?: string | null;
    creditAuthor?: string | null;
    creditSourceUrl?: string | null;
    creditLicense?: string | null;
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
    creditProvider?: string | null;
    creditAuthor?: string | null;
    creditSourceUrl?: string | null;
    creditLicense?: string | null;
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
  // Filter and type posts for LeftColumnLanding (needs slug, cover, breakingNews, developingStory for justIn articles)
  // Just In: articles with justIn === true, sorted by justInRank (higher first), filtered by justInUntil
  const now = new Date();
  const validPostsForLeft = posts
    .filter((post) => {
      if (!post.slug || post.justIn !== true) return false;
      // Filter out expired articles (justInUntil is in the past)
      // justInUntil is always present for justIn articles, so we can check it directly
      const justInUntilDate = new Date(post.justInUntil!);
      if (justInUntilDate < now) return false;
      return true;
    })
    .sort((a, b) => {
      // Sort by justInRank descending (higher rank first), then by date descending
      const rankA = a.justInRank ?? 0;
      const rankB = b.justInRank ?? 0;
      if (rankA !== rankB) {
        return rankB - rankA;
      }
      // If ranks are equal, sort by date
      const dateA = a.publishedAt || a.date;
      const dateB = b.publishedAt || b.date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .map((post) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug!,
      cover: post.cover,
      breakingNews: post.breakingNews,
      developingStory: post.developingStory,
    }));
  const latestNews = validPostsForLeft.slice(0, 4);

  // Filter and type posts for CenterColumnLanding
  // Main story: articles with mainHeadline === true, sorted by mainHeadlineRank (higher first), filtered by mainHeadlineUntil
  const mainHeadlinePostsFiltered = posts
    .filter((post) => {
      if (!post.slug || post.mainHeadline !== true) return false;
      // Filter out expired articles (mainHeadlineUntil is in the past)
      // mainHeadlineUntil is always present for mainHeadline articles, so we can check it directly
      const mainHeadlineUntilDate = new Date(post.mainHeadlineUntil!);
      if (mainHeadlineUntilDate < now) return false;
      return true;
    })
    .sort((a, b) => {
      // Sort by mainHeadlineRank descending (higher rank first), then by date descending
      const rankA = a.mainHeadlineRank ?? 0;
      const rankB = b.mainHeadlineRank ?? 0;
      if (rankA !== rankB) {
        return rankB - rankA;
      }
      // If ranks are equal, sort by date
      const dateA = a.publishedAt || a.date;
      const dateB = b.publishedAt || b.date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  const mainStoryPost = mainHeadlinePostsFiltered[0];
  const mainStoryCategorySlug = mainStoryPost?.category?.slug;
  const mainStoryId = mainStoryPost?._id;

  const mainHeadlinePosts = mainHeadlinePostsFiltered.map(
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
              creditProvider: post.cover.creditProvider ?? undefined,
              creditAuthor: post.cover.creditAuthor ?? undefined,
              creditSourceUrl: post.cover.creditSourceUrl ?? undefined,
              creditLicense: post.cover.creditLicense ?? undefined,
            }
          : undefined,
      author: post.author,
    })
  );
  const mainStory = mainHeadlinePosts.slice(0, 1);

  // Get related category posts: 3 latest articles from the same category as mainStory (excluding mainStory itself)

  const relatedCategoryPosts = mainStoryCategorySlug
    ? posts
        .filter((post) => {
          // Must have slug, same category, and not be the mainStory itself
          return (
            !!post.slug &&
            post.category?.slug === mainStoryCategorySlug &&
            post._id !== mainStoryId
          );
        })
        .sort((a, b) => {
          // Sort by publishedAt or date descending (latest first)
          const dateA = a.publishedAt || a.date;
          const dateB = b.publishedAt || b.date;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        })
        .slice(0, 3)
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
                    creditProvider: post.cover.creditProvider ?? undefined,
                    creditAuthor: post.cover.creditAuthor ?? undefined,
                    creditSourceUrl: post.cover.creditSourceUrl ?? undefined,
                    creditLicense: post.cover.creditLicense ?? undefined,
                  }
                : undefined,
            author: post.author,
          })
        )
    : [];

  // More top headlines: articles with frontline === true, sorted by frontRank (higher first), filtered by frontUntil
  const frontlinePosts = posts
    .filter((post) => {
      if (!post.slug || post.frontline !== true) return false;
      // Filter out expired articles (frontUntil is in the past)
      // frontUntil is always present for frontline articles, so we can check it directly
      const frontUntilDate = new Date(post.frontUntil!);
      if (frontUntilDate < now) return false;
      return true;
    })
    .sort((a, b) => {
      // Sort by frontRank descending (higher rank first), then by date descending
      const rankA = a.frontRank ?? 0;
      const rankB = b.frontRank ?? 0;
      if (rankA !== rankB) {
        return rankB - rankA;
      }
      // If ranks are equal, sort by date
      const dateA = a.publishedAt || a.date;
      const dateB = b.publishedAt || b.date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
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
                creditProvider: post.cover.creditProvider ?? undefined,
                creditAuthor: post.cover.creditAuthor ?? undefined,
                creditSourceUrl: post.cover.creditSourceUrl ?? undefined,
                creditLicense: post.cover.creditLicense ?? undefined,
              }
            : undefined,
        author: post.author,
      })
    );
  const moreTopHeadlines = frontlinePosts.slice(0, 5);

  // Filter and type posts for RightColumnLanding (articles with rightHeadline === true, sorted by rightHeadlineRank (higher first), filtered by rightHeadlineUntil)
  const validPostsForRight = posts
    .filter((post) => {
      if (!post.slug || post.rightHeadline !== true) return false;
      // Filter out expired articles (rightHeadlineUntil is in the past)
      // rightHeadlineUntil is always present for rightHeadline articles, so we can check it directly
      const rightHeadlineUntilDate = new Date(post.rightHeadlineUntil!);
      if (rightHeadlineUntilDate < now) return false;
      return true;
    })
    .sort((a, b) => {
      // Sort by rightHeadlineRank descending (higher rank first), then by date descending
      const rankA = a.rightHeadlineRank ?? 0;
      const rankB = b.rightHeadlineRank ?? 0;
      if (rankA !== rankB) {
        return rankB - rankA;
      }
      // If ranks are equal, sort by date
      const dateA = a.publishedAt || a.date;
      const dateB = b.publishedAt || b.date;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .map((post) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug!,
      cover: post.cover,
      author: post.author,
    })) as PostForRightColumn[];
  const sideStories = validPostsForRight.slice(0, 2);

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
    <main className="w-full px-4 md:px-0 pt-4">
      {/* Mobile order: Center, Left, Right */}
      {/* Desktop order: Left, Center, Right */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-0">
        <div className="lg:col-span-2 lg:order-1 order-2">
          <LeftColumnLanding latestNews={latestNews} />
        </div>
        <div className="lg:col-span-6 lg:order-2 order-1">
          <CenterColumnLanding
            mainStory={mainStory}
            relatedCategoryPosts={relatedCategoryPosts}
            moreTopHeadlines={moreTopHeadlines}
          />
        </div>
        <div className="lg:col-span-2 lg:order-3 order-3">
          <RightColumnLanding sideStories={sideStories} mostRead={mostRead} />
        </div>
      </div>

      {/* <div className="border-b border-gray-300 mt-12"></div> */}
    </main>
  );
}
