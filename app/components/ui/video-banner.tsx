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
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
      />

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
