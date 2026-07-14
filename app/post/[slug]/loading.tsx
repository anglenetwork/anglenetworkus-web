import { SitePageWidth } from "@/app/components/layout/site-page-width";

function SidebarNewsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-4 h-6 w-40 animate-pulse rounded bg-news-border" />
      <div className="flex flex-col">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-row-reverse items-start gap-x-3 py-4 first:pt-0 last:pb-0"
          >
            <div className="h-20 w-28 shrink-0 animate-pulse rounded-sm bg-news-border" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 animate-pulse rounded bg-news-border" />
              <div className="h-3 w-16 animate-pulse rounded bg-news-border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-news-background">
      <SitePageWidth className="py-4">
        <div className="mt-4 lg:mt-8">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="mb-4 h-6 w-24 animate-pulse rounded bg-news-border" />
            <div className="mb-6 h-12 w-3/4 animate-pulse rounded bg-news-border" />
            <div className="flex items-center gap-x-4">
              <div className="size-10 animate-pulse rounded-full bg-news-border" />
              <div className="h-4 w-32 animate-pulse rounded bg-news-border" />
              <div className="h-4 w-24 animate-pulse rounded bg-news-border" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-0 lg:grid-cols-12 lg:gap-16">
            {/* Main content skeleton */}
            <div className="col-span-1 lg:col-span-8">
              <div className="space-y-4">
                <div className="h-64 animate-pulse rounded-lg bg-news-border" />
                <div className="space-y-3">
                  <div className="h-4 animate-pulse rounded bg-news-border" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-news-border" />
                  <div className="h-4 w-4/6 animate-pulse rounded bg-news-border" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-news-border" />
                  <div className="h-4 w-3/6 animate-pulse rounded bg-news-border" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 animate-pulse rounded bg-news-border" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-news-border" />
                  <div className="h-4 w-4/6 animate-pulse rounded bg-news-border" />
                </div>
              </div>
            </div>

            {/* Sidebar skeletons — Popular Reads + News for You */}
            <div className="col-span-1 flex flex-col gap-8 lg:col-span-4">
              <div className="hidden lg:block">
                <SidebarNewsSkeleton />
              </div>
              <SidebarNewsSkeleton />
            </div>
          </div>
        </div>
      </SitePageWidth>
    </div>
  );
}
