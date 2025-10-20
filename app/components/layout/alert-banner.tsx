"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { disableDraftMode } from "../actions";

export default function AlertBanner() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [shouldShow, setShouldShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Check if we're in an iframe after hydration
      if (typeof window !== "undefined") {
        setShouldShow(window.top === window);
      }
    } catch (err) {
      console.error("AlertBanner error:", err);
      setError("Failed to initialize banner");
    }
  }, []);

  // If there's an error, don't render the banner
  if (error) return null;

  if (!shouldShow) return null;

  return (
    <div
      className={`${
        pending ? "animate-pulse" : ""
      } fixed top-0 left-0 z-50 w-full border-b bg-white/95 text-black backdrop-blur`}
    >
      <div className="py-2 text-center text-sm">
        {pending ? (
          "Disabling draft mode..."
        ) : (
          <>
            {"Previewing drafts. "}
            <button
              type="button"
              onClick={() => {
                try {
                  startTransition(() =>
                    disableDraftMode().then(() => {
                      if (router && typeof router.refresh === "function") {
                        router.refresh();
                      }
                    })
                  );
                } catch (err) {
                  console.error("Failed to disable draft mode:", err);
                }
              }}
              className="hover:text-cyan underline transition-colors duration-200"
            >
              Back to published
            </button>
          </>
        )}
      </div>
    </div>
  );
}
