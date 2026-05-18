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
          <h2 className="text-sm font-medium text-neutral-900 uppercase tracking-wide font-sans">
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
              className="cursor-pointer rounded-full border border-transparent bg-sectionAccent/10 px-4 py-2 font-sans text-sm font-medium uppercase text-sectionAccent hover:text-black transition-colors hover:border-sectionAccent hover:bg-sectionAccent/20"
            >
              {tag.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
