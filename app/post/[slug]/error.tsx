"use client";

import Link from "next/link";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mb-6">
          <svg
            className="mx-auto size-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h1 className="mb-4 font-bold text-2xl text-gray-900">
          Something went wrong
        </h1>

        <p className="mb-6 text-gray-600">
          {error.message ||
            "An unexpected error occurred while loading this post."}
        </p>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Try again
          </button>

          <Link
            href="/"
            className="block w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
          >
            Back to The Angle
          </Link>
        </div>
      </div>
    </div>
  );
}
