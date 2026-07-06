import Link from "next/link";
import { cn } from "@/lib/utils";
import { getHomepageCoverImage } from "@/app/lib/homepage/homepage-cover-image";
import {
  techEditorialColumnClassName,
  techGridClassName,
  techMostReadColumnClassName,
} from "@/app/lib/homepage/tech-section-grid";
import { sectionLeadImageClassName } from "@/app/lib/homepage/section-grid-cells";
import {
  techCategoryLabel,
  techMainHeadline,
  techMainMeta,
  techSubHeadline,
} from "@/app/lib/typography/fourth-section";
import { formatReadTimeLabel } from "@/app/lib/typography/read-time";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";
import { ImageRenderer } from "../../ui/image-renderer";
import type {
  FourthSectionTechPost,
  HomepageFourthSectionData,
} from "@/app/lib/homepage-fourth-section";
import { MostReadFeed } from "./most-read-feed";

function TechColumnLead({ article }: { article: FourthSectionTechPost }) {
  if (!article.slug) return null;

  const coverData = getHomepageCoverImage(
    "sectionFeatured",
    article.cover as Parameters<typeof getHomepageCoverImage>[1],
    article.title || "Article image",
  );
  if (!coverData?.src) return null;

  return (
    <Link
      href={`/post/${article.slug}`}
      className="group block"
      aria-label={`Read article: ${article.title}`}
    >
      <div className={sectionLeadImageClassName("16/11")}>
        <ImageRenderer
          src={coverData.src}
          alt={coverData.alt}
          width={700}
          height={480}
          unoptimized={coverData.unoptimized}
          sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className="object-cover object-center"
          fill
        />
      </div>
      <h3 className={techMainHeadline}>{article.title}</h3>
      <p className={techMainMeta}>{formatReadTimeLabel(article.readTime)}</p>
    </Link>
  );
}

function TechColumnSub({ article }: { article: FourthSectionTechPost }) {
  if (!article.slug) return null;

  const coverData = getHomepageCoverImage(
    "sectionThumb",
    article.cover as Parameters<typeof getHomepageCoverImage>[1],
    article.title || "Article image",
  );

  return (
    <Link
      href={`/post/${article.slug}`}
      className={cn(
        "group divider-dashed mt-[26px] flex items-start justify-between gap-[18px] pt-6",
        "max-[520px]:border-angle-hairline max-[520px]:border-t max-[520px]:bg-none",
      )}
      aria-label={`Read article: ${article.title}`}
    >
      <div className="min-w-0 flex-1">
        <h3 className={techSubHeadline}>{article.title}</h3>
        <ReadTimeLabel
          minutes={article.readTime}
          variant="angle"
          className="mt-2.5"
        />
      </div>
      {coverData?.src ? (
        <div className="relative aspect-square h-[88px] w-[88px] shrink-0 overflow-hidden bg-angle-paper max-[520px]:h-[72px] max-[520px]:w-[72px]">
          <ImageRenderer
            src={coverData.src}
            alt={coverData.alt}
            width={88}
            height={88}
            fill
            unoptimized={coverData.unoptimized}
            sizes="(max-width: 520px) 72px, 88px"
            className="object-cover object-center"
          />
        </div>
      ) : null}
    </Link>
  );
}

function TechColumn({
  lead,
  subs,
}: {
  lead: FourthSectionTechPost;
  subs: FourthSectionTechPost[];
}) {
  return (
    <article className={techEditorialColumnClassName()}>
      <TechColumnLead article={lead} />
      {subs.map((article) => (
        <TechColumnSub key={article._id} article={article} />
      ))}
    </article>
  );
}

export type FourthSectionProps = HomepageFourthSectionData;

export default function FourthSection({
  category,
  featured,
  secondary,
  mostRead,
}: FourthSectionProps) {
  if (featured.length < 2) {
    return null;
  }

  return (
    <section aria-label={category.title}>
      <Link href={category.href} className={techCategoryLabel}>
        {category.title}
      </Link>

      <div className={techGridClassName()}>
        <TechColumn lead={featured[0]} subs={secondary.slice(0, 2)} />
        <TechColumn lead={featured[1]} subs={secondary.slice(2, 4)} />

        {mostRead.length > 0 ? (
          <div className={techMostReadColumnClassName()}>
            <MostReadFeed items={mostRead} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
