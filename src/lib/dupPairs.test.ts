import { describe, expect, it } from 'vitest'
import { dupPairs } from './dupPairs'

describe('dupPairs', () => {
  it('returns 0 for empty and singleton groups', () => {
    expect(dupPairs(new Map())).toBe(0)
    expect(dupPairs(new Map([['a', 1], ['b', 1]]))).toBe(0)
  })

  it('counts pairs within each group', () => {
    expect(dupPairs(new Map([['a', 3]]))).toBe(3)
    expect(dupPairs(new Map([['a', 2], ['b', 2]]))).toBe(2)
  })
})
