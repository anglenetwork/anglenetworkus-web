import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ExcerptCreditCaption } from "./excerpt-credit-caption";

afterEach(() => {
  cleanup();
});

describe("ExcerptCreditCaption", () => {
  it("renders nothing when excerpt and credit are empty or whitespace", () => {
    const { container: a } = render(
      <ExcerptCreditCaption excerpt={null} credit={undefined} />,
    );
    expect(a.firstChild).toBeNull();

    const { container: b } = render(
      // JSX quoted attributes do not treat `\n` as a newline (literal `\` + `n`).
      <ExcerptCreditCaption excerpt={"  \n"} credit={"   "} />,
    );
    expect(b.firstChild).toBeNull();
  });

  it("shows excerpt and credit on one line with a hyphen between them", () => {
    render(
      <ExcerptCreditCaption
        excerpt="  Dek text.  "
        credit="  Photo credit  "
      />,
    );
    const line = screen.getByRole("paragraph");
    expect(line).toHaveTextContent("Dek text. - Photo credit");
  });

  it("trims and shows a single field when the other is missing", () => {
    const { rerender } = render(
      <ExcerptCreditCaption excerpt="  Only dek  " credit="" />,
    );
    expect(screen.getByRole("paragraph")).toHaveTextContent("Only dek");

    rerender(<ExcerptCreditCaption excerpt={null} credit="  Only credit  " />);
    expect(screen.getByRole("paragraph")).toHaveTextContent("Only credit");
  });

  it("applies compact variant and right alignment classes", () => {
    const { container } = render(
      <ExcerptCreditCaption
        credit="Photo: Jane Doe"
        variant="compact"
        align="right"
      />,
    );
    const line = container.querySelector("p");
    expect(line).toHaveClass("text-[10px]", "text-gray-500", "text-right");
    expect(line).toHaveTextContent("Photo: Jane Doe");
  });
});
