import { describe, expect, it } from 'vitest'
import type { Pokemon } from '../data/types'
import { PRESETS, recommend, scoreBreakdown, coveredSpecialties, formHouses } from './recommend'

function mk(id: string, specialties: string[], types: string[], score = 0, habitat = 'Bright'): Pokemon & { score: number } {
  return {
    id,
    dex: 0,
    names: { ko: id, en: id, ja: id },
    nameEn: id,
    types,
    specialties,
    habitat,
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

describe('pokopia recommend', () => {
  it('fills the team to the requested size', () => {
    const pool = Array.from({ length: 20 }, (_, i) => mk(`p${i}`, ['Build'], ['Normal']))
    const { team } = recommend(pool, {}, PRESETS.fav, 10)
    expect(team).toHaveLength(10)
  })

  it('prefers higher rated pokemon', () => {
    const pool = [
      mk('low', ['Build'], ['Normal'], 1),
      mk('high', ['Chop'], ['Fire'], 4),
      ...Array.from({ length: 9 }, (_, i) => mk(`f${i}`, ['Water'], ['Water'], 0)),
    ]
    const { team } = recommend(pool, scoresOf(pool), PRESETS.fav, 3)
    expect(team.map((p) => p.id)).toContain('high')
  })

  it('keeps pinned members and never swaps them out', () => {
    const pool = Array.from({ length: 15 }, (_, i) => mk(`p${i}`, ['Build'], ['Normal'], 4))
    const pinned = [mk('pin', ['Yawn'], ['Normal'], 0)]
    const { team } = recommend(pool, scoresOf(pool), PRESETS.specialty, 5, pinned)
    expect(team.map((p) => p.id)).toContain('pin')
    expect(team).toHaveLength(5)
  })

  it('rewards specialty coverage', () => {
    const a = mk('a', ['Build'], ['Normal'], 0)
    const b = mk('b', ['Build'], ['Normal'], 0)
    const c = mk('c', ['Water'], ['Normal'], 0)
    const bd = scoreBreakdown([a, b, c], {}, PRESETS.specialty)
    expect(bd.coverage).toBe(2)
    expect(bd.covered).toEqual(['Build', 'Water'])
    expect(bd.missing).toContain('Chop')
  })

  it('ignores the unknown specialty marker for coverage', () => {
    const x = mk('x', ['???'], ['Normal'])
    expect(coveredSpecialties([x]).size).toBe(0)
  })

  it('penalizes duplicate types', () => {
    const a = mk('a', ['Build'], ['Fire'], 0)
    const b = mk('b', ['Chop'], ['Fire'], 0)
    const c = mk('c', ['Water'], ['Water'], 0)
    const dup = scoreBreakdown([a, b], {}, PRESETS.type)
    const diverse = scoreBreakdown([a, c], {}, PRESETS.type)
    expect(dup.typeDup).toBe(1)
    expect(diverse.total).toBeGreaterThan(dup.total)
  })
})

describe('formHouses', () => {
  it('never puts more than 4 in a house', () => {
    const team = Array.from({ length: 12 }, (_, i) => mk(`p${i}`, ['Build'], ['Normal'], 0, i % 2 ? 'Bright' : 'Dark'))
    const houses = formHouses(team, {}, 3)
    expect(houses).toHaveLength(3)
    for (const h of houses) expect(h.length).toBeLessThanOrEqual(4)
    expect(houses.flat()).toHaveLength(12)
  })

  it('keeps housemates in the same habitat when possible', () => {
    const team = [
      ...Array.from({ length: 4 }, (_, i) => mk(`b${i}`, ['Build'], ['Normal'], 0, 'Bright')),
      ...Array.from({ length: 4 }, (_, i) => mk(`d${i}`, ['Chop'], ['Normal'], 0, 'Dark')),
    ]
    const houses = formHouses(team, {}, 2)
    expect(houses).toHaveLength(2)
    for (const h of houses) {
      expect(new Set(h.map((p) => p.habitat)).size).toBe(1)
    }
  })

  it('splits houses to reach the requested count', () => {
    const team = Array.from({ length: 8 }, (_, i) => mk(`p${i}`, ['Build'], ['Normal']))
    const houses = formHouses(team, {}, 4)
    expect(houses).toHaveLength(4)
    for (const h of houses) expect(h.length).toBe(2)
  })
})
