import Image from "next/image";
import { SectionHeader } from "../../ui/section-header";

interface VideoData {
  thumbnail: string;
  title: string;
  number: number;
}

interface RightColumnFourthProps {
  videosData: VideoData[];
}

export function RightColumnFourth({ videosData }: RightColumnFourthProps) {
  return (
    <div className="pl-6 pr-4">
      <div className="sticky top-6">
        {/* Videos Section (replacing Most Read) */}
        <div className="mb-8">
          <SectionHeader title="Videos" variant="gradient" />

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
                    className="w-16 h-16 object-cover rounded-sm flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <span className="text-red-500 font-bold text-sm mr-2 font-sans">
                    {video.number}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 leading-tight font-sans">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-300 mb-6"></div>

        {/* Additional Section */}
        <div>
          <SectionHeader title="TRENDING" variant="gradient" />
          <div className="p-2 border border-gray-200 rounded">
            <div className="text-sm text-gray-600 text-center font-sans">
              Trending content placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
