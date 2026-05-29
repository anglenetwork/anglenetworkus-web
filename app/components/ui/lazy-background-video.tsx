"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getPexelsVideoPosterUrl } from "@/lib/pexels-video";

export type LazyBackgroundVideoLoadStrategy =
  | "viewport"
  | "idle"
  | "viewport-or-idle";

interface LazyBackgroundVideoProps {
  videoSrc: string;
  posterSrc?: string;
  /** Applied to the <video> element (e.g. object-cover positioning). */
  className?: string;
  /** When to attach the MP4 source. */
  loadStrategy?: LazyBackgroundVideoLoadStrategy;
  /** Prioritize poster fetch (above-the-fold heroes). */
  posterPriority?: boolean;
  onVideoFailed?: () => void;
}

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function StaticBackdrop() {
  return (
    <div
      className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black"
      aria-hidden
    />
  );
}

function scheduleIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: 2500 });
    return () => window.cancelIdleCallback(id);
  }
  const t = window.setTimeout(callback, 1);
  return () => window.clearTimeout(t);
}

export function LazyBackgroundVideo({
  videoSrc,
  posterSrc,
  className = "absolute top-0 left-0 size-full object-cover",
  loadStrategy = "viewport",
  posterPriority = false,
  onVideoFailed,
}: LazyBackgroundVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [videoFailed, setVideoFailed] = useState(false);
  const [attachedSrc, setAttachedSrc] = useState<string | null>(null);

  const poster = posterSrc ?? getPexelsVideoPosterUrl(videoSrc) ?? undefined;
  const showVideo = !reduceMotion && !videoFailed && attachedSrc;

  useEffect(() => {
    if (reduceMotion || videoFailed) return;

    let cancelled = false;
    const attach = () => {
      if (!cancelled) setAttachedSrc(videoSrc);
    };

    if (loadStrategy === "idle") {
      return scheduleIdle(attach);
    }

    const cleanups: Array<() => void> = [];

    if (loadStrategy === "viewport" || loadStrategy === "viewport-or-idle") {
      const el = containerRef.current;
      if (el) {
        const io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              attach();
              io.disconnect();
            }
          },
          { rootMargin: "200px" },
        );
        io.observe(el);
        cleanups.push(() => io.disconnect());
      }

      if (loadStrategy === "viewport-or-idle") {
        cleanups.push(scheduleIdle(attach));
      }
    }

    return () => {
      cancelled = true;
      for (const fn of cleanups) fn();
    };
  }, [loadStrategy, reduceMotion, videoFailed, videoSrc]);

  useEffect(() => {
    if (!attachedSrc || !videoRef.current) return;
    void videoRef.current.play().catch(() => {
      /* autoplay may be blocked until user gesture */
    });
  }, [attachedSrc]);

  const handleVideoError = () => {
    setVideoFailed(true);
    onVideoFailed?.();
  };

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden>
      <StaticBackdrop />
      {poster ? (
        <Image
          src={poster}
          alt=""
          fill
          sizes="100vw"
          priority={posterPriority}
          className={`${className} ${showVideo ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        />
      ) : null}
      {!reduceMotion && !videoFailed ? (
        <video
          ref={videoRef}
          preload="none"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden
          className={`${className} ${showVideo ? "opacity-100" : "opacity-0"}`}
          src={attachedSrc ?? undefined}
          onError={handleVideoError}
        />
      ) : null}
    </div>
  );
}
