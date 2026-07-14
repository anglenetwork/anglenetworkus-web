import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface SuggestedTagsProps {
  tags: Array<{ name: string; slug: string }>;
}

export function SuggestedTags({ tags }: SuggestedTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 border-news-border border-t pt-6">
      <div className="mb-6">
        <div className="mb-4 flex items-center">
          {/* <div className="size-2 bg-news-primary rounded-full mr-2"></div> */}
          <h2 className="font-medium font-sans text-news-text text-sm uppercase tracking-wide">
            Suggested Topics
          </h2>
        </div>
        {/* <div className="border-t border-black mb-6"></div> */}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link key={tag.slug} href={`/tag/${tag.slug}`}>
            <Badge
              variant="secondary"
              className="cursor-pointer rounded-full border border-transparent bg-news-surface px-4 py-2 font-medium font-sans text-news-muted text-sm uppercase transition-colors hover:border-news-border hover:bg-news-border hover:text-black"
            >
              {tag.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
