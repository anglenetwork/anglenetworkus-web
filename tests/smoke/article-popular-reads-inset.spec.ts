import { expect, test } from "@playwright/test";
import { client } from "../../sanity/lib/client";

type ArticleFixture = {
  slug?: string | null;
};

async function findArticleWithEnoughBody() {
  return client.fetch<ArticleFixture | null>(`
    *[
      _type == "post" &&
      defined(slug.current) &&
      count(body[_type == "block" && (!defined(style) || style == "normal")]) >= 4
    ][0]{
      "slug": slug.current
    }
  `);
}

test.describe("Article Popular Reads inset", () => {
  test("shows Popular Reads inside the body on base viewport", async ({
    page,
  }) => {
    const article = await findArticleWithEnoughBody();
    if (!article?.slug) {
      test.skip(true, "No post with enough body paragraphs found");
      return;
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/post/${article.slug}`);

    const inBodyPopularReads = page.getByTestId("in-body-popular-reads");
    await expect(inBodyPopularReads).toBeVisible();
    await expect(page.getByTestId("sidebar-popular-reads")).toBeHidden();

    await expect
      .poll(async () =>
        inBodyPopularReads.evaluate((element) => {
          const parent = element.parentElement;
          if (!parent) return false;

          const children = Array.from(parent.children);
          const paragraphs = children.filter(
            (child) => child.tagName.toLowerCase() === "p",
          );
          const insetIndex = Array.from(parent.children).indexOf(element);
          const hasParagraphBefore = paragraphs.some(
            (paragraph) => children.indexOf(paragraph) < insetIndex,
          );
          const hasParagraphAfter = paragraphs.some(
            (paragraph) => children.indexOf(paragraph) > insetIndex,
          );

          return hasParagraphBefore && hasParagraphAfter;
        }),
      )
      .toBe(true);
  });

  test("keeps Popular Reads in the sidebar on desktop", async ({ page }) => {
    const article = await findArticleWithEnoughBody();
    if (!article?.slug) {
      test.skip(true, "No post with enough body paragraphs found");
      return;
    }

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/post/${article.slug}`);

    await expect(page.getByTestId("in-body-popular-reads")).toBeHidden();
    await expect(page.getByTestId("sidebar-popular-reads")).toBeVisible();
  });
});
