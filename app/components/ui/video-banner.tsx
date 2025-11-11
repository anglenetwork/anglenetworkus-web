"use client";

import { useState, useRef, useEffect } from "react";

interface VideoBannerProps {
  videoSrc: string;
  className?: string;
}

export function VideoBanner({ videoSrc, className = "" }: VideoBannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.error("Error playing video:", error);
      });
    }
  }, []);

  return (
    <div className={`relative w-full h-screen overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        onLoadedData={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-white">Loading video...</div>
        </div>
      )}
      <div className="absolute inset-0 bg-black bg-opacity-30" />
    </div>
  );
}
