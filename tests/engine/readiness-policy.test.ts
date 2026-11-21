import { describe, expect, it } from 'vitest'
import { assessReadiness } from '../../src/engine/readiness-policy'

describe('mission readiness policy (synthetic inputs)', () => {
  it('requires positive coverage before advising advancement', () => {
    expect(assessReadiness('verified-safe', [])).toBe('GO_AHEAD')
    expect(assessReadiness('incomplete', [])).toBe('UNVERIFIED')
    expect(assessReadiness('conflicted', [])).toBe('UNVERIFIED')
  })

  it('returns the highest-priority verified warning independent of input order', () => {
    expect(assessReadiness('incomplete', ['save-first', 'last-chance', 'prepare']))
      .toBe('LAST_CHANCE')
    expect(assessReadiness('incomplete', ['prepare', 'save-first', 'last-chance']))
      .toBe('LAST_CHANCE')
    expect(assessReadiness('incomplete', ['save-first', 'prepare']))
      .toBe('DO_THESE_FIRST')
    expect(assessReadiness('incomplete', ['save-first'])).toBe('SAVE_FIRST')
  })

  it('blocks a safe assessment while an independently verified warning applies', () => {
    expect(assessReadiness('verified-safe', ['last-chance'])).toBe('LAST_CHANCE')
  })

  it('preserves independently verified warnings despite a gap in overall coverage', () => {
    expect(assessReadiness('conflicted', ['prepare'])).toBe('DO_THESE_FIRST')
  })
})
