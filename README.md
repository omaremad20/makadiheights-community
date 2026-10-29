# Makadi Heights Community Portal

Public, read-only portal for Makadi Heights owners, residents, tenants and guests: department contacts,
the commercial directory, banking details, shuttle times, security guidance, Serenity beach access and
menu, membership prices with a VAT calculator, rules and penalties, fillable PDF forms, and a library of
all original documents.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · Supabase (Postgres + Storage) · pdf-lib.

## Getting started

```bash
cp .env.example .env.local   # add the project URL and publishable key
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run lint` | ESLint |
| `npm run typecheck` | Route type generation + `tsc --noEmit` |
| `npm test` | Unit tests (membership calculation, phone links) |
| `npm run forms:build` | Rebuild the blank form PDFs (needs Playwright + Chromium) |
| `node --env-file=.env.local scripts/verify-readonly.mjs` | Prove public access is read-only |

## How it fits together

- `app/` — one route per section; pages are Server Components that stream data inside `<Suspense>`.
- `lib/data/queries.ts` — all Supabase reads, cached with `"use cache"` (`cacheLife("minutes")`), so
  Dashboard edits show up within about a minute. Reads never throw; failures render an error state.
- `lib/supabase/public.ts` — cookie-less client for public data. The existing `client.ts`, `server.ts` and
  `proxy.ts` (SSR/cookie clients) are kept for any future authenticated features.
- `components/` — shared UI (`ui/`), layout, and feature components. Client Components are limited to
  interactive parts: menu, search/filters, copy buttons, calculator, PDF preview and forms.
- `supabase/migrations/` — schema, RLS/grants and seed data (already applied to the project).
- `docs/DATA_SOURCES.md` — which document feeds which table, deduplication decisions, items for review.
- `docs/SECURITY.md` — the read-only security model and how it was verified.

## Brand

Colours `#88BCBB`, `#2D6867`, `#000000`, `#FFFFFF` (tokens in `app/globals.css`). Fonts: Boowie
(brand, not yet bundled — see the note in `app/globals.css`) with Times New Roman as the
secondary/fallback. The header logo is a crop of `public/makadi-heights-logo.webp` with its white
background made transparent (`public/brand/makadi-heights-wordmark.png`). Light mode only, English only.
