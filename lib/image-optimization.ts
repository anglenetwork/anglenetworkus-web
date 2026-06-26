import { isWikimediaHostname } from "@/lib/editorial-image/policy";

/**
 * Image optimization utilities for external images.
 * Wikimedia /thumb/ URLs only work at pre-generated widths and use format-specific
 * leaf suffixes (SVG sources rasterize to `{width}px-{file}.svg.png`).
 */

/** Widths Wikimedia pre-generates for /thumb/ URLs (arbitrary widths often return 400). */
export const WIKIMEDIA_THUMBNAIL_WIDTHS = [
  120, 150, 180, 200, 220, 250, 300, 320, 400, 440, 480, 500, 600, 640, 720,
  800, 960, 1024, 1280, 1920, 2560, 3840,
] as const;

/** Pick the smallest pre-generated Wikimedia width >= requested, or the largest available. */
export function snapWikimediaThumbnailWidth(requestedWidth: number): number {
  const requested = Math.max(1, Math.round(requestedWidth));
  const match = WIKIMEDIA_THUMBNAIL_WIDTHS.find((width) => width >= requested);
  return (
    match ?? WIKIMEDIA_THUMBNAIL_WIDTHS[WIKIMEDIA_THUMBNAIL_WIDTHS.length - 1]
  );
}

/** True when the Commons source file is SVG (not an already-rasterized `.svg.png` leaf). */
export function isWikimediaSvgFilename(filename: string): boolean {
  return /\.svg$/i.test(filename) && !/\.svg\.png$/i.test(filename);
}

/** Build the final `/thumb/.../{width}px-{leaf}` segment for a source filename. */
export function buildWikimediaThumbLeaf(
  sourceFilename: string,
  width: number,
): string {
  const filenameOnly = sourceFilename.split("/").pop() || sourceFilename;
  if (isWikimediaSvgFilename(filenameOnly)) {
    return `${width}px-${filenameOnly}.png`;
  }
  return `${width}px-${filenameOnly}`;
}

function findCommonsIndex(pathParts: string[]): number {
  return pathParts.findIndex((part) => part === "commons");
}

/**
 * Repair existing /thumb/ URLs when the leaf format is wrong (e.g. SVG missing `.png`).
 * Keeps the stored width unchanged to avoid 400s from non-standard pre-generated sizes.
 */
export function repairWikimediaThumbUrl(url: URL, pathParts: string[]): URL {
  const commonsIndex = findCommonsIndex(pathParts);
  if (commonsIndex === -1 || pathParts[commonsIndex + 1] !== "thumb") {
    return url;
  }

  if (pathParts.length < commonsIndex + 5) {
    return url;
  }

  const sourceFilename = pathParts[pathParts.length - 2];
  const leafSegment = pathParts[pathParts.length - 1];
  const leafMatch = leafSegment.match(/^(\d+)px-(.+)$/);
  if (!leafMatch || !isWikimediaSvgFilename(sourceFilename)) {
    return url;
  }

  const [, width, leafName] = leafMatch;
  if (/\.svg\.png$/i.test(leafName)) {
    return url;
  }

  if (!leafName.toLowerCase().endsWith(".svg")) {
    return url;
  }

  const repaired = new URL(url.toString());
  const prefix = pathParts.slice(0, pathParts.length - 1);
  prefix.push(`${width}px-${leafName}.png`);
  repaired.pathname = `/${prefix.join("/")}`;
  return repaired;
}

/**
 * Converts a Wikimedia Commons URL to a thumbnail URL, or repairs malformed thumbs.
 */
export function getWikimediaThumbnail(
  originalUrl: string,
  maxWidth: number = 1200,
): string {
  const thumbnailWidth = snapWikimediaThumbnailWidth(maxWidth);
  try {
    const url = new URL(originalUrl);

    if (!isWikimediaHostname(url.hostname)) {
      return originalUrl;
    }

    const pathParts = url.pathname.split("/").filter((p) => p);
    const commonsIndex = findCommonsIndex(pathParts);
    if (commonsIndex === -1) {
      return originalUrl;
    }

    if (pathParts[commonsIndex + 1] === "thumb") {
      const repaired = repairWikimediaThumbUrl(url, pathParts);
      return repaired.toString();
    }

    const hash = pathParts[commonsIndex + 1];
    const filename = pathParts.slice(commonsIndex + 2).join("/");

    if (!hash || !filename) {
      return originalUrl;
    }

    const thumbLeaf = buildWikimediaThumbLeaf(filename, thumbnailWidth);
    const thumbnailPath = `/wikipedia/commons/thumb/${hash}/${filename}/${thumbLeaf}`;
    url.pathname = thumbnailPath;

    try {
      return new URL(url.toString()).toString();
    } catch {
      return originalUrl;
    }
  } catch {
    return originalUrl;
  }
}
