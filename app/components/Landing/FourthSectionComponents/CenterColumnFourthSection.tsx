import Image from "next/image";
import Link from "next/link";

interface Story {
  image: string;
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
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide font-sans">
            {categorySlug ? (
              <Link
                href={`/category/${categorySlug}`}
                className="hover:text-red-600 transition-colors cursor-pointer"
              >
                {categoryTitle}
              </Link>
            ) : (
              categoryTitle
            )}
          </h2>
        </div>
        <div className="border-t border-black mb-6"></div>

        {/* Main Article */}
        <div className="mb-6">
          <Link href={`/post/${data.mainStory.slug}`}>
            <Image
              src={data.mainStory.image || "/placeholder.svg"}
              alt={data.mainStory.title}
              width={800}
              height={320}
              className="w-full h-80 object-cover rounded-sm mb-4 cursor-pointer hover:opacity-90 transition-opacity"
            />
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
                <Image
                  src={story.image || "/placeholder.svg"}
                  alt={story.title}
                  width={160}
                  height={112}
                  className="w-40 h-28 object-cover rounded-sm flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                />
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
