// Read-only audit for legacy article-family fields in Sanity.
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const TYPES = ["post", "opinion", "analysis", "sponsored"];

const checks = [
  { key: "bodyTextOne", filter: "defined(bodyTextOne)" },
  { key: "storedDate", filter: "defined(date)" },
  { key: "mainHeadlineRank", filter: "defined(mainHeadlineRank)" },
  { key: "frontlineRank", filter: "defined(frontlineRank)" },
  { key: "rightHeadlineRank", filter: "defined(rightHeadlineRank)" },
  { key: "justInRank", filter: "defined(justInRank)" },
  { key: "mainHeadlineUntil", filter: "defined(mainHeadlineUntil)" },
  { key: "frontlineUntil", filter: "defined(frontlineUntil)" },
  { key: "rightHeadlineUntil", filter: "defined(rightHeadlineUntil)" },
  { key: "justInUntil", filter: "defined(justInUntil)" },
  { key: "breakingNewsUntil", filter: "defined(breakingNewsUntil)" },
  { key: "coverEpigraph", filter: "defined(cover.epigraph)" },
  { key: "coverCreditProvider", filter: "defined(cover.creditProvider)" },
  { key: "noBody", filter: "!defined(body) || count(body) == 0" },
  { key: "hasBody", filter: "defined(body) && count(body) > 0" },
  {
    key: "emptySearchText",
    filter: '!defined(searchText) || searchText == ""',
  },
  { key: "hasSearchText", filter: 'defined(searchText) && searchText != ""' },
];

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "raw",
});

const baseFilter = '_type == $type && !(_id in path("drafts.**"))';

async function main() {
  const results = {};

  for (const type of TYPES) {
    results[type] = { total: 0, checks: {} };
    results[type].total = await client.fetch(`count(*[${baseFilter}])`, {
      type,
    });
    for (const { key, filter } of checks) {
      results[type].checks[key] = await client.fetch(
        `count(*[${baseFilter} && (${filter})])`,
        { type },
      );
    }
  }

  const samples = await client.fetch(
    `{
      "bodyTextOne": *[_type in $types && defined(bodyTextOne)][0...5]{
        _id, _type, "slug": slug.current,
        "bodyTextOneLen": length(bodyTextOne),
        "hasBody": defined(body) && count(body) > 0
      },
      "storedDate": *[_type in $types && defined(date)][0...5]{
        _id, _type, "slug": slug.current, date, publishedAt
      },
      "rankFields": *[_type in $types && (
        defined(mainHeadlineRank) || defined(frontlineRank) ||
        defined(rightHeadlineRank) || defined(justInRank)
      )][0...5]{
        _id, _type, "slug": slug.current,
        mainHeadlineRank, frontlineRank, rightHeadlineRank, justInRank
      },
      "untilFields": *[_type in $types && (
        defined(mainHeadlineUntil) || defined(frontlineUntil) ||
        defined(rightHeadlineUntil) || defined(justInUntil) ||
        defined(breakingNewsUntil)
      )][0...5]{
        _id, _type, "slug": slug.current,
        mainHeadlineUntil, frontlineUntil, rightHeadlineUntil,
        justInUntil, breakingNewsUntil
      },
      "coverLegacy": *[_type in $types && (
        defined(cover.epigraph) || defined(cover.creditProvider)
      )][0...10]{
        _id, _type, "slug": slug.current, status,
        "caption": cover.caption,
        "epigraph": cover.epigraph,
        "creditSource": cover.creditSource,
        "creditProvider": cover.creditProvider
      },
      "coverLegacyEpigraphOnly": count(*[_type in $types && defined(cover.epigraph) && !defined(cover.caption)]),
      "coverLegacyProviderOnly": count(*[_type in $types && defined(cover.creditProvider) && !defined(cover.creditSource)]),
      "bodyWithoutTextBlocks": *[_type in $types && defined(body) && count(body) > 0 && count(body[_type == "block"]) == 0][0...5]{
        _id, _type, "slug": slug.current, "bodyTypes": body[]._type
      },
      "publishedMissingBody": *[_type in $types && status == "published" && (!defined(body) || count(body) == 0)][0...5]{
        _id, _type, "slug": slug.current, status
      },
      "bodyTextOneWithBody": count(*[_type in $types && defined(bodyTextOne) && defined(body) && count(body) > 0]),
      "bodyTextOneWithoutBody": count(*[_type in $types && defined(bodyTextOne) && (!defined(body) || count(body) == 0)])
    }`,
    { types: TYPES },
  );

  const bodyBlockTypes = await client.fetch(
    `array::unique(*[_type in $types && defined(body) && count(body) > 0].body[]._type)`,
    { types: TYPES },
  );

  console.log(
    JSON.stringify(
      {
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        auditedAt: new Date().toISOString(),
        perspective:
          "raw (published + draft ids without drafts. prefix filter on published docs only)",
        note: "Counts exclude draft-prefixed _id documents",
        results,
        samples,
        bodyBlockTypes,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
