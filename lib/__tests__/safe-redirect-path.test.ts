import { describe, expect, it } from "vitest";
import {
  safeRelativeRedirectPath,
  withPostLoginFlag,
} from "../safe-redirect-path";

describe("safeRelativeRedirectPath", () => {
  it("returns default for missing or empty values", () => {
    expect(safeRelativeRedirectPath(null)).toBe(
      "/myprofile/profile-details?post_login=1",
    );
    expect(safeRelativeRedirectPath("")).toBe(
      "/myprofile/profile-details?post_login=1",
    );
  });

  it("accepts allowlisted relative paths", () => {
    expect(safeRelativeRedirectPath("/myprofile/bookmarks")).toBe(
      "/myprofile/bookmarks",
    );
    expect(
      safeRelativeRedirectPath("/studio", {
        defaultPath: "/studio",
        allowedPrefixes: ["/studio"],
      }),
    ).toBe("/studio");
  });

  it("rejects open redirects and off-allowlist paths", () => {
    expect(safeRelativeRedirectPath("//evil.com")).toBe(
      "/myprofile/profile-details?post_login=1",
    );
    expect(safeRelativeRedirectPath("https://evil.com")).toBe(
      "/myprofile/profile-details?post_login=1",
    );
    expect(safeRelativeRedirectPath("/admin")).toBe(
      "/myprofile/profile-details?post_login=1",
    );
    expect(
      safeRelativeRedirectPath("/signin", {
        defaultPath: "/studio",
        allowedPrefixes: ["/studio"],
      }),
    ).toBe("/studio");
  });
});

describe("withPostLoginFlag", () => {
  it("appends post_login when absent", () => {
    expect(withPostLoginFlag("/myprofile")).toBe("/myprofile?post_login=1");
    expect(withPostLoginFlag("/myprofile?foo=1")).toBe(
      "/myprofile?foo=1&post_login=1",
    );
  });

  it("does not duplicate post_login", () => {
    expect(withPostLoginFlag("/myprofile?post_login=1")).toBe(
      "/myprofile?post_login=1",
    );
  });
});
