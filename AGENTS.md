# Agent Instructions

This is the only default context file agents should read.

## Project

Next.js App Router application using TypeScript, Tailwind, Sanity CMS, Supabase, Stripe, Jest/React Testing Library, and Playwright.

## Core Rules

- Keep changes surgical and limited to the requested task.
- Do not modify unrelated files.
- Do not change layout, styling, UX, or runtime behavior unless explicitly requested.
- Prefer frontend-only changes unless backend changes are required to unblock the task.
- Before implementing large changes, identify impacted files and provide a short plan.
- Do not read archived docs unless explicitly asked.
- Do not reinstall or recreate skills unless explicitly asked.

## Important Paths

- App routes: `app/`
- Components: `app/components/`
- Sanity-related code: `sanity/` and Sanity query/schema files
- Tests: `__tests__/`, `tests/`
- Archived docs: `docs/archive/` — do not read by default

## Standard Validation

Run the relevant checks after changes:

```bash
npx tsc --noEmit
npm run lint
npm run test:unit
```

For E2E-sensitive changes, also run:

```bash
npm run test:e2e
npx playwright show-report
```

## Performance / SEO Rule

Do not introduce visual regressions, layout shifts, or unnecessary client-side JavaScript.

## Sanity CMS publishing

When creating or publishing Sanity content, read [`docs/sanity-publishing.md`](docs/sanity-publishing.md):

- Article body goes in **`body`** (Portable Text) only — never `bodyTextOne`, `bodyBlocks`, or `bodyRich`.
- Repo schema files are the source of truth; MCP `get_schema` can lag until `/studio` is deployed and opened.
- Ingestion pipeline: Gunner creates drafts only; humans publish in Studio.
- Audit legacy fields: `npm run sanity:audit-legacy-fields`

## Sanity MCP

Sanity MCP is configured in `opencode.json` as a remote server at `https://mcp.sanity.io`. To authenticate:

```bash
opencode mcp auth sanity
```

This opens a browser for OAuth authorization. Once authenticated, you can use Sanity tools by mentioning `sanity` in prompts (e.g., run GROQ queries, manage documents, explore schema).
