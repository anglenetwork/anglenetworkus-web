import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionHeader } from "../../ui/section-header";
import { ImageRenderer } from "../../ui/image-renderer";
import {
  techExclusiveBadge,
  techFeaturedTitle,
  techSecondaryTitle,
} from "@/app/lib/typography/second-section-alternative";
import { ReadTimeLabel } from "@/app/components/ui/read-time-label";

type FeaturedArticle = {
  id: string;
  title: string;
  image: string;
  href: string;
  readTime?: number | null;
};

type SecondaryArticle = {
  id: string;
  title: string;
  image: string;
  href: string;
  isExclusive?: boolean;
  readTime?: number | null;
};

const DUMMY_TECH_SECTION = {
  category: "Tech",
  categoryHref: "/category/tech",
  featured: [
    {
      id: "featured-1",
      title: "It's nearly impossible for Meta AI to be stopped",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600&q=80",
      href: "#",
    },
    {
      id: "featured-2",
      title: "An exclusive look at the tech powering Cognition's coding agents",
      image:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&q=80",
      href: "#",
    },
    {
      id: "featured-3",
      title:
        "Inside the race to build the infrastructure powering the next wave of AI",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
      href: "#",
    },
  ] satisfies FeaturedArticle[],
  secondary: [
    {
      id: "secondary-1",
      title:
        "Salesforce CEO Marc Benioff tries to explain why his company needs Anthropic",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&q=80",
      href: "#",
      isExclusive: true,
    },
    {
      id: "secondary-2",
      title:
        "How Meta managed to look less evil than Apple and Google, for once",
      image:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&q=80",
      href: "#",
    },
    {
      id: "secondary-3",
      title:
        "Former Google CEO Eric Schmidt is very worried about America's AI race with China",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80",
      href: "#",
      isExclusive: true,
    },
    {
      id: "secondary-4",
      title: "The AI coding wars are over, a16z says",
      image:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1600&q=80",
      href: "#",
    },
    {
      id: "secondary-5",
      title:
        "OpenAI's latest model push has rivals scrambling to match enterprise demand",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&q=80",
      href: "#",
    },
    {
      id: "secondary-6",
      title:
        "Why chipmakers are betting billions on custom silicon for hyperscale AI",
      image:
        "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=1600&q=80",
      href: "#",
    },
  ] satisfies SecondaryArticle[],
} as const;

function FeaturedArticleCard({ article }: { article: FeaturedArticle }) {
  return (
    <article className="py-6 first:pt-0 last:pb-0 lg:px-6 lg:py-0">
      <Link
        href={article.href}
        className="group block"
        aria-label={`Read article: ${article.title}`}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-neutral-950">
          <ImageRenderer
            src={article.image}
            alt=""
            width={800}
            height={450}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover object-center"
          />
        </div>
      </Link>
      <Link href={article.href} className="group block">
        <h3 className={cn("mt-4", techFeaturedTitle)}>{article.title}</h3>
      </Link>
      <ReadTimeLabel minutes={article.readTime} />
    </article>
  );
}

function SecondaryArticleRow({ article }: { article: SecondaryArticle }) {
  return (
    <article
      className={cn(
        "py-6 lg:px-6",
        "lg:border-neutral-300 lg:border-l lg:border-dotted",
        "max-lg:border-neutral-300 max-lg:border-t max-lg:border-dotted",
        "max-lg:first:border-t-0",
        "lg:[&:nth-child(3n+1)]:border-l-0",
        "lg:[&:nth-child(n+4)]:border-t lg:[&:nth-child(n+4)]:border-dotted",
      )}
    >
      <Link
        href={article.href}
        className="group flex items-start gap-3"
        aria-label={`Read article: ${article.title}`}
      >
        <div className="min-w-0 flex-1 space-y-2">
          {article.isExclusive ? (
            <span className={techExclusiveBadge}>Exclusive</span>
          ) : null}
          <h3 className={techSecondaryTitle}>{article.title}</h3>
          <ReadTimeLabel minutes={article.readTime} />
        </div>
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-sm bg-neutral-950">
          <ImageRenderer
            src={article.image}
            alt=""
            width={112}
            height={80}
            fill
            unoptimized
            sizes="112px"
            className="object-cover object-center"
          />
        </div>
      </Link>
    </article>
  );
}

export default function SecondSectionAlternative() {
  const { category, categoryHref, featured, secondary } = DUMMY_TECH_SECTION;

  return (
    <section aria-label={category} className="rounded-lg bg-background">
      <SectionHeader
        title={category}
        href={categoryHref}
        accentStyle="modern"
      />

      <div className="grid grid-cols-1 divide-y divide-dotted divide-neutral-300 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {featured.map((article) => (
          <FeaturedArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 border-neutral-300 border-t border-dotted lg:grid-cols-3">
        {secondary.map((article) => (
          <SecondaryArticleRow key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
