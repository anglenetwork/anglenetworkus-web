import { SitePageWidth } from "@/app/components/layout/site-page-width";
import { getCoverImage } from "@/sanity/lib/utils";
import { TagHeroFeatured } from "./TagHeroFeatured";
import { TagSidebarFeatureItem } from "./TagSidebarFeatureItem";
import { TagSidebarMiniItem } from "./TagSidebarMiniItem";
import { formatTagItemNumber, type TagPost } from "./types";

interface TagHeroGridProps {
  featuredPost: TagPost;
  sidebarPosts: TagPost[];
  /** 1-based index offset for sidebar numbering (default 1 → items 01–03). */
  sidebarNumberOffset?: number;
}

function toTagPost(post: TagPost, fallbackAlt: string): TagPost {
  const coverData = getCoverImage(
    post.cover as Parameters<typeof getCoverImage>[0],
    fallbackAlt,
  );
  return {
    ...post,
    imageUrl: coverData?.src,
    imageAlt: coverData?.alt,
    imageUnoptimized: coverData?.unoptimized,
  };
}

export function TagHeroGrid({
  featuredPost,
  sidebarPosts,
  sidebarNumberOffset = 1,
}: TagHeroGridProps) {
  const hero = toTagPost(
    featuredPost,
    featuredPost.title || "Featured article",
  );
  const sidebar = sidebarPosts.map((post) =>
    toTagPost(post, post.title || "Untitled"),
  );

  return (
    <section className="bg-news-surface">
      <SitePageWidth>
        <div className="border-news-border border-b xl:hidden">
          <div className="pt-[18px] pb-5 sm:border-news-border sm:border-b sm:pt-12 sm:pb-14">
            <TagHeroFeatured post={hero} />
          </div>
          {sidebar.length > 0 ? (
            <div className="pt-0 pb-10 sm:pt-0">
              {sidebar.map((post, index) => {
                const number = formatTagItemNumber(
                  sidebarNumberOffset - 1 + index,
                );
                if (index === 0) {
                  return (
                    <TagSidebarFeatureItem
                      key={post._id}
                      post={post}
                      number={number}
                    />
                  );
                }
                return (
                  <TagSidebarMiniItem
                    key={post._id}
                    post={post}
                    number={number}
                  />
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="hidden grid-cols-[1.7fr_1fr] divide-x divide-news-border border-news-border border-b xl:grid">
          <div className="min-w-0 pt-12 pr-12 pb-14">
            <TagHeroFeatured post={hero} />
          </div>
          {sidebar.length > 0 ? (
            <aside className="min-w-0 pt-12 pb-10 pl-12">
              {sidebar.map((post, index) => {
                const number = formatTagItemNumber(
                  sidebarNumberOffset - 1 + index,
                );
                if (index === 0) {
                  return (
                    <TagSidebarFeatureItem
                      key={post._id}
                      post={post}
                      number={number}
                    />
                  );
                }
                return (
                  <TagSidebarMiniItem
                    key={post._id}
                    post={post}
                    number={number}
                  />
                );
              })}
            </aside>
          ) : null}
        </div>
      </SitePageWidth>
    </section>
  );
}
