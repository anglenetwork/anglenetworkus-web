import { LeftColumnLanding } from "./leftColumnLanding";
import { CenterColumnLanding } from "./centerColumnLanding";
import { RightColumnLanding } from "./rightColumnLanding";

interface Post {
  _id: string;
  title: string;
  slug: string | null;
  excerpt?: string | null;
  coverImage?: any;
  date: string;
  author?: {
    name: string;
    picture?: any;
  } | null;
  category?: {
    title: string | null;
    slug: string | null;
  } | null;
}

interface ValidPost extends Omit<Post, "slug" | "category"> {
  slug: string;
  category?: {
    title: string;
    slug: string;
  } | null;
}

interface MainFirstSectionProps {
  posts: Post[];
}

export function MainFirstSection({ posts }: MainFirstSectionProps) {
  // Filter out posts without slugs and organize posts for different sections
  const validPosts = posts.filter(
    (post): post is ValidPost =>
      !!post.slug &&
      (!post.category || (!!post.category.title && !!post.category.slug))
  );
  const mainStory = validPosts.slice(0, 2); // First 2 posts for main story section
  const moreTopHeadlines = validPosts.slice(2, 7); // Next 5 posts for more headlines
  const sideStories = validPosts.slice(7, 9); // Next 2 posts for side stories
  const mostRead = validPosts.slice(9, 14); // Next 5 posts for most read

  // Use first 6 posts for latest news section
  const latestNews = validPosts.slice(0, 8);

  return (
    <main className="w-full px-4 md:px-0 py-8">
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
