"use server";

import { draftMode } from "next/headers";

export async function disableDraftMode() {
  "use server";
  const draft = await draftMode();
  if (!draft.isEnabled) {
    return;
  }

  await Promise.allSettled([
    draft.disable(),
    // Simulate a delay to show the loading state
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]);
}
