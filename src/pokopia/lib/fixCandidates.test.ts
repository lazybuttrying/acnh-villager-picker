import { describe, expect, it } from 'vitest'
import type { Pokemon } from '../data/types'
import { fixCandidates } from './recommend'

function mk(id: string, specialties: string[], score = 0, dex = 0): Pokemon & { score: number } {
  return {
    id,
    dex,
    names: { ko: id, en: id, ja: id },
    nameEn: id,
    types: ['Normal'],
    specialties,
    habitat: 'Bright',
    natId: 0,
    image: '',
    score,
  }
}

function scoresOf(list: (Pokemon & { score: number })[]): Record<string, number> {
  const s: Record<string, number> = {}
  for (const p of list) s[p.id] = p.score
  return s
}

describe('fixCandidates', () => {
  it('suggests holders for missing specialties, best score first', () => {
    const team = [mk('a', ['Build'])]
    const pool = [
      mk('weak-chop', ['Chop'], 1, 5),
      mk('strong-chop', ['Chop'], 4, 9),
      mk('mid-chop', ['Chop'], 2, 1),
      mk('extra-chop', ['Chop'], 0, 2),
      mk('water', ['Water'], 3, 3),
    ]
    const out = fixCandidates(team, pool, scoresOf(pool))
    const chop = out.find((f) => f.specialty === 'Chop')
    expect(chop?.candidates.map((p) => p.id)).toEqual(['strong-chop', 'mid-chop', 'weak-chop'])
    const water = out.find((f) => f.specialty === 'Water')
    expect(water?.candidates.map((p) => p.id)).toEqual(['water'])
  })

  it('omits covered specialties and specialties nobody in the pool has', () => {
    const team = [mk('a', ['Build'])]
    const pool = [mk('b', ['Chop'])]
    const out = fixCandidates(team, pool, {})
    expect(out.map((f) => f.specialty)).toEqual(['Chop'])
  })

  it('never suggests a pokemon already on the team', () => {
    const team = [mk('a', ['Build']), mk('b', ['Chop'])]
    const pool = [mk('b', ['Chop']), mk('c', ['Water'])]
    const out = fixCandidates(team, pool, {})
    for (const f of out) {
      expect(f.candidates.map((p) => p.id)).not.toContain('b')
    }
  })
})
