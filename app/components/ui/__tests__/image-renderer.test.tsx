import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const nextImageMock = vi.fn((props: Record<string, unknown>) => (
  // eslint-disable-next-line @next/next/no-img-element -- mock stand-in for next/image
  <img data-testid="next-image" alt="" {...props} />
));

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => nextImageMock(props),
}));

import { ImageRenderer } from "../image-renderer";

describe("ImageRenderer", () => {
  beforeEach(() => {
    nextImageMock.mockClear();
  });

  it("uses blur placeholder for optimized images with blurDataURL", () => {
    render(
      <ImageRenderer
        src="https://cdn.sanity.io/images/project/dataset/abc.jpg"
        alt="Cover"
        width={800}
        height={600}
        blurDataURL="data:image/jpeg;base64,/9j/4AAQ"
      />,
    );

    expect(nextImageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        placeholder: "blur",
        blurDataURL: "data:image/jpeg;base64,/9j/4AAQ",
        unoptimized: false,
      }),
    );
  });

  it("uses empty placeholder when unoptimized even with blurDataURL", () => {
    render(
      <ImageRenderer
        src="https://upload.wikimedia.org/wikipedia/commons/a/ab/File.jpg"
        alt="Wiki"
        width={800}
        height={600}
        blurDataURL="data:image/jpeg;base64,/9j/4AAQ"
      />,
    );

    expect(nextImageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        placeholder: "empty",
        unoptimized: true,
      }),
    );
    const lastCall = nextImageMock.mock.calls.at(-1)?.[0];
    expect(lastCall?.blurDataURL).toBeUndefined();
  });

  it("uses empty placeholder without blurDataURL", () => {
    render(
      <ImageRenderer
        src="https://cdn.sanity.io/images/project/dataset/abc.jpg"
        alt="Cover"
        width={800}
        height={600}
      />,
    );

    expect(nextImageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        placeholder: "empty",
      }),
    );
  });
});
