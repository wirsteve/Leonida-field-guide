# Architecture

Leonida Field Guide is an iPhone-first PWA that tells a GTA VI player the smartest thing to do next **without revealing anything about future progress**. This document is a shared, versioned artifact: change it only through a dedicated PR (see `COLLABORATION.md`).

## Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript (strict) | Server-side content filtering + static app shell in one deployable unit. |
| Styling | Tailwind CSS v4 with design tokens in `src/styles/tokens.css` | Token-driven, no runtime CSS-in-JS. |
| Icons | `lucide-react` | Consistent line icons; used sparingly. |
| Validation | `zod` v4 (`src/contracts/schemas.ts`) | Runtime checks at every trust boundary. |
| Personal progress | IndexedDB via `idb`, behind the `ProgressStore` interface (`src/persistence`) | Survives refreshes and app updates; no account, no backend database. |
| Tests | Vitest (unit/contract), Playwright (iPhone viewports) | |
| Hosting | Vercel (Node runtime) | Free tier is sufficient; no paid APIs; no AI key required at runtime. |

No authentication, no external database, no paid API and no LLM calls at runtime.

## The spoiler boundary (the core design constraint)

```
 ┌──────────────── device (client) ────────────────┐        ┌──────────── server (Vercel function) ────────────┐
 │ UI (src/app, src/components)                     │        │ /api/guide/*  (src/app/api/guide)                 │
 │   │                                              │  POST  │   │ validate snapshot (zod)                      │
 │   ├─ ProgressStore (src/persistence, IndexedDB) ─┼──────▶ │   ▼                                               │
 │   │     PlayerState → ProgressSnapshot           │snapshot│ gateway (src/server/guide)                        │
 │   │                                              │        │   │ loads GuideDataset (src/content, server-only) │
 │   ◀──────────── GuideEvaluation (public only) ───┼─────── │   │ engine (src/engine) evaluates eligibility,   │
 │   renders only what it receives                  │        │   │ recommendations, readiness, checks           │
 └──────────────────────────────────────────────────┘        │   ▼ projects to Public* types, redacts, audits    │
                                                             └───────────────────────────────────────────────────┘
```

Rules:

1. **Authored research is server-only.** Every module under `src/content/guide/` starts with `import "server-only"`, so importing it from client code fails the build. Research never goes in `public/`, client bundles, the service worker precache, static manifests, or search indexes.
2. **The client never filters.** It never receives ineligible records and then hides them. Filtering happens in the gateway; CSS and conditional rendering are not spoiler controls.
3. **Only `Public*` types cross the boundary** (`src/contracts/public-guide.ts`). Requirement trees, sequence numbers, chapter numbers of ineligible records, restricted notes, evidence URLs and claim text never cross.
4. **No leaking denominators.** Progress counters are computed over visible records only. Collectible totals are shown only when the author marks the total itself as non-spoiler.
5. **Search is bounded.** Autocomplete (`/api/guide/suggest`) matches only eligible records. Identification (`/api/guide/identify`) accepts an exact normalized name or verified alias, and a miss looks identical to a non-existent name. No prefix or fuzzy hints come from ineligible records.
6. **Un-started story missions use neutral labels** unless the author marked the title safe (`nameSafeBeforeStart`).
7. **Safety needs positive evidence.** `safe-to-advance` and `go-ahead` require `verified` coverage. A missing warning is not evidence of safety, and `partial`, `conflicted` and `unverified` coverage produce hedged verdicts (`not-fully-verified` / `unverified`).
8. **Last chance needs evidence.** A last-chance warning requires source-backed expiry evidence, and both the activity and its trigger must be visible to the player. Copy says *what* and *when*, never *why*.
9. **Offline.** The client may cache only evaluations it has already received. These were authorized for the progress at the time. It must never widen eligibility offline. If progress changes while offline, it shows the cached view marked as possibly stale.
10. **Responses are `Cache-Control: no-store`** and use POST, so snapshots don't appear in URLs or shared caches.

## Directory map & ownership

| Path | Owner | Purpose |
|---|---|---|
| `src/contracts/` | **Shared** (Claude authored v1) | Types and zod schemas. Changes go through a dedicated contract PR. |
| `src/app/` (except `src/app/api/guide/`) | Claude | Routes, layouts, screens, manifest. |
| `src/components/` | Claude | Design-system and screen components; guide API client; ProgressStore React bindings. |
| `src/styles/` | Claude | Tokens and base CSS. |
| `src/content/` | Claude | Authored guide dataset (server-only) and content tooling. |
| `public/` | Claude | Icons and static assets (never research). |
| `docs/research/` | Claude | Research notes, sources, spoiler style guide. |
| `src/engine/` | **Codex** | Pure evaluation: eligibility, recommendations, readiness, missables, checks, money advice. |
| `src/persistence/` | **Codex** | IndexedDB `ProgressStore`, migrations, backup and import, undo. |
| `src/server/guide/` | **Codex** | Content gateway: load and validate the dataset, run the engine, project and redact, audit output. |
| `src/app/api/guide/` | **Codex** | Thin route handlers for the endpoints in `src/contracts/api.ts`. |
| `tests/engine/`, `tests/persistence/` | **Codex** | Engine and persistence tests. |
| `tests/contracts/`, `tests/e2e/` | Shared | Contract conformance, spoiler-leak and iPhone end-to-end tests. |
| `docs/ARCHITECTURE.md`, `docs/COLLABORATION.md`, `docs/CONTRACTS.md` | Shared | |

## Data flow for one screen

1. A UI screen reads `PlayerState` from the `ProgressStore` (Codex) through Claude's React bindings.
2. It derives a `ProgressSnapshot` and POSTs it to `/api/guide/evaluate`.
3. The gateway validates the snapshot, drops unknown ids, evaluates, and returns a `GuideEvaluation`.
4. The screen renders. User actions (for example *Mark complete*) call `ProgressStore.apply(...)`, which appends a timeline event with its inverse for undo, then re-evaluates.

## Content pipeline

Research → `docs/research/` notes (sources, dates, confidence) → authored `GuideRecord`s in `src/content/guide/` → `npm run content:validate` (schema, referential integrity, evidence rules) → the gateway loads them at runtime. Updating guide data never touches personal progress. Progress lives only on the device, and unknown ids in a snapshot are ignored.

## PWA

- `src/app/manifest.ts` and the icons in `public/icons/` make the app installable from Safari (Share → Add to Home Screen).
- `viewport-fit=cover` plus `env(safe-area-inset-*)` handle the notch and the home indicator.
- A minimal service worker (added with the full UI) caches the app shell only. It never clears IndexedDB, so updates can't erase progress.
