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
      className={`relative w-full h-screen overflow-hidden z-0 ${className}`}
    >
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
