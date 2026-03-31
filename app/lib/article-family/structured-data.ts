import type { ArticleFamily } from "./types";
import {
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  type BreadcrumbItem,
} from "@/app/lib/seo/json-ld";
import { buildPublisherJsonLd } from "@/app/lib/seo/publisher";
import { getPublicSiteUrl } from "@/app/lib/seo/site-url";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import type { SiteSettingsForSeo } from "@/app/lib/seo/metadata-builders";
import { resolveSiteName } from "@/app/lib/seo/metadata-builders";

export function getArticleBreadcrumbItems(article: ArticleFamily): BreadcrumbItem[] {
  const home: BreadcrumbItem = { name: "Home", path: "/" };
  switch (article._type) {
    case "post":
      if (article.category?.slug && article.category.title) {
        return [
          home,
          {
            name: article.category.title,
            path: `/category/${article.category.slug}`,
          },
          { name: article.title, path: article.href },
        ];
      }
      return [home, { name: article.title, path: article.href }];
    case "opinion":
      return [
        home,
        { name: "Opinion", path: "/opinion" },
        { name: article.title, path: article.href },
      ];
    case "analysis":
      return [
        home,
        { name: "Analysis", path: "/analysis" },
        { name: article.title, path: article.href },
      ];
    case "sponsored":
      return [
        home,
        { name: "Sponsored", path: "/sponsored" },
        { name: article.title, path: article.href },
      ];
    default:
      return [home, { name: article.title, path: article.href }];
  }
}

export function buildPublisherForJsonLd(
  settings: SiteSettingsForSeo | null | undefined,
  demoTitle: string
) {
  const siteUrl = getPublicSiteUrl();
  const siteName = resolveSiteName(settings, demoTitle);
  const og = resolveOpenGraphImage(
    settings?.ogImage as Parameters<typeof resolveOpenGraphImage>[0]
  );
  return buildPublisherJsonLd({
    siteName,
    siteUrl,
    logoUrl: og?.url ?? null,
  });
}

export function jsonLdScriptContent(data: Record<string, unknown>): string {
  return JSON.stringify(data);
}

export function buildArticlePageJsonLd(args: {
  article: ArticleFamily;
  settings: SiteSettingsForSeo | null | undefined;
  demoTitle: string;
}): { article: Record<string, unknown>; breadcrumb: Record<string, unknown> } {
  const publisher = buildPublisherForJsonLd(args.settings, args.demoTitle);
  const articleLd = buildArticleJsonLd(args.article, { publisher });
  const breadcrumbLd = buildBreadcrumbJsonLd(
    getArticleBreadcrumbItems(args.article)
  );
  return { article: articleLd, breadcrumb: breadcrumbLd };
}
