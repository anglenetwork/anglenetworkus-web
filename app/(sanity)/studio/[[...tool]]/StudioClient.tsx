"use client";

import dynamic from "next/dynamic";
import { signOut } from "next-auth/react";
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
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/logineditor",
      redirect: true,
    });
  };

  return (
    <div className="relative">
      {/* Sign Out Button - Fixed position in top right */}
      <button
        onClick={handleSignOut}
        className="fixed bottom-16 left-4 z-50 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow-lg transition-colors font-sans"
        aria-label="Sign out"
      >
        Sign Out
      </button>
      <NextStudio config={config} />
    </div>
  );
}
