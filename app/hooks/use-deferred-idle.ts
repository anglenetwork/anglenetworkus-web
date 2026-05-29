"use client";

import { useEffect, useState } from "react";

function scheduleIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: 2500 });
    return () => window.cancelIdleCallback(id);
  }
  const t = window.setTimeout(callback, 1);
  return () => window.clearTimeout(t);
}

/** Runs `ready` after the browser is idle (or a short timeout fallback). */
export function useDeferredIdle(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    return scheduleIdle(() => setReady(true));
  }, []);

  return ready;
}
