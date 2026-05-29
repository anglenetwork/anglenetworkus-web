"use client";

import dynamic from "next/dynamic";

const AlertBanner = dynamic(() => import("./alert-banner"), { ssr: false });

const VisualEditingProvider = dynamic(
  () => import("../VisualEditingProvider"),
  { ssr: false },
);

/** Draft-only UI — keeps @sanity/visual-editing off public routes. */
export function DraftModeShell() {
  return (
    <>
      <AlertBanner />
      <VisualEditingProvider />
    </>
  );
}
