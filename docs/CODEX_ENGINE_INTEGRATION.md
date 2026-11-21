# Strategy engine policy

The first engine modules consume decisions that the future guide gateway has
already authorized and verified. They work with synthetic fixtures and require
no guide records, player-state schema, or app framework.

- `assessReadiness(coverage, warnings)` selects a mission readiness status.
  Supply independently verified, currently applicable warnings only. Keep
  their authorized action references separately for display. Precedence is
  last chance, preparation, then save first. With zero warnings, only verified
  safe coverage permits `GO_AHEAD`.
- `rankRecommendations(candidates, priorityOf)` returns a new array in guide
  priority order. Supply only eligible, outstanding candidates. Rank ties
  ahead of time if a particular order matters because the function preserves
  input order within each priority.

Once the shared contracts land, adapters need to establish eligibility,
reconcile research, attach authorized copy, and map shared coverage and risk
fields to these policy inputs. These functions alone cannot authorize content
or decide whether a source establishes an actual warning.

Run the synthetic policy suite from the repository root with
`npm exec --yes --package=vitest@4.0.18 -- vitest run tests/engine`.

## Foundation integration

The v1 contracts now define the public boundary. Call the four POST routes
from `GUIDE_API` with a `ProgressSnapshot`. Responses use `no-store`; the
gateway projects authorized records and keeps the authored dataset server-side.
The foundation dataset is empty, so verified recommendations require researched
records. Synthetic test records live in the test suite.

The UI can import `createProgressStore()` and `toProgressSnapshot(state)`
from `src/persistence`. Use one store per UI, await `apply` or `undo` before
showing save success, and handle rejected operations explicitly. Import accepts
a parsed backup or JSON text. Preview before import and require user confirmation
for replacement. Merge keeps current values when both profiles have a value,
adds missing values and notes, and retains local history. Use replacement when
a full imported history is needed. Version 1 backups preserve the v1 timeline
and progress; after replacement, undo can restore only the metadata represented
by the public inverse updates. IndexedDB works without a network connection.

The UI still owns cache freshness, offline presentation, and wiring the store
and endpoints into React. Cached evaluations must never widen eligibility.
