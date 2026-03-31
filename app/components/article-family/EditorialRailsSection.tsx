import { sanityFetchStatic } from "@/sanity/lib/fetch";
import {
  opinionListQuery,
  analysisListQuery,
} from "@/sanity/lib/article-family-queries";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";
import ArticleFamilyCard from "./ArticleFamilyCard";

export default async function EditorialRailsSection() {
  const [opinionRaw, analysisRaw] = await Promise.all([
    sanityFetchStatic({
      query: opinionListQuery,
      params: { limit: 4 },
    }),
    sanityFetchStatic({
      query: analysisListQuery,
      params: { limit: 4 },
    }),
  ]);

  const opinion = (opinionRaw as unknown[])
    .map((r) => normalizeArticleFamilyCard(r))
    .filter((x): x is NonNullable<typeof x> => x != null);
  const analysis = (analysisRaw as unknown[])
    .map((r) => normalizeArticleFamilyCard(r))
    .filter((x): x is NonNullable<typeof x> => x != null);

  const opinionStories = [...opinion, ...analysis].slice(0, 6);

  return (
    <section className="px-4 md:px-0">
      <h2 className="mb-4 font-sans text-base font-bold uppercase tracking-wide text-foreground">
        Opinion
      </h2>
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {opinionStories.map((article) => (
          <ArticleFamilyCard
            key={article._id}
            article={article}
            layout="rail"
            kickerMode="editorial"
            showDate={false}
          />
        ))}
      </div>
    </section>
  );
}
