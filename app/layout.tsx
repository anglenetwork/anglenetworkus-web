import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Suspense } from "react";
import {
  VisualEditing,
  toPlainText,
  type PortableTextBlock,
} from "next-sanity";
import { draftMode } from "next/headers";
import { Inter, Outfit } from "next/font/google";

import { AlertBanner, ContentLayoutWrapper } from "./components/layout";

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

// Configure Google Fonts
const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-secondary",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
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
        ${inter.variable}
        ${outfit.variable}
      `}
      >
        <section className="min-h-screen">
          {isDraftMode && (
            <Suspense fallback={null}>
              <AlertBanner />
            </Suspense>
          )}
          <ContentLayoutWrapper>
            <main className="border-2 border-blue-500">{children}</main>
          </ContentLayoutWrapper>
        </section>
        {isDraftMode && <VisualEditing />}
        <SpeedInsights />
      </body>
    </html>
  );
}
