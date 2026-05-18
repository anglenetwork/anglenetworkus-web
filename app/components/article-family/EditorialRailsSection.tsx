import Link from "next/link";
import { formatDistanceToNow, parseISO } from "date-fns";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import { opinionListQuery } from "@/sanity/lib/article-family-queries";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";
import { getCoverImage, urlForImage } from "@/sanity/lib/utils";
import { ImageRenderer } from "@/app/components/ui/image-renderer";
import type { ArticleFamilyCard } from "@/app/lib/article-family/types";

function relativeTime(publishedAt: string | null): string {
  if (!publishedAt) return "";
  try {
    return formatDistanceToNow(parseISO(publishedAt), { addSuffix: true });
  } catch {
    return "";
  }
}

function authorAvatarUrl(picture: unknown): string | null {
  if (!picture) return null;
  try {
    const url = urlForImage(picture as Parameters<typeof urlForImage>[0]);
    return url ? url.width(56).height(56).fit("crop").url() : null;
  } catch {
    return null;
  }
}

function OpinionCard({ article }: { article: ArticleFamilyCard }) {
  const coverData = getCoverImage(
    article.cover as Parameters<typeof getCoverImage>[0],
    article.title || "Article image",
  );
  const avatarUrl = authorAvatarUrl(article.author?.picture);
  const timeAgo = relativeTime(article.publishedAt);
  const authorName = article.author?.name ?? "Editorial";
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    // Outer card: image fills the full background; white panel floats over the lower-left
    <article className="relative h-[460px] overflow-hidden rounded-2xl bg-black">
      {/* Full-bleed background image */}
      {coverData?.src && (
        <ImageRenderer
          src={coverData.src}
          alt={coverData.alt}
          fill
          unoptimized={coverData.unoptimized}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
      )}

      {/* White floating card — overlaid in the lower-left */}
      <div className="absolute bottom-5 left-5 flex w-[57%] flex-col justify-start gap-6 rounded-2xl bg-white p-6 border-2 border-neutral-900">
        {/* Headline */}
        <Link href={article.href} className="group">
          <h3 className="font-sans text-2xl md:text-4xl font-bold leading-[1.08] tracking-tight text-neutral-900 group-hover:underline">
            {article.title}
          </h3>
        </Link>

        {/* Author row */}
        <div className="flex items-center gap-2">
          {avatarUrl ? (
            <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full bg-neutral-200">
              <ImageRenderer
                src={avatarUrl}
                alt={authorName}
                width={32}
                height={32}
                fill
                unoptimized={false}
                sizes="32px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white">
              {authorInitial}
            </div>
          )}
          <span className="font-sans text-sm font-semibold text-neutral-900 leading-none">
            by {authorName}
          </span>
          {/* {timeAgo && (
            <>
              <span className="text-neutral-300 leading-none select-none">·</span>
              <span className="font-sans text-sm text-neutral-500 leading-none">
                {timeAgo}
              </span>
            </>
          )} */}
        </div>
      </div>
    </article>
  );
}

export default async function EditorialRailsSection() {
  const opinionRaw = await sanityFetchStatic({
    query: opinionListQuery,
    params: { limit: 2 },
  });

  const articles = (opinionRaw as unknown[])
    .map((r) => normalizeArticleFamilyCard(r))
    .filter((x): x is NonNullable<typeof x> => x != null)
    .slice(0, 2);

  if (articles.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 font-sans text-base font-bold uppercase tracking-wide text-foreground">
        Opinion
      </h2>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {articles.map((article) => (
          <OpinionCard key={article._id} article={article} />
        ))}
      </div>
    </section>
  );
}
