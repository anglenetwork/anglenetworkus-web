export function asText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** True when searchText is null, undefined, or whitespace-only. */
export function isSearchTextEmpty(value) {
  return !asText(value);
}

/**
 * Whether backfill should write generated searchText for this document.
 * Returns { action: 'preserve' | 'skip' | 'patch', nextSearchText? }
 */
export function resolveSearchTextBackfill(doc) {
  if (!isSearchTextEmpty(doc?.searchText)) {
    return { action: 'preserve' };
  }

  const nextSearchText = buildSearchText(doc);
  if (!nextSearchText) {
    return { action: 'skip' };
  }

  return { action: 'patch', nextSearchText };
}

function blockText(block) {
  if (!block || typeof block !== 'object') return '';
  const parts = [];

  if (Array.isArray(block.children)) {
    for (const child of block.children) {
      if (child && typeof child === 'object') parts.push(asText(child.text));
    }
  }

  parts.push(asText(block.epigraph), asText(block.alt));
  return parts.filter(Boolean).join(' ');
}

export function portableTextToPlainText(blocks) {
  if (!Array.isArray(blocks)) return '';
  return blocks.map(blockText).filter(Boolean).join(' ');
}

function addText(parts, value) {
  if (Array.isArray(value)) {
    for (const item of value) addText(parts, item);
    return;
  }

  const text = asText(value);
  if (text) parts.push(text);
}

export function normalizeSearchText(parts) {
  const seen = new Set();
  const deduped = [];

  for (const part of parts) {
    const text = asText(part).replace(/\s+/g, ' ');
    if (!text) continue;

    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(text);
  }

  return deduped.join('\n').trim();
}

/** Build denormalized search index text from a Sanity article-family document shape. */
export function buildSearchText(doc) {
  const parts = [];

  addText(parts, doc.title);
  addText(parts, doc.tickerTitle);
  addText(parts, doc.excerpt);
  addText(parts, doc.coverEpigraph);
  addText(parts, portableTextToPlainText(doc.body));
  addText(parts, doc.opinionFormat);
  addText(parts, doc.disclosure);
  addText(parts, doc.analysisFocus);
  addText(parts, doc.methodologyNote);
  addText(parts, doc.sourcesNote);
  addText(parts, doc.sponsorName);
  addText(parts, doc.sponsorDisclosure);
  addText(parts, doc.categoryName);
  addText(parts, doc.categoryNavTitle);

  if (Array.isArray(doc.tags)) {
    for (const tag of doc.tags) {
      addText(parts, tag?.title);
      addText(parts, tag?.name);
      addText(parts, tag?.aliases);
    }
  }

  addText(parts, doc.authorName);
  return normalizeSearchText(parts);
}
