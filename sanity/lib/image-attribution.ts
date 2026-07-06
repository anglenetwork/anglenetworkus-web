export type ImageMetaInput = {
  caption?: string | null;
  creditAuthor?: string | null;
  creditSource?: string | null;
  licenseOrRights?: string | null;
};

function asImageMetaInput(raw: unknown): ImageMetaInput | null | undefined {
  if (raw == null || typeof raw !== "object") return undefined;
  return raw as ImageMetaInput;
}

/** Normalizes image caption/credit fields from Sanity image media objects. */
export function normalizeImageMeta(raw: unknown): {
  caption: string | null;
  creditAuthor: string | null;
  creditSource: string | null;
  licenseOrRights: string | null;
} {
  const meta = asImageMetaInput(raw);
  if (!meta) {
    return {
      caption: null,
      creditAuthor: null,
      creditSource: null,
      licenseOrRights: null,
    };
  }

  return {
    caption: meta.caption ?? null,
    creditAuthor: meta.creditAuthor ?? null,
    creditSource: meta.creditSource ?? null,
    licenseOrRights: meta.licenseOrRights?.trim() || null,
  };
}

/** Visible credit line: Author/Source, Source, or Author only. */
export function formatImageCredit(raw: unknown): string | null {
  const { creditAuthor, creditSource } = normalizeImageMeta(raw);
  const author = creditAuthor?.trim();
  const source = creditSource?.trim();

  if (author && source) return `${author}/${source}`;
  if (source) return source;
  if (author) return author;
  return null;
}

/** Internal rights / license note from CMS (shown on article detail, not listings). */
export function formatImageLicense(raw: unknown): string | null {
  return normalizeImageMeta(raw).licenseOrRights;
}

export function getImageAttribution(raw: unknown): {
  caption: string | null;
  credit: string | null;
  license: string | null;
} {
  const meta = normalizeImageMeta(raw);
  return {
    caption: meta.caption,
    credit: formatImageCredit(raw),
    license: meta.licenseOrRights,
  };
}
