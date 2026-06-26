import { describe, expect, it } from "vitest";
import { extractPostgrestMessage } from "../subscription-client";

describe("extractPostgrestMessage", () => {
  it("extracts message from Postgrest-like errors", () => {
    expect(
      extractPostgrestMessage({ message: "Row not found" }, "fallback"),
    ).toBe("Row not found");
  });

  it("returns fallback for unknown errors", () => {
    expect(extractPostgrestMessage({}, "fallback")).toBe("fallback");
  });
});
