import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Suspense } from "react";
import { toPlainText, type PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { Libre_Franklin, Newsreader } from "next/font/google";

import { AlertBanner, SiteShell } from "./components/layout";
import { SessionProviderWrapper } from "./components/SessionProviderWrapper";
import { VisualEditingProvider } from "./components/VisualEditingProvider";
import { SupabaseAuthProvider } from "@/app/providers/SupabaseAuthProvider";

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { getPublicSiteUrl } from "@/app/lib/seo/site-url";

// Primary UI sans (Tailwind `font-sans`) and article body serif (Tailwind `font-body`).
// Weights match in-app usage.
const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

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
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en">
      <head>
        {/* Preconnect to critical image CDNs for faster LCP */}
        <link
          rel="preconnect"
          href="https://images.pexels.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
      </head>
      <body className={`${libreFranklin.variable} ${newsreader.variable}`}>
        <SupabaseAuthProvider>
          <SessionProviderWrapper>
            <section className="min-h-screen">
              {isDraftMode && (
                <Suspense fallback={null}>
                  <AlertBanner />
                </Suspense>
              )}
              <SiteShell>
                <main className="">{children}</main>
              </SiteShell>
            </section>

            {isDraftMode && <VisualEditingProvider />}

            {(process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL) && (
              <SpeedInsights />
            )}
          </SessionProviderWrapper>
        </SupabaseAuthProvider>
      </body>
    </html>
  );
}
