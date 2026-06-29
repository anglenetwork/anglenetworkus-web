import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Suspense } from "react";
import { toPlainText, type PortableTextBlock } from "next-sanity";
import { draftMode, headers } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { sansFont } from "@/app/lib/fonts/sans";

import { SiteShell } from "./components/layout/site-shell";
import { DraftModeShell } from "./components/layout/draft-mode-shell";
import { SanityLive } from "@/sanity/lib/fetch";

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { finalizePublicMetadata } from "@/app/lib/seo/metadata-builders";
import { getPublicSiteUrl } from "@/app/lib/seo/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = new URL(getPublicSiteUrl());
  } catch {
    try {
      metadataBase = settings?.ogImage?.metadataBase
        ? new URL(settings.ogImage.metadataBase)
        : undefined;
    } catch {
      // ignore
    }
  }
  return finalizePublicMetadata({
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  });
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isStudioRoute = pathname.startsWith("/studio");

  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS Feed"
          href="/feed.xml"
        />
      </head>
      <body className={sansFont.variable}>
        <section className="min-h-screen">
          {isDraftMode && !isStudioRoute && (
            <Suspense fallback={null}>
              <DraftModeShell />
              <VisualEditing />
            </Suspense>
          )}
          {isStudioRoute ? (
            children
          ) : (
            <SiteShell>
              <main className="">{children}</main>
            </SiteShell>
          )}
        </section>

        {!isStudioRoute ? <SpeedInsights /> : null}
        {!isStudioRoute && <SanityLive />}
      </body>
    </html>
  );
}
