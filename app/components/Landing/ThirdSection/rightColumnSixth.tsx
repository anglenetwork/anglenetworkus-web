import Image from "next/image";

interface VideoData {
  thumbnail: string;
  title: string;
  number: number;
}

interface RightColumnSixthProps {
  videosData: VideoData[];
}

export function RightColumnSixth({ videosData }: RightColumnSixthProps) {
  return (
    <div className="pr-4 pl-6">
      <div className="sticky top-6">
        {/* Videos Section (replacing Most Read) */}
        <div className="mb-8">
          <div className="mb-4 flex items-center">
            <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
            <h2 className="font-medium font-sans text-neutral-900 text-xs uppercase tracking-wider">
              Videos
            </h2>
          </div>
          <div className="mb-4 border-black border-t"></div>

          <div className="space-y-4">
            {videosData.map((video, index) => (
              <div
                key={index}
                className={
                  index === 0 ? "flex gap-3" : "border-red-500 border-l-2 pl-3"
                }
              >
                {index === 0 && (
                  <Image
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={`Video thumbnail ${video.number}`}
                    width={64}
                    height={64}
                    className="h-16 w-16 flex-shrink-0 rounded-sm object-cover"
                  />
                )}
                <div className="flex-1">
                  <span className="mr-2 font-bold font-sans text-red-500 text-sm">
                    {video.number}
                  </span>
                  <h3 className="font-sans font-semibold text-gray-900 text-sm leading-tight">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
