import { Separator } from "@/app/components/ui/separator";
import { SectionHeader } from "@/app/components/ui/section-header";
import { MostReadItem } from "./MostReadItem";
import type { Article } from "./types";

interface MostReadSectionProps {
  articles: Article[];
}

export function MostReadSection({ articles }: MostReadSectionProps) {
  return (
    <section>
      <SectionHeader title="Most Read" variant="gradient" />
      <div className="space-y-6">
        {articles.map((article, index) => (
          <div key={article.id}>
            <MostReadItem article={article} index={index} isFirst={index === 0} />
            {index < articles.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}
      </div>
    </section>
  );
}
