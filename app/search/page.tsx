import { Suspense } from "react";
import SearchResults from "@/app/search/SearchResults";

export default function SearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg mb-8"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}
