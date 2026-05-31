/**
 * Editorial desk: article-family workspace, taxonomy, settings, legacy utilities.
 */

import {
  BarChartIcon,
  CogIcon,
  CommentIcon,
  DocumentsIcon,
  DocumentTextIcon,
  TagsIcon,
  TagIcon,
  UserIcon,
} from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

import { apiVersion } from "@/sanity/lib/api";

/** Types managed explicitly in this tree (excluded from the default type list). */
const DESK_MANAGED_TYPES = new Set([
  "settings",
  "post",
  "opinion",
  "analysis",
  "sponsored",
  "category",
  "tag",
  "author",
  "topic",
]);

function coverInvalid(): string {
  return (
    "!defined(cover) || " +
    '(cover.source == "asset" && !defined(cover.image.asset)) || ' +
    '(cover.source == "external" && (!defined(cover.externalUrl) || cover.externalUrl == ""))'
  );
}

function coreArticleQaClauses(): string {
  return [
    '!defined(title) || title == ""',
    '!defined(slug.current) || slug.current == ""',
    '!defined(excerpt) || excerpt == ""',
    coverInvalid(),
    '!defined(cover.alt) || cover.alt == ""',
    "!defined(body) || count(body) == 0",
    '(status == "published" && !defined(publishedAt))',
  ].join(" || ");
}

const postNeedsEditorialQaFilter = `_type == "post" && (${coreArticleQaClauses()} || !defined(category))`;

const opinionNeedsEditorialQaFilter = `_type == "opinion" && (${coreArticleQaClauses()} || !defined(author))`;

const analysisNeedsEditorialQaFilter = `_type == "analysis" && (${coreArticleQaClauses()} || !defined(category) || !defined(author) || !defined(analysisFocus) || analysisFocus == "")`;

const sponsoredNeedsDisclosureReviewFilter = `_type == "sponsored" && (!defined(sponsorAttribution) || !defined(sponsorAttribution.sponsorName) || sponsorAttribution.sponsorName == "" || !defined(sponsorAttribution.disclosure) || sponsorAttribution.disclosure == "")`;

export const editorialDeskStructure: StructureResolver = (S) => {
  const siteSettingsItem = S.listItem()
    .title("Site Settings")
    .icon(CogIcon)
    .child(
      S.editor().id("settings").schemaType("settings").documentId("settings"),
    );

  const remainingTypes = S.documentTypeListItems().filter(
    (item) => !DESK_MANAGED_TYPES.has(item.getId() ?? ""),
  );

  return S.list()
    .title("Editorial")
    .items([
      S.listItem()
        .title("Posts")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Posts")
            .items([
              S.documentTypeListItem("post").title("All Posts"),
              S.listItem()
                .title("Draft Posts")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("post")
                    .title("Draft Posts")
                    .filter('_type == "post" && status == "draft"'),
                ),
              S.listItem()
                .title("Scheduled / Future Posts")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("post")
                    .title("Scheduled / Future Posts")
                    .filter(
                      '_type == "post" && (status == "scheduled" || (defined(publishedAt) && publishedAt > now()))',
                    ),
                ),
              S.listItem()
                .title("Published Posts")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("post")
                    .title("Published Posts")
                    .filter('_type == "post" && status == "published"'),
                ),
              S.divider(),
              S.listItem()
                .title("Homepage Main Headlines")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("post")
                    .title("Homepage Main Headlines")
                    .filter('_type == "post" && mainHeadline == true'),
                ),
              S.listItem()
                .title("Homepage Frontline")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("post")
                    .title("Homepage Frontline")
                    .filter('_type == "post" && frontline == true'),
                ),
              S.listItem()
                .title("Homepage Right Rail")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("post")
                    .title("Homepage Right Rail")
                    .filter('_type == "post" && rightHeadline == true'),
                ),
              S.listItem()
                .title("Homepage Just In")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("post")
                    .title("Homepage Just In")
                    .filter('_type == "post" && justIn == true'),
                ),
              S.listItem()
                .title("Breaking / Developing")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("post")
                    .title("Breaking / Developing")
                    .filter(
                      '_type == "post" && (breakingNews == true || developingStory == true)',
                    ),
                ),
              S.listItem()
                .title("Featured Posts")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("post")
                    .title("Featured Posts")
                    .filter('_type == "post" && featured == true'),
                ),
              S.listItem()
                .title("Needs Editorial QA")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("post")
                    .title("Needs Editorial QA")
                    .filter(postNeedsEditorialQaFilter),
                ),
            ]),
        ),

      S.listItem()
        .title("Opinion")
        .icon(CommentIcon)
        .child(
          S.list()
            .title("Opinion")
            .items([
              S.documentTypeListItem("opinion").title("All Opinion"),
              S.listItem()
                .title("Draft Opinion")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("opinion")
                    .title("Draft Opinion")
                    .filter('_type == "opinion" && status == "draft"'),
                ),
              S.listItem()
                .title("Published Opinion")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("opinion")
                    .title("Published Opinion")
                    .filter('_type == "opinion" && status == "published"'),
                ),
              S.listItem()
                .title("Needs Editorial QA")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("opinion")
                    .title("Needs Editorial QA")
                    .filter(opinionNeedsEditorialQaFilter),
                ),
            ]),
        ),

      S.listItem()
        .title("Analysis")
        .icon(BarChartIcon)
        .child(
          S.list()
            .title("Analysis")
            .items([
              S.documentTypeListItem("analysis").title("All Analysis"),
              S.listItem()
                .title("Draft Analysis")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("analysis")
                    .title("Draft Analysis")
                    .filter('_type == "analysis" && status == "draft"'),
                ),
              S.listItem()
                .title("Published Analysis")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("analysis")
                    .title("Published Analysis")
                    .filter('_type == "analysis" && status == "published"'),
                ),
              S.listItem()
                .title("Needs Editorial QA")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("analysis")
                    .title("Needs Editorial QA")
                    .filter(analysisNeedsEditorialQaFilter),
                ),
            ]),
        ),

      S.listItem()
        .title("Sponsored")
        .icon(TagIcon)
        .child(
          S.list()
            .title("Sponsored")
            .items([
              S.documentTypeListItem("sponsored").title("All Sponsored"),
              S.listItem()
                .title("Draft Sponsored")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("sponsored")
                    .title("Draft Sponsored")
                    .filter('_type == "sponsored" && status == "draft"'),
                ),
              S.listItem()
                .title("Published Sponsored")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("sponsored")
                    .title("Published Sponsored")
                    .filter('_type == "sponsored" && status == "published"'),
                ),
              S.listItem()
                .title("Needs Sponsor Disclosure Review")
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .schemaType("sponsored")
                    .title("Needs Sponsor Disclosure Review")
                    .filter(sponsoredNeedsDisclosureReviewFilter),
                ),
            ]),
        ),

      S.listItem()
        .title("Taxonomy")
        .icon(TagsIcon)
        .child(
          S.list()
            .title("Taxonomy")
            .items([
              S.documentTypeListItem("category").title("Categories"),
              S.documentTypeListItem("tag").title("Tags"),
            ]),
        ),

      S.listItem()
        .title("People")
        .icon(UserIcon)
        .child(
          S.list()
            .title("People")
            .items([S.documentTypeListItem("author").title("Authors")]),
        ),

      siteSettingsItem,

      S.listItem()
        .title("Legacy / Utilities")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Legacy / Utilities")
            .items([
              S.documentTypeListItem("topic").title("Topics / Entities"),
            ]),
        ),

      ...(remainingTypes.length > 0 ? [S.divider(), ...remainingTypes] : []),
    ]);
};
