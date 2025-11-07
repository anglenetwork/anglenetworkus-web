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
    <div className="border-b border-gray-200 pb-6">
      <div className="flex items-center gap-3 mb-4">
        {tag.emoji && (
          <span className="text-3xl" role="img" aria-label={tag.title}>
            {tag.emoji}
          </span>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-sans">
            {tag.title}
          </h1>
          {tag.featured && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
              Featured
            </span>
          )}
        </div>
      </div>

      {tag.description && (
        <p className="text-lg text-gray-600 font-secondary leading-relaxed">
          {tag.description}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
        <span>Tag</span>
        <span>•</span>
        <span>All posts tagged with &ldquo;{tag.title}&rdquo;</span>
      </div>
    </div>
  );
}
