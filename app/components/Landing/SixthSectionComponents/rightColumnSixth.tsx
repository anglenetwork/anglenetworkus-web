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
    <div className="pl-6 pr-4">
      <div className="sticky top-6">
        {/* Videos Section (replacing Most Read) */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
            <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider font-outfit">
              Videos
            </h2>
          </div>
          <div className="border-t border-black mb-4"></div>

          <div className="space-y-4">
            {videosData.map((video, index) => (
              <div
                key={index}
                className={
                  index === 0 ? "flex gap-3" : "border-l-2 border-red-500 pl-3"
                }
              >
                {index === 0 && (
                  <Image
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={`Video thumbnail ${video.number}`}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <span className="text-red-500 font-bold text-sm mr-2 font-outfit">
                    {video.number}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900 leading-tight font-outfit">
                    {video.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
