import { SectionHeader } from "@/app/components/ui/section-header";
import { getCoverImage } from "@/sanity/lib/utils";
import { TagFeaturedArticle } from "./TagFeaturedArticle";
import { TagNewsItem } from "./TagNewsItem";

export interface TagMainPost {
  _id: string;
  title?: string | null;
  slug?: string | null;
  href: string;
  cover?: {
    source?: "asset" | "external";
    externalUrl?: string | null;
    image?: any;
    alt?: string | null;
  } | null;
  readTime?: number | null;
}

interface TagMainSectionProps {
  tagTitle: string;
  featuredPost: TagMainPost;
  sidebarPosts: TagMainPost[];
}

export function TagMainSection({
  tagTitle,
  featuredPost,
  sidebarPosts,
}: TagMainSectionProps) {
  const featuredCover = getCoverImage(
    featuredPost.cover,
    featuredPost.title || "Featured article",
  );

  return (
    <section>
      <SectionHeader title={tagTitle} accentStyle="modern" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-10">
        <div className="min-w-0">
          <TagFeaturedArticle
            image={featuredCover?.src || ""}
            imageAlt={
              featuredCover?.alt || featuredPost.title || "Featured article"
            }
            imageUnoptimized={featuredCover?.unoptimized}
            title={featuredPost.title || "Untitled"}
            slug={featuredPost.slug || "#"}
            href={featuredPost.href}
            readTimeMinutes={featuredPost.readTime}
          />
        </div>

        {sidebarPosts.length > 0 ? (
          <aside className="min-w-0">
            <div className="flex flex-col divide-y divide-dotted divide-neutral-300">
              {sidebarPosts.map((post, index) => {
                const coverData = getCoverImage(
                  post.cover,
                  post.title || "Untitled",
                );
                return (
                  <div
                    key={post._id}
                    className={
                      index === 0
                        ? "pb-4"
                        : index === sidebarPosts.length - 1
                          ? "pt-4"
                          : "py-4"
                    }
                  >
                    <TagNewsItem
                      image={coverData?.src || "/placeholder.svg"}
                      imageAlt={coverData?.alt || post.title || "Untitled"}
                      imageUnoptimized={coverData?.unoptimized}
                      title={post.title || "Untitled"}
                      readTimeMinutes={post.readTime}
                      slug={post.slug || "#"}
                      href={post.href}
                    />
                  </div>
                );
              })}
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
