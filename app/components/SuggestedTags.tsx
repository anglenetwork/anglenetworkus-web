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
    <div className="mt-8 pt-6 border-t border-neutral-200">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          {/* <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div> */}
          <h2 className="text-sm font-medium text-neutral-900 uppercase tracking-wide font-outfit">
            Suggested Topics
          </h2>
        </div>
        {/* <div className="border-t border-black mb-6"></div> */}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Link key={index} href={`/tag/${tag.slug}`}>
            <Badge
              variant="secondary"
              className="font-inter uppercase bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 text-sm font-medium rounded-full border-0 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 cursor-pointer transition-colors"
            >
              {tag.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
