import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Suspense } from "react";
import { toPlainText, type PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { Inter, DM_Sans, Spectral } from "next/font/google";

import { AlertBanner, ContentLayoutWrapper } from "./components/layout";
import { SessionProviderWrapper } from "./components/SessionProviderWrapper";
import { VisualEditingProvider } from "./components/VisualEditingProvider";

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

// Configure Google Fonts - optimized to only load weights actually used
// Using subset optimization and font-display swap to prevent render blocking
// All fonts set to preload: false to reduce render blocking - they'll load with display: swap
const interTight = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Only weights actually used
  variable: "--font-secondary",
  display: "swap",
  preload: false, // Defer to reduce render blocking
  adjustFontFallback: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"], // Only weights actually used
  variable: "--font-sans",
  display: "swap",
  preload: false, // Defer to reduce render blocking - main font but loads with swap
  adjustFontFallback: true,
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // Only weights actually used
  variable: "--font-serif",
  display: "swap",
  preload: false, // Less critical, can load later
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
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
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
  const data = await sanityFetch({ query: settingsQuery });
  const footer = data?.footer || [];
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en">
      <body
        className={`
        ${interTight.variable}
        ${dmSans.variable}
        ${spectral.variable}
      `}
      >
        <SessionProviderWrapper>
          <section className="min-h-screen">
            {isDraftMode && (
              <Suspense fallback={null}>
                <AlertBanner />
              </Suspense>
            )}
            <ContentLayoutWrapper>
              <main className="">{children}</main>
            </ContentLayoutWrapper>
          </section>

          {isDraftMode && <VisualEditingProvider />}

          {(process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL) && (
            <SpeedInsights />
          )}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
