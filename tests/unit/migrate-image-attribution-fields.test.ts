import { describe, expect, it } from "vitest";

import {
  migrateBodyImageAttributionFields,
  migrateDocumentImageAttributionFields,
  migrateGalleryImageAttributionFields,
  migrateImageAttributionFields,
} from "../../scripts/lib/migrate-image-attribution-fields.mjs";

describe("migrateImageAttributionFields", () => {
  it("copies legacy values into current fields and removes legacy keys", () => {
    expect(
      migrateImageAttributionFields({
        alt: "Workers in PPE",
        epigraph: "Health workers during a response",
        creditAuthor: "Jane Doe",
        creditProvider: "Unsplash",
        creditLicense: "Unsplash License",
        creditSourceUrl: "https://unsplash.com/photos/example",
        licenseUrl: "https://unsplash.com/license",
      }),
    ).toEqual({
      changed: true,
      value: {
        alt: "Workers in PPE",
        caption: "Health workers during a response",
        creditAuthor: "Jane Doe",
        creditSource: "Unsplash",
        licenseOrRights: "Unsplash License",
      },
    });
  });

  it("does not overwrite existing current fields", () => {
    expect(
      migrateImageAttributionFields({
        caption: "Current caption",
        creditSource: "AP",
        licenseOrRights: "Licensed",
        epigraph: "Legacy caption",
        creditProvider: "Legacy provider",
        creditLicense: "Legacy license",
      }),
    ).toEqual({
      changed: true,
      value: {
        caption: "Current caption",
        creditSource: "AP",
        licenseOrRights: "Licensed",
      },
    });
  });
});

describe("migrateDocumentImageAttributionFields", () => {
  it("migrates cover, gallery, and body editorial images", () => {
    const set = migrateDocumentImageAttributionFields({
      cover: {
        epigraph: "Cover caption",
        creditProvider: "Unsplash",
        creditLicense: "Unsplash License",
      },
      imageGallery: [{ epigraph: "Gallery caption", creditProvider: "AP" }],
      body: [
        { _type: "block", children: [{ text: "Paragraph" }] },
        {
          _type: "editorialImage",
          epigraph: "Inline caption",
          creditProvider: "Reuters",
        },
      ],
    });

    expect(set.cover).toEqual({
      caption: "Cover caption",
      creditSource: "Unsplash",
      licenseOrRights: "Unsplash License",
    });
    expect(set.imageGallery).toEqual([
      { caption: "Gallery caption", creditSource: "AP" },
    ]);
    expect(set.body?.[1]).toEqual({
      _type: "editorialImage",
      caption: "Inline caption",
      creditSource: "Reuters",
    });
  });
});

describe("migrateBodyImageAttributionFields", () => {
  it("leaves non-editorial blocks unchanged", () => {
    const blocks = [{ _type: "block", children: [{ text: "Hello" }] }];
    expect(migrateBodyImageAttributionFields(blocks)).toEqual({
      changed: false,
      value: blocks,
    });
  });
});

describe("migrateGalleryImageAttributionFields", () => {
  it("returns unchanged when gallery is missing", () => {
    expect(migrateGalleryImageAttributionFields(null)).toEqual({
      changed: false,
      value: null,
    });
  });
});
