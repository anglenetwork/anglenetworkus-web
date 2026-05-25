/**
 * Dev-only: trace FifthSection Sanity payloads vs props/render slots.
 * Logs only when NODE_ENV === "development".
 */

function rowType(raw: unknown): string {
  if (!raw || typeof raw !== "object") return "(missing)";
  const t = (raw as Record<string, unknown>)._type;
  return typeof t === "string" ? t : "(missing)";
}

function rowTitle(raw: unknown): string {
  if (!raw || typeof raw !== "object") return "";
  const t = (raw as Record<string, unknown>).title;
  return typeof t === "string" ? t : "";
}

function rowCategorySlug(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return undefined;
  const c = (raw as Record<string, unknown>).category;
  if (!c || typeof c !== "object") return undefined;
  return (c as Record<string, unknown>).slug;
}

function rowCategoryTitle(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return undefined;
  const c = (raw as Record<string, unknown>).category;
  if (!c || typeof c !== "object") return undefined;
  return (c as Record<string, unknown>).title;
}

/**
 * Dev: assert every row’s projected `category.slug` matches the GROQ param.
 * If anything mismatches, the bug is upstream (CDN/cache) or CMS data — not the React slice.
 */
export function reportFifthSectionCategoryAlignment(
  columnLabel: string,
  expectedCategorySlug: string,
  rows: unknown,
  phase: string,
) {
  if (process.env.NODE_ENV !== "development") return;

  const list = Array.isArray(rows) ? rows : [];
  const mismatches = list
    .map((raw, index) => {
      const slug = rowCategorySlug(raw);
      const ok = typeof slug === "string" && slug === expectedCategorySlug;
      if (ok) return null;
      return {
        index,
        _id:
          raw && typeof raw === "object"
            ? (raw as Record<string, unknown>)._id
            : undefined,
        expectedCategorySlug,
        actualCategorySlug: slug,
        actualCategoryTitle: rowCategoryTitle(raw),
        title: rowTitle(raw).slice(0, 80),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x != null);

  if (mismatches.length > 0) {
    console.warn(
      `[FifthSection-debug][category-mismatch] ${phase} ${columnLabel}`,
      { count: mismatches.length, mismatches },
    );
  } else {
    console.log(
      `[FifthSection-debug][category-ok] ${phase} ${columnLabel}: all ${list.length} rows have category.slug === "${expectedCategorySlug}"`,
    );
  }
}

/** Dev: detect if left/right raw fetches accidentally returned the same document IDs (ordering). */
export function reportFifthSectionLeftRightParity(
  leftRaw: unknown,
  rightRaw: unknown,
  leftSlug: string,
  rightSlug: string,
) {
  if (process.env.NODE_ENV !== "development") return;
  const L = Array.isArray(leftRaw) ? leftRaw : [];
  const R = Array.isArray(rightRaw) ? rightRaw : [];
  const leftIds = L.slice(0, 12).map((r) =>
    r && typeof r === "object" ? (r as Record<string, unknown>)._id : null,
  );
  const rightIds = R.slice(0, 12).map((r) =>
    r && typeof r === "object" ? (r as Record<string, unknown>)._id : null,
  );
  const sameHead =
    leftIds.length > 0 &&
    rightIds.length > 0 &&
    leftIds[0] === rightIds[0] &&
    leftIds[1] === rightIds[1] &&
    leftIds[2] === rightIds[2];
  if (sameHead) {
    console.warn(
      "[FifthSection-debug][parity] First 3 document _id are identical between left and right columns — check Sanity params / CDN cache.",
      { leftSlug, rightSlug, leftIds, rightIds },
    );
  } else {
    console.log(
      "[FifthSection-debug][parity] Left vs right top-3 _id differ (expected).",
      {
        leftSlug,
        rightSlug,
        leftIdsTop3: leftIds.slice(0, 3),
        rightIdsTop3: rightIds.slice(0, 3),
      },
    );
  }
}

/** Log a list (Sanity raw rows or normalized ArticleFamilyCard[]). */
export function logFifthSectionDataset(
  phase: string,
  columnLabel: string,
  expectedCategorySlug: string,
  rows: unknown,
  options?: { maxDetailRows?: number; countTypesOnFullList?: boolean },
) {
  if (process.env.NODE_ENV !== "development") return;

  const list = Array.isArray(rows) ? rows : [];
  const maxDetail = options?.maxDetailRows ?? 8;
  const slice = list.slice(0, maxDetail);

  const typeCountsFull =
    options?.countTypesOnFullList !== false
      ? list.reduce<Record<string, number>>((acc, raw) => {
          const t = rowType(raw);
          acc[t] = (acc[t] ?? 0) + 1;
          return acc;
        }, {})
      : undefined;

  const typeCountsSlice = slice.reduce<Record<string, number>>((acc, raw) => {
    const t = rowType(raw);
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});

  const detailRows = slice.map((raw, index) => {
    const title = rowTitle(raw);
    const catSlug = rowCategorySlug(raw);
    const slugMatchesExpected =
      typeof catSlug === "string" && catSlug === expectedCategorySlug;
    return {
      index,
      _id:
        raw && typeof raw === "object"
          ? (raw as Record<string, unknown>)._id
          : undefined,
      _type: rowType(raw),
      categorySlug: catSlug,
      categoryTitle: rowCategoryTitle(raw),
      slugMatchesExpectedColumn: slugMatchesExpected,
      titleFull: title,
      titleLeadingAnalysisWord: /^\s*Analysis\b/i.test(title),
    };
  });

  const everySliceIsAnalysis =
    slice.length > 0 && slice.every((raw) => rowType(raw) === "analysis");
  const everySliceTitleLeadingAnalysis =
    slice.length > 0 &&
    slice.every((raw) => /^\s*Analysis\b/i.test(rowTitle(raw)));

  console.log("[FifthSection-debug]", phase, columnLabel, {
    expectedCategorySlug,
    totalRows: list.length,
    detailRowCount: slice.length,
    typeCountsFullList: typeCountsFull,
    typeCountsDetailSlice: typeCountsSlice,
    everyDetailRowIsAnalysisType: everySliceIsAnalysis,
    everyDetailTitleStartsWithAnalysisWord: everySliceTitleLeadingAnalysis,
    detailRows,
  });
}

function pickSlot(raw: unknown, expectedCategorySlug: string | null) {
  if (raw == null) return null;
  const title = rowTitle(raw);
  const catSlug = rowCategorySlug(raw);
  const slugOk =
    expectedCategorySlug == null ||
    (typeof catSlug === "string" && catSlug === expectedCategorySlug);
  return {
    _id:
      raw && typeof raw === "object"
        ? (raw as Record<string, unknown>)._id
        : undefined,
    _type: rowType(raw),
    categorySlug: catSlug,
    categoryTitle: rowCategoryTitle(raw),
    slugMatchesExpectedColumn: slugOk,
    titleFull: title,
    titleLeadingAnalysisWord: /^\s*Analysis\b/i.test(title),
  };
}

/** Log the exact articles chosen for each UI slot (after category filter + indices). */
export function logFifthSectionRenderSlots(
  leftCategorySlug: string,
  rightCategorySlug: string,
  slots: {
    leftForColumn: unknown[];
    rightForColumn: unknown[];
    mainArticle: unknown;
    secondaryArticles: unknown[];
    /** Right column: two top featured cards + stacked headline links */
    rightFeaturedSlots: unknown[];
    rightHeadlineLinks: unknown[];
  },
) {
  if (process.env.NODE_ENV !== "development") return;

  const leftPick = (r: unknown) => pickSlot(r, leftCategorySlug);
  const rightPick = (r: unknown) => pickSlot(r, rightCategorySlug);

  const rendered = {
    leftCategorySlug,
    rightCategorySlug,
    leftForColumnLength: slots.leftForColumn.length,
    rightForColumnLength: slots.rightForColumn.length,
    leftForColumn: slots.leftForColumn.map(leftPick),
    rightForColumn: slots.rightForColumn.map(rightPick),
    leftMain: leftPick(slots.mainArticle),
    leftSecondary: slots.secondaryArticles.map(leftPick),
    rightFeaturedSlots: slots.rightFeaturedSlots.map(rightPick),
    rightHeadlineLinks: slots.rightHeadlineLinks.map(rightPick),
  };

  const badSlots = [
    ...rendered.leftForColumn,
    ...rendered.rightForColumn,
  ].filter(
    (x): x is NonNullable<typeof x> =>
      x != null && x.slugMatchesExpectedColumn === false,
  );
  if (badSlots.length > 0) {
    console.warn(
      "[FifthSection-debug][render-slots] Some rendered cards have category.slug !== column slug",
      badSlots,
    );
  }

  console.log("[FifthSection-debug] render-slots", rendered);
}
