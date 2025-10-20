import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CategoryHeaderProps {
  categoryName: string;
  categorySlug: string;
  postCount: number;
}

export default function CategoryHeader({
  categoryName,
  categorySlug,
  postCount,
}: CategoryHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {categoryName}
            </h1>
            <p className="text-gray-600">
              {postCount} {postCount === 1 ? "article" : "articles"} in this
              category
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Category:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {categorySlug}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
