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
    <div className="border-gray-200 border-r px-6">
      {/* News Section */}
      <div className="mb-8">
        <SectionHeader
          title={categoryTitle}
          variant="light"
          accentStyle="geometric-square"
          size="large"
          href={categorySlug ? `/category/${categorySlug}` : undefined}
        />

        {/* Main Article */}
        <div className="mb-6">
          <div className="mb-4">
            <Link href={`/post/${data.mainStory.slug}`}>
              <Image
                src={data.mainStory.image || "/placeholder.svg"}
                alt={data.mainStory.title}
                width={800}
                height={320}
                className="h-80 w-full cursor-pointer rounded-sm object-cover transition-opacity hover:opacity-90"
              />
            </Link>
            {data.mainStory.imageSource && (
              <p className="text-right font-sans text-[10px] text-gray-500">
                {data.mainStory.imageSource}
              </p>
            )}
          </div>
          <Link href={`/post/${data.mainStory.slug}`}>
            <h1 className="mb-3 cursor-pointer font-sans font-semibold text-3xl text-gray-900 transition-colors hover:text-gray-700">
              {data.mainStory.title}
            </h1>
          </Link>
        </div>

        {/* Extra Stories */}
        {data.extraStories.map((story, index) => (
          <div
            key={index}
            className={`border-gray-300 border-t pt-6 ${index < data.extraStories.length - 1 ? "mb-6" : ""}`}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Link href={`/post/${story.slug}`}>
                  <Image
                    src={story.image || "/placeholder.svg"}
                    alt={story.title}
                    width={160}
                    height={112}
                    className="h-28 w-40 cursor-pointer rounded-sm object-cover transition-opacity hover:opacity-90"
                  />
                </Link>
                {story.imageSource && (
                  <p className="text-right font-sans text-[10px] text-gray-500">
                    {story.imageSource}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <Link href={`/post/${story.slug}`}>
                  <h3 className="mb-2 cursor-pointer font-sans font-semibold text-base text-neutral-900 transition-colors hover:text-gray-700">
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
