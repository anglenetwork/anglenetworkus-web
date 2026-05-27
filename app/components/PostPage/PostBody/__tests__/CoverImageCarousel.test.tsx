import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ResolvedArticleImage } from "../types";
import CoverImageCarousel from "../CoverImageCarousel";

type ImageRendererMockProps = {
  src: string;
  alt: string;
  priority?: boolean;
  fetchPriority?: string;
};

const imageRendererMock = vi.fn(
  ({ src, alt, priority, fetchPriority }: ImageRendererMockProps) => (
    // eslint-disable-next-line @next/next/no-img-element -- mock stand-in for ImageRenderer
    <img
      data-testid="carousel-image"
      data-src={src}
      data-priority={priority ? "true" : "false"}
      data-fetch-priority={fetchPriority ?? ""}
      alt={alt}
    />
  ),
);

vi.mock("../../../ui/image-renderer", () => ({
  ImageRenderer: (props: ImageRendererMockProps) => imageRendererMock(props),
}));

afterEach(() => {
  cleanup();
  imageRendererMock.mockClear();
});

function makeImage(
  overrides: Partial<ResolvedArticleImage> & { src: string },
): ResolvedArticleImage {
  return {
    alt: "Alt text",
    unoptimized: false,
    ...overrides,
  };
}

describe("CoverImageCarousel", () => {
  const galleryImages: ResolvedArticleImage[] = [
    makeImage({ src: "https://cdn.example.com/1.jpg", credit: "Credit One" }),
    makeImage({
      src: "https://cdn.example.com/2.jpg",
      credit: "Credit Two",
      licenseOrRights: "Rights Two",
    }),
    makeImage({ src: "https://cdn.example.com/3.jpg" }),
    makeImage({ src: "https://cdn.example.com/4.jpg" }),
    makeImage({ src: "https://cdn.example.com/5.jpg" }),
  ];

  it("mounts at most three slide images when five slides exist", () => {
    render(
      <CoverImageCarousel
        coverImage={makeImage({ src: "https://cdn.example.com/cover.jpg" })}
        galleryImages={galleryImages}
      />,
    );

    expect(screen.getAllByTestId("carousel-image")).toHaveLength(3);
  });

  it("shows caption credit and license for the current slide", () => {
    render(
      <CoverImageCarousel coverImage={null} galleryImages={galleryImages} />,
    );

    expect(screen.getByText("Credit One")).toBeInTheDocument();

    const goToImage2 = screen.getByRole("button", { name: "Go to image 2" });
    expect(goToImage2).toBeInTheDocument();
  });

  it("updates caption when a dot is clicked", () => {
    render(
      <CoverImageCarousel coverImage={null} galleryImages={galleryImages} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Go to image 2" }));

    expect(screen.getByText("Credit Two")).toBeInTheDocument();
    expect(screen.getByText("Rights Two")).toBeInTheDocument();
    expect(screen.queryByText("Credit One")).not.toBeInTheDocument();
  });

  it("only marks the initial visible slide as LCP priority", () => {
    render(
      <CoverImageCarousel
        coverImage={makeImage({ src: "https://cdn.example.com/cover.jpg" })}
        galleryImages={galleryImages}
      />,
    );

    const priorityImages = screen
      .getAllByTestId("carousel-image")
      .filter((img) => img.getAttribute("data-priority") === "true");
    expect(priorityImages).toHaveLength(1);
    expect(priorityImages[0]).toHaveAttribute(
      "data-src",
      "https://cdn.example.com/cover.jpg",
    );
    expect(priorityImages[0]).toHaveAttribute("data-fetch-priority", "high");
  });

  it("does not assign priority after advancing to another slide", () => {
    render(
      <CoverImageCarousel coverImage={null} galleryImages={galleryImages} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Go to image 2" }));

    const figure = screen.getByRole("figure");
    const images = within(figure).getAllByTestId("carousel-image");
    expect(
      images.every((img) => img.getAttribute("data-priority") === "false"),
    ).toBe(true);
  });
});
