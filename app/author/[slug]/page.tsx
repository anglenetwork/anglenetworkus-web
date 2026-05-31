import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { toPlainText, type PortableTextBlock } from "next-sanity";
import ArticleFamilyCard from "@/app/components/article-family/ArticleFamilyCard";
import { SitePageWidth } from "@/app/components/layout/site-page-width";
import { normalizeArticleFamilyCard } from "@/app/lib/article-family/normalize";
import type { ArticleFamilyCard as ArticleFamilyCardData } from "@/app/lib/article-family/types";
import { JsonLdScript } from "@/app/components/seo/json-ld-script";
import { getCachedSettings } from "@/app/lib/cached-settings";
import {
  buildAuthorPageMetadata,
  finalizePublicMetadata,
} from "@/app/lib/seo/metadata-builders";
import {
  buildAuthorSameAsUrls,
  buildBreadcrumbJsonLd,
  buildPersonJsonLd,
} from "@/app/lib/seo/json-ld";
import { getPublicSiteUrl } from "@/app/lib/seo/site-url";
import * as demo from "@/sanity/lib/demo";
import { sanityFetchStatic } from "@/sanity/lib/fetch";
import { authorPageQuery } from "@/sanity/lib/article-family-queries";
import { authorSlugsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await sanityFetchStatic({ query: authorSlugsQuery });
  return (slugs as (string | null)[])
    .filter((slug): slug is string => slug != null)
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [author, settings] = await Promise.all([
    sanityFetchStatic({ query: authorPageQuery, params: { slug } }),
    getCachedSettings(),
  ]);
  if (!author?.name) {
    return { title: "Author Not Found" };
  }
  return finalizePublicMetadata(
    buildAuthorPageMetadata({
      authorName: author.name,
      shortBio: author.shortBio,
      settings,
      demoTitle: demo.title,
      slug,
    }),
  );
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await sanityFetchStatic({
    query: authorPageQuery,
    params: { slug },
  });
  if (!author?.name || !author.slug) {
    notFound();
  }

  const siteUrl = getPublicSiteUrl();
  const bioPlain = author.bio
    ? toPlainText(author.bio as PortableTextBlock[]).trim()
    : "";
  const description = author.shortBio?.trim() || bioPlain || undefined;

  const rawArticles: unknown[] = Array.isArray(author.articles)
    ? author.articles
    : [];
  const articles = rawArticles
    .map((raw) => normalizeArticleFamilyCard(raw))
    .filter((a): a is ArticleFamilyCardData => a != null);

  const sameAs = buildAuthorSameAsUrls({
    website: author.website,
    twitter: author.twitter,
    linkedin: author.linkedin,
    instagram: author.instagram,
  });

  const personLd = buildPersonJsonLd({
    name: author.name,
    slug: author.slug,
    siteUrl,
    sameAs,
  });

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: author.name, path: `/author/${author.slug}` },
  ]);

  return (
    <>
      <JsonLdScript data={personLd} />
      <JsonLdScript data={breadcrumbLd} />
      <SitePageWidth variant="narrow" className="py-10 md:py-14">
        <header className="mb-10 border-neutral-200 border-b pb-6">
          <h1 className="font-bold font-sans text-3xl text-neutral-900 md:text-4xl">
            {author.name}
          </h1>
          {author.title ? (
            <p className="mt-1 font-sans text-neutral-600 text-sm md:text-base">
              {author.title}
            </p>
          ) : null}
          {description ? (
            <p className="mt-4 font-sans text-neutral-700 text-sm leading-relaxed md:text-base">
              {description}
            </p>
          ) : null}
        </header>

        {articles.length === 0 ? (
          <p className="py-12 text-center font-sans text-neutral-600">
            No published articles yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article, i) => (
              <ArticleFamilyCard
                key={article._id}
                article={article}
                layout={i === 0 ? "large" : "compact"}
              />
            ))}
          </div>
        )}
      </SitePageWidth>
    </>
  );
}
