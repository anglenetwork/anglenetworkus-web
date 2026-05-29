export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mt-4 lg:mt-16">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="mb-4 h-6 w-24 animate-pulse rounded bg-gray-200"></div>
            <div className="mb-6 h-12 w-3/4 animate-pulse rounded bg-gray-200"></div>
            <div className="flex items-center gap-x-4">
              <div className="size-10 animate-pulse rounded-full bg-gray-200"></div>
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-0 lg:gap-12">
            {/* Main content skeleton */}
            <div className="col-span-12 lg:col-span-8">
              <div className="space-y-4">
                <div className="h-64 animate-pulse rounded-lg bg-gray-200"></div>
                <div className="space-y-3">
                  <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200"></div>
                  <div className="size-4/6 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-3/6 animate-pulse rounded bg-gray-200"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200"></div>
                  <div className="size-4/6 animate-pulse rounded bg-gray-200"></div>
                </div>
              </div>
            </div>

            {/* Sidebar skeleton */}
            <div className="col-span-12 lg:col-span-4 lg:gap-16">
              <div className="mb-6 rounded-lg bg-gray-50 p-6">
                <div className="mb-4 h-6 w-32 animate-pulse rounded bg-gray-200"></div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-x-3">
                      <div className="h-15 w-20 animate-pulse rounded bg-gray-200"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                        <div className="size-3/4 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
