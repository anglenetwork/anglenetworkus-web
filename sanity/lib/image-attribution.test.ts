import { describe, expect, it, vi } from "vitest";

import {
  formatImageCredit,
  formatImageLicense,
  getImageAttribution,
} from "./image-attribution";

describe("formatImageLicense", () => {
  it("returns trimmed licenseOrRights or null", () => {
    expect(formatImageLicense({ licenseOrRights: "  Editorial use  " })).toBe(
      "Editorial use",
    );
    expect(formatImageLicense({ licenseOrRights: "   " })).toBeNull();
    expect(formatImageLicense(null)).toBeNull();
  });
});

describe("getImageAttribution", () => {
  it("combines caption, credit, and license from image meta", () => {
    expect(
      getImageAttribution({
        caption: "Scene",
        creditAuthor: "Jane",
        creditSource: "Reuters",
        licenseOrRights: "All rights reserved",
      }),
    ).toEqual({
      caption: "Scene",
      credit: "Jane/Reuters",
      license: "All rights reserved",
    });
  });

  it("keeps formatImageCredit behavior for credit-only input", () => {
    expect(formatImageCredit({ creditSource: "AP" })).toBe("AP");
  });
});
