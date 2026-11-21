import { describe, expect, it } from 'vitest'
import { rankRecommendations } from '../../src/engine/recommendation-priority'

describe('recommendation priority (synthetic inputs)', () => {
  it('puts verified missables and irreversible risks before routine activities', () => {
    expect(rankRecommendations([
      'postponable', 'optional', 'preparation', 'irreversible',
      'exploration', 'current-stage', 'time-limited', 'missable',
    ], priority => priority)).toEqual([
      'missable', 'irreversible', 'time-limited', 'preparation',
      'current-stage', 'optional', 'exploration', 'postponable',
    ])
  })

  it('preserves the supplied order for ties and leaves the input intact', () => {
    const candidates = [
      { id: 'fixture-b', priority: 'optional' },
      { id: 'fixture-a', priority: 'optional' },
      { id: 'fixture-c', priority: 'missable' },
    ] as const

    expect(rankRecommendations(candidates, candidate => candidate.priority)
      .map(candidate => candidate.id)).toEqual(['fixture-c', 'fixture-b', 'fixture-a'])
    expect(candidates.map(candidate => candidate.id))
      .toEqual(['fixture-b', 'fixture-a', 'fixture-c'])
  })
})
