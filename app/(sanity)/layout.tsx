import "../globals.css";

import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  variable: "--font-secondary",
  subsets: ["latin"],
  display: "swap",
});

export { metadata, viewport } from "next-sanity/studio";

// This layout completely overrides the root layout for Sanity Studio routes
export default function SanityStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <title>Sanity Studio</title>
      </head>
      <body className="min-h-screen">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
