# Shared Contracts — v1

Source of truth: `src/contracts/` (TypeScript types and zod schemas). This page explains intent. If the two disagree, the code wins, and the disagreement is a bug to fix in a contract PR.

`CONTRACT_VERSION = 1`, `PLAYER_STATE_SCHEMA_VERSION = 1`.

## Modules

| File | Contents | Producer → Consumer |
|---|---|---|
| `evidence.ts` | `SourceEvidence`, `Confidence`, `VerificationStatus`, `PublicSourceSummary` | Content (Claude) → engine/gateway (Codex) |
| `guide-record.ts` | `GuideRecord`, `Requirement`, `PublicContent`, `RestrictedResearch`, `StageEditorial`, `GuideDataset` | Content (Claude) → gateway/engine (Codex). **Server-only.** |
| `player-state.ts` | `PlayerState`, `ProgressUpdate`, `TimelineEvent`, `ProgressSnapshot`, `BackupFile`, `ProgressStore` | Persistence (Codex) ↔ UI (Claude) |
| `public-guide.ts` | `PublicGuideRecord`, `Recommendation`, `AdvancementReadiness`, `MoneyAdvice`, `StrategyPlan`, `GuideEvaluation`, `MissionCheckResult` | Gateway (Codex) → UI (Claude) |
| `api.ts` | Endpoint paths and request/response types | Route handlers (Codex) ↔ UI client (Claude) |
| `schemas.ts` | zod schemas for snapshots, updates, player state, backups, records, dataset | Used at every trust boundary |

## Key semantics

### Requirements (server-only)
`Requirement` is a small boolean language over player progress: `completed`, `discovered`, `all`, `any`, `not`, `always`, `never`. A record has:
- `visibleWhen`: may the player know this exists?
- `availableWhen` (defaults to `visibleWhen`): can they do it now?
- `expiresWhen`: once true, it's gone for good (missable).

### Status mapping (visible records)
| Condition | `PublicRecordStatus` |
|---|---|
| marked `complete` | `completed` |
| marked `unsure` | `unsure` |
| `expiresWhen` true and not complete | `closed` (reason never given) |
| otherwise | `available` |

A `closed` record must still pass `visibleWhen`. If `availableWhen` is false while `visibleWhen` is true, the record is not projected at all. That avoids "locked" teasers.

### Last chance
`lastChance = true` only when all of these hold:
1. The record is available and not complete.
2. It has an `expiresWhen` that becomes true if some currently visible story mission is completed (the gateway can test this hypothetically).
3. The record's evidence for the expiry is at least `medium` confidence.

The player sees `lastChanceCopy` (or a generic "Last chance: finish this before continuing."). Never the restricted explanation.

### Readiness
| Status | When |
|---|---|
| `last-chance` | any available record is in a verified last-chance window |
| `complete-these-first` | verified `before-advancing` records remain |
| `safe-to-advance` | nothing blocking AND the current stage's `editorial.verification === "verified"` |
| `not-fully-verified` | nothing *known* to block, but coverage is `partial`, `conflicted` or `unverified` |

### Check Before Starting (`/api/guide/check`)
Input is a record id from suggestions, or free text. Output verdicts:
`go-ahead` (verified, nothing outstanding) · `do-these-first` · `last-chance` · `save-first` (nothing outstanding, but the mission has `saveBeforeStarting`) · `unverified` (no match, or coverage not verified).

`matched: null` with verdict `unverified` is the only response for unknown **and** ineligible text, and it is byte-for-byte identical apart from echoing nothing of the query.

### Player marks
`complete | incomplete | unsure`, or absent. `unsure` is never treated as complete. Onboarding never infers optional completions; it may imply **story** predecessors of an identified story mission (`/api/guide/identify` → `impliedComplete`), and the UI asks the player to confirm before writing them.

### Persistence
- One store (`ProgressStore`), IndexedDB-backed, versioned schema with migrations.
- `apply(update, label)` appends a `TimelineEvent` holding its `inverse`; `undo()` applies the inverse and flags the event `undone`.
- `previewImport` validates without writing; `importBackup(file, "replace" | "merge")`.
- Updates to the guide content never mutate `PlayerState`. Snapshot ids unknown to the dataset are ignored server-side, not deleted client-side.

## Changing a contract
1. Open a PR that touches only `src/contracts/`, `docs/CONTRACTS.md` and the conformance tests.
2. Bump `CONTRACT_VERSION` for breaking changes. Additive optional fields don't need a bump.
3. The other agent reviews before merge. Implementation PRs then follow separately.
