import { LeftColumnLanding } from "./left-column-landing";
import { CenterColumnLanding } from "./centerColumnLanding";
import { RightColumnLanding } from "./rightColumnLanding";
import Link from "next/link";
import { mainHeadlineDesktopTitle } from "@/app/lib/typography/first-section";

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
    caption?: string | null;
    creditAuthor?: string | null;
    creditSource?: string | null;
  } | null;
  imageGallery?: Array<{
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
    caption?: string | null;
    creditAuthor?: string | null;
    creditSource?: string | null;
  }> | null;
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
  breakingNews?: boolean | null;
  developingStory?: boolean | null;
  mainHeadline?: boolean | null;
  frontline?: boolean | null;
  rightHeadline?: boolean | null;
}

interface PostForLeftColumn extends Post {
  slug: string;
}

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
    caption?: string | null;
    creditAuthor?: string | null;
    creditSource?: string | null;
  };
  author?: {
    name: string;
    picture?: any;
  } | null;
}

interface PostForRightColumn {
  _id: string;
  title: string;
  slug: string;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
    caption?: string | null;
    creditAuthor?: string | null;
    creditSource?: string | null;
  } | null;
  author?: {
    name: string;
    picture?: any;
  } | null;
}

interface FirstSectionProps {
  justInNews: Post[];
  mainStory: Post[];
  relatedCategoryPosts: Post[];
  moreTopHeadlines: Post[];
  sideStories: Post[];
  mostReadPosts: Post[];
}

function toCenterColumnPost(post: Post): PostForCenterColumn | null {
  if (!post.slug) return null;
  return {
    _id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    cover:
      post.cover && typeof post.cover === "object"
        ? {
            source: post.cover.source,
            externalUrl: post.cover.externalUrl ?? undefined,
            image: post.cover.image,
            alt: post.cover.alt ?? undefined,
            caption: post.cover.caption ?? undefined,
            creditAuthor: post.cover.creditAuthor ?? undefined,
            creditSource: post.cover.creditSource ?? undefined,
          }
        : undefined,
    author: post.author,
  };
}

function toRightColumnPost(post: Post): PostForRightColumn | null {
  if (!post.slug) return null;
  return {
    _id: post._id,
    title: post.title,
    slug: post.slug,
    cover: post.cover,
    author: post.author,
  };
}

export function FirstSection({
  justInNews,
  mainStory,
  relatedCategoryPosts,
  moreTopHeadlines,
  sideStories,
  mostReadPosts,
}: FirstSectionProps) {
  const leftColumnJustIn = justInNews
    .filter((post): post is PostForLeftColumn => !!post.slug)
    .slice(0, 5);

  const mainStoryPosts = mainStory
    .map(toCenterColumnPost)
    .filter((post): post is PostForCenterColumn => post !== null)
    .slice(0, 1);

  const relatedPosts = relatedCategoryPosts
    .map(toCenterColumnPost)
    .filter((post): post is PostForCenterColumn => post !== null)
    .slice(0, 3);

  const moreTopHeadlinePosts = moreTopHeadlines
    .map(toCenterColumnPost)
    .filter((post): post is PostForCenterColumn => post !== null)
    .slice(0, 5);

  const rightColumnSideStories = sideStories
    .map(toRightColumnPost)
    .filter((post): post is PostForRightColumn => post !== null)
    .slice(0, 2);

  const mostRead = mostReadPosts
    .filter(
      (post) =>
        !!post.slug &&
        (!post.category || (!!post.category.title && !!post.category.slug)),
    )
    .map(
      (post): PostForRightColumn => ({
        _id: post._id,
        title: post.title,
        slug: post.slug!,
        cover: post.cover,
        author: post.author,
      }),
    )
    .slice(0, 5);

  const mainStoryPost = mainStoryPosts[0];

  return (
    <main className="w-full">
      {mainStoryPost?.title && mainStoryPost?.slug && (
        <div className="mb-6 hidden lg:block">
          <Link
            href={`/post/${mainStoryPost.slug}`}
            className="block hover:text-red-600"
          >
            <h1 className={mainHeadlineDesktopTitle}>{mainStoryPost.title}</h1>
          </Link>
        </div>
      )}
      {/* Mobile order: Center, Left, Right */}
      {/* Desktop order: Left, Center, Right */}
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-24">
        <div className="order-2 lg:order-1 lg:col-span-6">
          <LeftColumnLanding justInNews={leftColumnJustIn} />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-12">
          <CenterColumnLanding
            mainStory={mainStoryPosts}
            relatedCategoryPosts={relatedPosts}
            moreTopHeadlines={moreTopHeadlinePosts}
          />
        </div>
        <div className="order-3 lg:order-3 lg:col-span-6">
          <RightColumnLanding
            sideStories={rightColumnSideStories}
            mostRead={mostRead}
          />
        </div>
      </div>
    </main>
  );
}
