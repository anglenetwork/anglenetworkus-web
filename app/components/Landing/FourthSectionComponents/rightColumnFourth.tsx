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
    <div className="pr-4 pl-6">
      <div className="sticky top-6">
        {/* Videos Section (replacing Most Read) */}
        <div className="mb-8">
          <SectionHeader
            title="Videos"
            variant="light"
            accentStyle="geometric-square"
            size="large"
          />

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

        <div className="mb-6 border-gray-300 border-t"></div>

        {/* Additional Section */}
        <div>
          <SectionHeader
            title="TRENDING"
            variant="light"
            accentStyle="geometric-square"
            size="large"
          />
          <div className="rounded border border-gray-200 p-2">
            <div className="text-center font-sans text-gray-600 text-sm">
              Trending content placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
