import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "../../ui/section-header";

interface Story {
  image: string;
  imageSource?: string;
  title: string;
  authors: string[];
  slug: string;
}

interface NewsSection {
  section: string;
  mainStory: Story;
  extraStories: Story[];
}

interface NewsSectionProps {
  data: NewsSection;
  categoryTitle: string;
  categorySlug?: string;
}

export function CenterColumnFourthSection({
  data,
  categoryTitle,
  categorySlug,
}: NewsSectionProps) {
  return (
    <div className="border-r border-gray-200 px-6">
      {/* News Section */}
      <div className="mb-8">
        <SectionHeader
          title={categoryTitle}
          variant="gradient"
          href={categorySlug ? `/category/${categorySlug}` : undefined}
        />

        {/* Main Article */}
        <div className="mb-6">
          <Link href={`/post/${data.mainStory.slug}`}>
            <div className="relative mb-4">
              <Image
                src={data.mainStory.image || "/placeholder.svg"}
                alt={data.mainStory.title}
                width={800}
                height={320}
                className="w-full h-80 object-cover rounded-sm cursor-pointer hover:opacity-90 transition-opacity"
              />
              {data.mainStory.imageSource && (
                <div className="absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded font-secondary">
                  {data.mainStory.imageSource}
                </div>
              )}
            </div>
          </Link>
          <Link href={`/post/${data.mainStory.slug}`}>
            <h1 className="text-3xl font-semibold text-gray-900 mb-3 font-sans cursor-pointer hover:text-gray-700 transition-colors">
              {data.mainStory.title}
            </h1>
          </Link>
        </div>

        {/* Extra Stories */}
        {data.extraStories.map((story, index) => (
          <div
            key={index}
            className={`border-t border-gray-300 pt-6 ${index < data.extraStories.length - 1 ? "mb-6" : ""}`}
          >
            <div className="flex gap-4">
              <Link href={`/post/${story.slug}`}>
                <div className="relative flex-shrink-0">
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={story.title}
                    width={160}
                    height={112}
                    className="w-40 h-28 object-cover rounded-sm cursor-pointer hover:opacity-90 transition-opacity"
                  />
                  {story.imageSource && (
                    <div className="absolute bottom-2 right-2 bg-black/30 text-white text-xs px-2 py-1 rounded font-secondary">
                      {story.imageSource}
                    </div>
                  )}
                </div>
              </Link>
              <div className="flex-1">
                <Link href={`/post/${story.slug}`}>
                  <h3 className="text-base font-semibold text-neutral-900 mb-2 font-sans cursor-pointer hover:text-gray-700 transition-colors">
                    {story.title}
                  </h3>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
