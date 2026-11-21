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
