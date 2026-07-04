export interface TagPost {
  _id: string;
  title: string;
  slug: string;
  href: string;
  readTime?: number | null;
  imageUrl?: string;
  imageAlt?: string;
  imageUnoptimized?: boolean;
  imageCredit?: string | null;
  cover?: {
    source?: "asset" | "external" | null;
    externalUrl?: string | null;
    image?: unknown;
    alt?: string | null;
    creditAuthor?: string | null;
    creditSource?: string | null;
  } | null;
}

export interface TagIcymiItem {
  id: string;
  number: string;
  title: string;
  href: string;
  imageUrl: string;
  imageAlt?: string;
  imageUnoptimized?: boolean;
  imageCredit?: string | null;
  readTimeMinutes?: number | null;
}

/** Zero-padded two-digit item number (01, 02, …). */
export function formatTagItemNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}
