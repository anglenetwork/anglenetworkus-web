"use client";

import dynamic from "next/dynamic";

const AlertBanner = dynamic(() => import("./alert-banner"), { ssr: false });

/** Draft-only UI — keeps draft banner off public routes. */
export function DraftModeShell() {
  return <AlertBanner />;
}
