import Image from "next/image";
import Link from "next/link";
import {
  editorialColumnExtraStoryTitle,
  editorialColumnMainTitle,
} from "@/app/lib/typography/editorial-column";

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
    <div className="mb-8 border-gray-200 border-r px-6">
      <div className="mb-4 flex items-center">
        <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
        <h2 className="font-medium font-sans text-neutral-900 text-xs uppercase tracking-wider">
          {categoryTitle}
        </h2>
      </div>
      <div className="mb-6 border-black border-t"></div>

      {/* Main Article */}
      <div className="mb-6">
        <Link href={`/post/${data.mainStory.slug}`}>
          <Image
            src={data.mainStory.image || "/placeholder.svg"}
            alt={data.mainStory.title}
            width={800}
            height={320}
            className="mb-4 h-80 w-full cursor-pointer rounded-sm object-cover transition-opacity hover:opacity-90"
          />
        </Link>
        <Link href={`/post/${data.mainStory.slug}`}>
          <h1 className={editorialColumnMainTitle}>{data.mainStory.title}</h1>
        </Link>
        <p className="mb-4 font-light font-sans text-neutral-400 text-sm">
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
        <div key={index} className="mb-6 border-gray-300 border-t pt-6">
          <div className="flex gap-4">
            <Link href={`/post/${story.slug}`}>
              <Image
                src={story.image || "/placeholder.svg"}
                alt={story.title}
                width={160}
                height={112}
                className="h-28 w-40 flex-shrink-0 cursor-pointer rounded-sm object-cover transition-opacity hover:opacity-90"
              />
            </Link>
            <div className="flex-1">
              <Link href={`/post/${story.slug}`}>
                <h3 className={editorialColumnExtraStoryTitle}>
                  {story.title}
                </h3>
              </Link>
              <p className="font-sans text-neutral-400 text-xs">
                By{" "}
                {story.authors.map((author, index) => (
                  <span key={author}>
                    <span className="font-medium text-neutral-500 capitalize">
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
