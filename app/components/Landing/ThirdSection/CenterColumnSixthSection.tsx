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
}

export function CenterColumnSixthSection({
  data,
  categoryTitle,
}: NewsSectionProps) {
  return (
    <div className="border-r border-gray-200 px-6 mb-8">
      <div className="flex items-center mb-4">
        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
        <h2 className="text-xs font-medium text-neutral-900 uppercase tracking-wider font-sans">
          {categoryTitle}
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
        <p className="text-sm font-light text-neutral-400 mb-4 font-sans">
          By{" "}
          {data.mainStory.authors.map((author, index) => (
            <span key={author}>
              <span className="font-semibold text-neutral-500">{author}</span>
              {index < data.mainStory.authors.length - 1 && " and "}
            </span>
          ))}
        </p>
      </div>

      {/* Extra Stories */}
      {data.extraStories.map((story, index) => (
        <div key={index} className="border-t border-gray-300 pt-6 mb-6">
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
              <p className="text-xs text-neutral-400 font-sans">
                By{" "}
                {story.authors.map((author, index) => (
                  <span key={author}>
                    <span className="font-medium capitalize text-neutral-500">
                      {author}
                    </span>
                    {index < story.authors.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
