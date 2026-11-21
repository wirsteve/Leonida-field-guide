type Coverage = 'verified-safe' | 'incomplete' | 'conflicted'
type VerifiedWarning = 'last-chance' | 'prepare' | 'save-first'
type Readiness = 'GO_AHEAD' | 'LAST_CHANCE' | 'DO_THESE_FIRST' | 'SAVE_FIRST' | 'UNVERIFIED'

// The caller must establish warning eligibility and verify its evidence first.
// This policy only chooses a status and has no access to names or research.
export function assessReadiness(
  coverage: Coverage,
  warnings: readonly VerifiedWarning[],
): Readiness {
  if (warnings.includes('last-chance')) return 'LAST_CHANCE'
  if (warnings.includes('prepare')) return 'DO_THESE_FIRST'
  if (warnings.includes('save-first')) return 'SAVE_FIRST'
  return coverage === 'verified-safe' ? 'GO_AHEAD' : 'UNVERIFIED'
}
