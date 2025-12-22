"use client";

import dynamic from "next/dynamic";
import config from "@/sanity.config";

// Dynamically import NextStudio with SSR disabled to avoid hydration mismatches
// with styled-components class names
const NextStudio = dynamic(
  () => import("next-sanity/studio").then((mod) => mod.NextStudio),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading Sanity Studio...</div>
      </div>
    ),
  }
);

export default function StudioClient() {
  return <NextStudio config={config} />;
}

