const priorityOrder = {
  missable: 0,
  irreversible: 1,
  'time-limited': 2,
  preparation: 3,
  'current-stage': 4,
  optional: 5,
  exploration: 6,
  postponable: 7,
} as const

type RecommendationPriority = keyof typeof priorityOrder

// Candidates must already be eligible and classified using verified evidence.
// Stable sorting lets the caller supply its own tie-breaking order.
export function rankRecommendations<Candidate>(
  candidates: readonly Candidate[],
  priorityOf: (candidate: Candidate) => RecommendationPriority,
): Candidate[] {
  return [...candidates].sort(
    (left, right) => priorityOrder[priorityOf(left)] - priorityOrder[priorityOf(right)],
  )
}
