"use client";

import Image from "next/image";
import Link from "next/link";
import { signInGalleryTitle } from "@/app/lib/typography/sign-in-page";
import type { SignInGalleryItem } from "@/app/lib/sign-in-gallery";

interface SignInGalleryPanelProps {
  galleryItems: SignInGalleryItem[];
  currentIndex: number;
}

export function SignInGalleryPanel({
  galleryItems,
  currentIndex,
}: SignInGalleryPanelProps) {
  const currentItem =
    galleryItems.length > 0 ? galleryItems[currentIndex] : null;

  if (!currentItem) return null;

  return (
    <div className="relative hidden flex-1 bg-gradient-to-br from-orange-200 via-pink-300 to-emerald-200 lg:flex">
      <div className="relative size-full">
        <div className="relative size-full">
          <div className="relative size-full overflow-hidden">
            <Image
              src={currentItem.image || "/placeholder.svg"}
              alt={currentItem.title}
              fill
              sizes="50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute right-0 bottom-20 left-0 px-8 py-6">
              {currentItem.slug ? (
                <Link href={`/post/${currentItem.slug}`}>
                  <h2 className={signInGalleryTitle}>{currentItem.title}</h2>
                </Link>
              ) : (
                <h2 className="mb-4 font-bold font-display text-4xl text-shadow text-white">
                  {currentItem.title}
                </h2>
              )}
              {currentItem.slug && (
                <Link
                  href={`/post/${currentItem.slug}`}
                  className="inline-block font-medium font-sans text-base text-white underline-offset-4 transition-all hover:underline"
                >
                  Read Article
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
