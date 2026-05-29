import { LazyBackgroundVideo } from "@/app/components/ui/lazy-background-video";

interface VideoBannerProps {
  videoSrc: string;
  className?: string;
}

export default function VideoBanner({
  videoSrc,
  className = "",
}: VideoBannerProps) {
  return (
    <div
      className={`relative z-0 h-screen w-full overflow-hidden ${className}`}
    >
      <LazyBackgroundVideo
        videoSrc={videoSrc}
        loadStrategy="idle"
        posterPriority
      />

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
