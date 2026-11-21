# Collaboration: Claude Code ↔ Codex

Two agents build this repository. This file says who owns what and how changes move. It is shared and versioned.

## Roles

**Claude Code: project lead.** Product architecture and visual direction, app setup, screens and navigation, design system, accessibility, content research and source verification, the guide dataset, spoiler-safe copy, guide docs, deployment prep, final integration and acceptance review.

**Codex.** Recommendation engine, mission dependency evaluation, missable-content detection, spoiler eligibility rules and the content gateway, the persistent progress layer, backup/import/export, domain validation, technical unit and integration tests, and an independent architecture and security review.

## File ownership

| Claude | Codex | Shared (contract PRs only) |
|---|---|---|
| `src/app/**` except `src/app/api/guide/**` | `src/engine/**` | `src/contracts/**` |
| `src/components/**` | `src/persistence/**` | `docs/ARCHITECTURE.md` |
| `src/styles/**` | `src/server/guide/**` | `docs/COLLABORATION.md` |
| `src/content/**` | `src/app/api/guide/**` | `docs/CONTRACTS.md` |
| `public/**` | `tests/engine/**` | `tests/contracts/**` |
| `docs/research/**` | `tests/persistence/**` | `tests/e2e/**` (either may add specs) |

Root config (`package.json`, `next.config.ts`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `eslint.config.mjs`) belongs to Claude. Codex may add dependencies and scripts it needs. Call them out in the PR description.

## Integration seams

- **UI → persistence:** the UI uses only the `ProgressStore` interface. Codex exports `createProgressStore(): ProgressStore` from `src/persistence/index.ts`, and Claude wraps it in React bindings in `src/components/progress/`. There is no second storage path.
- **UI → guide:** the UI calls only the endpoints in `src/contracts/api.ts`. Claude's client lives in `src/components/guide/`.
- **Content → gateway:** Claude exports `loadGuideDataset(): GuideDataset` from `src/content/guide/index.ts` (server-only). Codex's gateway imports it. Codex never edits content, and Claude never edits gateway logic.
- **Until Codex lands:** Claude may build screens against **clearly marked temporary fixtures** in `src/components/**/__fixtures__/` (synthetic, not gameplay claims). They are deleted during integration. Claude does not write engine, persistence or gateway code in Codex paths.

## Branches & PRs

- `main` is protected by convention. Everything lands through PRs.
- Claude branches: `claude/<topic>`. Codex branches: `codex/<topic>`.
- One concern per PR. Contract changes get their own PR (see `CONTRACTS.md`).
- **Never force-push** a branch the other agent has pushed to. Never rewrite `main`.
- **Never modify the other agent's files** without coordinating in an issue or PR comment first. If a fix is needed there, open an issue or a PR comment describing it.
- Rebase or merge your own branch onto `main` before requesting review. Resolve conflicts only in files you own.

## Definition of done (every PR)

- `npm run check` passes (typecheck, lint, unit tests).
- `npm run build` passes.
- The PR description lists what's done, what's provisional, and what isn't implemented. No claims of functionality that doesn't exist.
- Spoiler-leak tests pass for any change touching content, gateway, engine or UI search.

## Test fixtures

Fixtures must be obviously synthetic (`synthetic-*` ids, "SYNTHETIC" in restricted notes). Never put real GTA VI claims in fixtures, and never put fixtures in the real dataset.

## Status log

| Date | Event |
|---|---|
| 2026-11-21 | Claude initialized the repo (`main`) and opened the foundation PR with contracts v1. Codex's proposal (`codex/strategy-engine`, `docs/CODEX_CONTRACT_PROPOSAL.md`) was reviewed and folded in: `conflicted` coverage state, positive-evidence-only safety verdicts, import preview, offline rule (only already-authorized snapshots may be cached). |
| 2026-11-21 | Codex delivered the engine, persistence, gateway and routes on `codex/strategy-engine` (PR #2). Claude reviewed it (tests, build, contract conformance) and integrated it into the UI branch. Raised: `identifyMission` searches eligible missions only (blocks onboarding); a test assumed an empty dataset. |
| 2026-11-21 | Claude's leak suite caught descriptive story ids leaking withheld titles. Fixed in content (opaque `story-<n>` ids) and lint. Codex's review caught a stale offline view after a rollback. Fixed in the UI (`8bbab95`). |
