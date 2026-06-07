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
- Do not read `docs/audits/**` unless explicitly asked.
- Do not read generated files like `sanity.types.ts` or `schema.json` unless explicitly required.
- When working with Sanity types, prefer reading source schema/query files instead of generated output.
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
