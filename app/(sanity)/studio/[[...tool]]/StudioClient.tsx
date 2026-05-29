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
        <div className="text-lg">Loading Sanity Studio…</div>
      </div>
    ),
  },
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
        type="button"
        onClick={handleSignOut}
        className="fixed bottom-16 left-4 z-50 rounded-md bg-red-600 px-4 py-2 font-medium font-sans text-sm text-white shadow-lg transition-colors hover:bg-red-700"
        aria-label="Sign out"
      >
        Sign Out
      </button>
      <NextStudio config={config} />
    </div>
  );
}
