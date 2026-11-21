# Codex ↔ Claude integration contract proposal (review required)

**Status:** Superseded by [shared contracts v1](CONTRACTS.md). This document preserves the original proposal. **Owner:** Codex (engine, persistence, spoiler QA). **Approver:** Claude Code (app shell, research, UI, contracts).

**Why this file exists:** The initial commit on `main` contains only `README.md` and `.gitignore`. Its README says the app shell, tooling and shared contracts will arrive in a subsequent foundation pull request. At review time `docs/ARCHITECTURE.md`, `docs/COLLABORATION.md`, `docs/CONTRACTS.md`, and `src/contracts/` do not yet exist. Per the collaboration instruction, do not implement an incompatible substitute application or unilaterally create shared contracts.

## Decisions Claude needs to approve before engine implementation

1. **Authoritative types and exports.** Claude provides `src/contracts/` with the shared `PlayerState`, `AuthorizedGuideSnapshot`, `Recommendation`, `MissionReadiness`, `MoneyPlan` and `Coverage` types (or points to approved equivalents). Codex imports them, does not redefine equivalent public contracts.
2. **Runtime boundaries.** Research source (with future names, aliases, narrative explanations, dependencies and sensitive reward information) is **server-only**, never in `public/`, client imports, service worker precache, bundled static manifests, autocomplete indices or general search payloads. An authorized gateway issues filtered records and safe display strings. Suppress hidden IDs, counts, totals, search hints and indirect leaks. The server needs a per-request eligibility assessment; an empty-filter result never establishes full coverage.
3. **Visibility inputs.** Define how the gateway receives confirmed current chapter, completed missions, known missions, discovered characters/locations and activities. An offline cache may contain **only previously authorized** snapshots. On progression while offline, mark new intelligence unavailable until reconnected; never expand eligibility using a cached future database.
4. **Coverage/evidence.** For each candidate mission the provider distinguishes `VERIFIED_SAFE`, `VERIFIED_RISK`, `INCOMPLETE` and `CONFLICTED` (names negotiable) backed by source references and last checked date. Absence of a reported warning is not `VERIFIED_SAFE`. A `GO_AHEAD` readiness result requires explicit sufficient positive coverage. A `LAST_CHANCE` warning requires source-backed expiry evidence and that both activity and trigger mission are currently visible.
5. **Persistence owner.** Codex owns one IndexedDB adapter with versioned schema, explicit write result, undo, export/import preview, validated merge or replace and migration tests. Claude consumes its exported functions/hooks. No competing player-state datastore. Only client-confirmed state is persisted, and evidence-based inferred history needs confirmation.
6. **Testing boundaries.** Claude exposes a build/test command and an authorized gateway integration seam; Codex adds deterministic Vitest fixtures, optional Playwright integration checks, and a build artifact audit for forbidden server research. Test fixtures must be conspicuously synthetic, not gameplay claims.

## Minimal behavior contract (semantics, not binding field names)

```text
recommendNext(progress, authorizedSnapshot) -> {
  highestPriorityAction?, recommendations[], stageReadiness, coverage
}
checkMissionReadiness(knownMissionId, progress, authorizedSnapshot) -> {
  status: GO_AHEAD | DO_THESE_FIRST | LAST_CHANCE | SAVE_FIRST | UNVERIFIED,
  warnings[], evidence
}
planEarnings(progress, authorizedSnapshot, targetCash?) -> {
  recommendedMethod?, alternatives[], estimatedEarnings?, estimatedEfficiency?,
  grindingAssessment, confidence
}
resolveMissionAlias(input, authorizedNamesAndAliases) -> {
  status: MATCH | CONFIRM | UNKNOWN, candidates[]
}
```

Only authoritatively eligible, spoiler-safe labels/copy can cross these interfaces. Deterministic sorting must prioritize verified last-chance and irreversible risks, then time limits and preparation, followed by valuable activities; completed and ineligible items are removed. Incomplete or conflicting evidence becomes `UNVERIFIED`, *never* a fabricated warning or claim of safety. Never infer repeatability or payouts from missing data.

## Test acceptance gates for the first engine PR

- Verified synthetic missable-before-mission case generates the exact safe warning; unknown expiry does not.
- Verified safe coverage can permit `GO_AHEAD`; missing/conflicting coverage cannot.
- Future-name leakage checks across strategy, readiness, gateway, autocomplete, responses, cache and build assets.
- Completion/undo changes recommendations without inferring prior mission completion.
- Cash and one-time opportunity completion update money plans predictably.
- IndexedDB simulated reload, schema migration, valid/invalid backup, preview, merge/replace.
- Offline access retains previously-authorized records only and exposes qualified offline coverage.
- Regression checks under guide-data refresh; field-level source verification/conflict checks.

## Implementation

The foundation landed in PR #3. The shared contracts now govern the engine,
gateway, and progress store. See [integration notes](CODEX_ENGINE_INTEGRATION.md)
for the implemented interfaces and test instructions.
