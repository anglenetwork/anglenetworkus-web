import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/app/lib/seo/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getPublicSiteUrl().replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api/", "/myprofile", "/logineditor"],
    },
    sitemap: [`${base}/sitemap.xml`, `${base}/news-sitemap.xml`],
  };
}
