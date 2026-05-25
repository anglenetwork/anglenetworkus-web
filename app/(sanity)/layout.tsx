import "../globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";

export { metadata, viewport } from "next-sanity/studio";

// This layout completely overrides the root layout for Sanity Studio routes
export default function SanityStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Sanity Studio</title>
      </head>
      <body className="min-h-screen" suppressHydrationWarning>
        {children}
        {(process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL) && (
          <SpeedInsights />
        )}
      </body>
    </html>
  );
}
