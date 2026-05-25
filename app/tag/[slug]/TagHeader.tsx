interface Tag {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  emoji?: string;
  color?: string;
  featured?: boolean;
}

interface TagHeaderProps {
  tag: Tag;
}

export default function TagHeader({ tag }: TagHeaderProps) {
  return (
    <div className="border-gray-200 border-b pb-6">
      <div className="mb-4 flex items-center gap-3">
        {tag.emoji && (
          <span className="text-3xl" role="img" aria-label={tag.title}>
            {tag.emoji}
          </span>
        )}
        <div>
          <h1 className="font-bold font-sans text-3xl text-gray-900">
            {tag.title}
          </h1>
          {tag.featured && (
            <span className="mt-1 inline-flex items-center rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-800 text-xs">
              Featured
            </span>
          )}
        </div>
      </div>

      {tag.description && (
        <p className="font-sans text-gray-600 text-lg leading-relaxed">
          {tag.description}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2 text-gray-500 text-sm">
        <span>Tag</span>
        <span>•</span>
        <span>All posts tagged with &ldquo;{tag.title}&rdquo;</span>
      </div>
    </div>
  );
}
