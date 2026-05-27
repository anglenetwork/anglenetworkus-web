import { describe, expect, it } from "vitest";

import {
  isCarouselLcpCandidate,
  shouldRenderCarouselSlide,
} from "./slide-visibility";

describe("shouldRenderCarouselSlide", () => {
  it("renders only index 0 when total is 1", () => {
    expect(shouldRenderCarouselSlide(0, 0, 1)).toBe(true);
    expect(shouldRenderCarouselSlide(1, 0, 1)).toBe(false);
  });

  it("renders current and neighbors with wrap-around", () => {
    const total = 5;
    const current = 0;
    expect(shouldRenderCarouselSlide(0, current, total)).toBe(true);
    expect(shouldRenderCarouselSlide(1, current, total)).toBe(true);
    expect(shouldRenderCarouselSlide(4, current, total)).toBe(true);
    expect(shouldRenderCarouselSlide(2, current, total)).toBe(false);
    expect(shouldRenderCarouselSlide(3, current, total)).toBe(false);
  });

  it("wraps previous neighbor at first slide", () => {
    expect(shouldRenderCarouselSlide(4, 0, 5)).toBe(true);
    expect(shouldRenderCarouselSlide(0, 4, 5)).toBe(true);
    expect(shouldRenderCarouselSlide(3, 4, 5)).toBe(true);
  });
});

describe("isCarouselLcpCandidate", () => {
  it("is true only for slide 0 when current is 0", () => {
    expect(isCarouselLcpCandidate(0, 0)).toBe(true);
    expect(isCarouselLcpCandidate(1, 0)).toBe(false);
    expect(isCarouselLcpCandidate(0, 1)).toBe(false);
  });
});
