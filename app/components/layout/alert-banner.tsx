"use client";

import { useSyncExternalStore } from "react";

function getTopWindowSnapshot(): boolean {
  try {
    return window.top === window;
  } catch {
    return false;
  }
}

function getTopWindowServerSnapshot(): boolean {
  return false;
}

function subscribeTopWindow(_onStoreChange: () => void) {
  return () => {};
}

export default function AlertBanner() {
  const shouldShow = useSyncExternalStore(
    subscribeTopWindow,
    getTopWindowSnapshot,
    getTopWindowServerSnapshot,
  );

  if (!shouldShow) return null;

  return (
    <div className="fixed top-0 left-0 z-50 w-full border-b bg-white/95 text-black backdrop-blur">
      <div className="py-2 text-center text-sm">
        {"Previewing drafts. "}
        <a
          href="/api/draft-mode/disable"
          className="underline transition-colors duration-200 hover:text-cyan"
        >
          Back to published
        </a>
      </div>
    </div>
  );
}
