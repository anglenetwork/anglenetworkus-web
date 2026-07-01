import { isWikimediaHostname } from "@/lib/editorial-image/policy";

/**
 * Image optimization utilities for Wikimedia Commons external images.
 *
 * Wikimedia /thumb/ URLs only work at pre-generated widths and use format-specific
 * leaf suffixes (SVG sources rasterize to `{width}px-{file}.svg.png`).
 *
 * Never pass stored /thumb/ URLs through unchanged — CMS and publishers store
 * arbitrary widths (e.g. 2560px) that often return HTTP 400. Always rebuild
 * from the source file identity + snapped width.
 */

/** Widths Wikimedia pre-generates for /thumb/ URLs (arbitrary widths often return 400). */
const WIKIMEDIA_THUMBNAIL_WIDTHS = [
  120, 150, 180, 200, 220, 250, 300, 320, 400, 440, 480, 500, 600, 640, 720,
  800, 960, 1024, 1280, 1920, 2560, 3840,
] as const;

export type ParsedWikimediaCommonsUrl = {
  hash: string;
  filename: string;
};

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

/**
 * Minimum snap width when building a /thumb/ URL from a Commons source file.
 * Many files only exist at larger pre-generated sizes (e.g. SVG raster thumbs at 1280px).
 */
export function minWikimediaNewThumbWidth(filename: string): number {
  const filenameOnly = filename.split("/").pop() || filename;
  if (isWikimediaSvgFilename(filenameOnly)) {
    return snapWikimediaThumbnailWidth(1280);
  }
  return snapWikimediaThumbnailWidth(960);
}

/** Pick a /thumb/ width that is likely to exist for a Commons source file. */
export function resolveWikimediaNewThumbWidth(
  filename: string,
  maxWidth: number,
): number {
  return Math.max(
    snapWikimediaThumbnailWidth(maxWidth),
    minWikimediaNewThumbWidth(filename),
  );
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
 * Parse a Wikimedia Commons file or thumb URL into hash + source filename.
 * Returns null for non-Commons paths on upload.wikimedia.org.
 */
export function parseWikimediaCommonsUrl(
  url: string | URL,
): ParsedWikimediaCommonsUrl | null {
  try {
    const parsed = typeof url === "string" ? new URL(url) : url;
    if (!isWikimediaHostname(parsed.hostname)) {
      return null;
    }

    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const commonsIndex = findCommonsIndex(pathParts);
    if (commonsIndex === -1) {
      return null;
    }

    const afterCommons = pathParts.slice(commonsIndex + 1);
    if (afterCommons.length < 2) {
      return null;
    }

    if (afterCommons[0] === "thumb") {
      const filePathParts = afterCommons.slice(1, -1);
      if (filePathParts.length < 2) {
        return null;
      }
      return {
        hash: filePathParts[0],
        filename: filePathParts.slice(1).join("/"),
      };
    }

    return {
      hash: afterCommons[0],
      filename: afterCommons.slice(1).join("/"),
    };
  } catch {
    return null;
  }
}

/** Build a canonical Commons /thumb/ URL for a source file at the given width. */
function buildWikimediaThumbUrl(
  hash: string,
  filename: string,
  width: number,
): string {
  const thumbLeaf = buildWikimediaThumbLeaf(filename, width);
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${hash}/${filename}/${thumbLeaf}`;
}

/**
 * Normalize any Wikimedia Commons URL (full file or existing /thumb/) to a
 * working thumbnail URL at a snapped, file-aware width.
 */
export function getWikimediaThumbnail(
  originalUrl: string,
  maxWidth: number = 1200,
): string {
  try {
    const parsed = parseWikimediaCommonsUrl(originalUrl);
    if (!parsed) {
      return originalUrl;
    }

    const width = resolveWikimediaNewThumbWidth(parsed.filename, maxWidth);
    return buildWikimediaThumbUrl(parsed.hash, parsed.filename, width);
  } catch {
    return originalUrl;
  }
}
