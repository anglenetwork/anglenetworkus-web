import { LeftColumnLanding } from "./left-column-landing";
import { HOMEPAGE_JUST_IN_LIMIT } from "@/app/lib/homepage/first-section";
import { CenterColumnLanding } from "./centerColumnLanding";
import { RightColumnLanding } from "./rightColumnLanding";
import { MobileFrontLanding } from "./mobile-front-landing";
import Link from "next/link";
import { leadHeadlineTitle } from "@/app/lib/typography/first-section";

interface Post {
  _id: string;
  title: string;
  slug: string | null;
  excerpt?: string | null;
  readTime?: number | null;
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
  readTime?: number | null;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
    caption?: string | null;
    creditAuthor?: string | null;
    creditSource?: string | null;
  } | null;
}

interface FirstSectionProps {
  justInNews: Post[];
  mainStory: Post[];
  relatedCategoryPosts: Post[];
  moreTopHeadlines: Post[];
  sideStories: Post[];
  compactSideStories: Post[];
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
    readTime: post.readTime ?? null,
    cover: post.cover,
  };
}

export function FirstSection({
  justInNews,
  mainStory,
  relatedCategoryPosts,
  moreTopHeadlines,
  sideStories,
  compactSideStories,
}: FirstSectionProps) {
  const leftColumnJustIn = justInNews
    .filter((post): post is PostForLeftColumn => !!post.slug)
    .slice(0, HOMEPAGE_JUST_IN_LIMIT);

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
    .slice(0, 2);

  const rightColumnSideStories = sideStories
    .map(toRightColumnPost)
    .filter((post): post is PostForRightColumn => post !== null)
    .slice(0, 2);

  const rightColumnCompactStories = compactSideStories
    .map(toRightColumnPost)
    .filter((post): post is PostForRightColumn => post !== null)
    .slice(0, 2);

  const mainStoryPost = mainStoryPosts[0];
  const rawMainStory = mainStory.find((post) => post.slug) ?? null;

  const mobileMoreTopHeadlines = moreTopHeadlines
    .filter((post): post is PostForLeftColumn => !!post.slug)
    .slice(0, 2);

  return (
    <main className="w-full">
      <MobileFrontLanding
        className="lg:hidden"
        mainStory={
          rawMainStory?.slug
            ? {
                _id: rawMainStory._id,
                title: rawMainStory.title,
                slug: rawMainStory.slug,
                excerpt: rawMainStory.excerpt,
                readTime: rawMainStory.readTime,
                category: rawMainStory.category,
                cover: rawMainStory.cover,
              }
            : null
        }
        moreTopHeadlines={mobileMoreTopHeadlines}
        justInNews={leftColumnJustIn}
        sideStories={rightColumnSideStories}
        compactStories={rightColumnCompactStories}
      />

      <div className="hidden lg:block">
        {mainStoryPost?.title && mainStoryPost?.slug && (
          <header className="border-angle-ink border-b lg:pt-8 lg:pb-6 xl:pt-8 xl:pb-6">
            <Link href={`/post/${mainStoryPost.slug}`} className="group block">
              <h1 className={leadHeadlineTitle}>{mainStoryPost.title}</h1>
            </Link>
          </header>
        )}
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-[1fr_2.05fr_1fr]">
          <div className="border-angle-hairline border-b lg:border-r lg:border-b-0">
            <LeftColumnLanding justInNews={leftColumnJustIn} />
          </div>
          <div className="border-angle-hairline border-b lg:border-r lg:border-b-0">
            <CenterColumnLanding
              mainStory={mainStoryPosts}
              relatedCategoryPosts={relatedPosts}
              moreTopHeadlines={moreTopHeadlinePosts}
            />
          </div>
          <div>
            <RightColumnLanding
              sideStories={rightColumnSideStories}
              compactStories={rightColumnCompactStories}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
