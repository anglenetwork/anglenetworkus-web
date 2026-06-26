import { Separator } from "@/app/components/ui/separator";
import { SectionHeader } from "@/app/components/ui/section-header";
import { MostReadItem } from "./MostReadItem";
import type { Article } from "./types";

interface MostReadSectionProps {
  articles: Article[];
}

export function MostReadSection({ articles }: MostReadSectionProps) {
  if (articles.length === 0) return null;

  return (
    <section>
      <SectionHeader title="Most Read" accentStyle="modern" variant="news" />
      <div className="space-y-4 rounded-lg bg-black p-8 text-news-surface">
        {articles.map((article, index) => (
          <div key={article.id}>
            <MostReadItem
              article={article}
              index={index}
              isFirst={index === 0}
            />
            {index < articles.length - 1 && (
              <Separator className="mt-4 bg-white/30" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
