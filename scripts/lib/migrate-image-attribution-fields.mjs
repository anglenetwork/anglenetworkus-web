/** Migrate legacy image attribution keys to current Sanity schema fields. */

const LEGACY_IMAGE_ATTRIBUTION_KEYS = [
  "epigraph",
  "creditProvider",
  "creditLicense",
  "creditSourceUrl",
  "licenseUrl",
];

function asTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * @param {Record<string, unknown> | null | undefined} obj
 * @returns {{ changed: boolean, value: Record<string, unknown> | null | undefined }}
 */
export function migrateImageAttributionFields(obj) {
  if (!obj || typeof obj !== "object") {
    return { changed: false, value: obj };
  }

  let changed = false;
  const value = { ...obj };

  if (!asTrimmedString(value.caption) && asTrimmedString(value.epigraph)) {
    value.caption = asTrimmedString(value.epigraph);
    changed = true;
  }

  if (
    !asTrimmedString(value.creditSource) &&
    asTrimmedString(value.creditProvider)
  ) {
    value.creditSource = asTrimmedString(value.creditProvider);
    changed = true;
  }

  if (
    !asTrimmedString(value.licenseOrRights) &&
    asTrimmedString(value.creditLicense)
  ) {
    value.licenseOrRights = asTrimmedString(value.creditLicense);
    changed = true;
  }

  for (const key of LEGACY_IMAGE_ATTRIBUTION_KEYS) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      delete value[key];
      changed = true;
    }
  }

  return { changed, value };
}

/**
 * @param {unknown[] | null | undefined} blocks
 */
export function migrateBodyImageAttributionFields(blocks) {
  if (!Array.isArray(blocks)) {
    return { changed: false, value: blocks };
  }

  let changed = false;
  const value = blocks.map((block) => {
    if (
      !block ||
      typeof block !== "object" ||
      block._type !== "editorialImage"
    ) {
      return block;
    }

    const migrated = migrateImageAttributionFields(block);
    if (migrated.changed) changed = true;
    return migrated.value;
  });

  return { changed, value };
}

/**
 * @param {unknown[] | null | undefined} items
 */
export function migrateGalleryImageAttributionFields(items) {
  if (!Array.isArray(items)) {
    return { changed: false, value: items };
  }

  let changed = false;
  const value = items.map((item) => {
    const migrated = migrateImageAttributionFields(item);
    if (migrated.changed) changed = true;
    return migrated.value;
  });

  return { changed, value };
}

/**
 * @param {Record<string, unknown>} doc
 */
export function migrateDocumentImageAttributionFields(doc) {
  const set = {};

  const coverPatch = migrateImageAttributionFields(doc.cover);
  if (coverPatch.changed) set.cover = coverPatch.value;

  const galleryPatch = migrateGalleryImageAttributionFields(doc.imageGallery);
  if (galleryPatch.changed) set.imageGallery = galleryPatch.value;

  const bodyPatch = migrateBodyImageAttributionFields(doc.body);
  if (bodyPatch.changed) set.body = bodyPatch.value;

  return set;
}
