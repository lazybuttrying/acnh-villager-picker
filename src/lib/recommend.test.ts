import { describe, it, expect } from 'vitest'
import type { Villager, Scores, PersonalityKey } from '@/data/types'
import { PERSONALITY_KEYS, TEAM_SIZE, TIER_SCORE } from '@/data/types'
import { recommend, totalScore, dupPairs, coverageOK, PRESETS } from './recommend'

function mk(
  id: string,
  personality: PersonalityKey,
  species: string,
): Villager {
  return {
    id,
    names: { ko: id, en: id, ja: id },
    nameEn: id,
    personality,
    species,
    gender: 'Male',
    image: '',
  }
}

function countSpeciesPairs(team: Villager[]): number {
  const m = new Map<string, number>()
  for (const v of team) m.set(v.species, (m.get(v.species) ?? 0) + 1)
  return dupPairs(m)
}

describe('helpers', () => {
  it('dupPairs counts pairs per group', () => {
    expect(dupPairs(new Map([['a', 3], ['b', 1]]))).toBe(3)
    expect(dupPairs(new Map([['a', 2], ['b', 2]]))).toBe(2)
  })

  it('coverageOK requires all 8 personalities', () => {
    const full = PERSONALITY_KEYS.map((p, i) => mk(`v${i}`, p, 'Cat'))
    expect(coverageOK(full)).toBe(true)
    expect(coverageOK(full.slice(0, 7))).toBe(false)
  })
})

describe('recommend', () => {
  // ① Full coverage -> team of 10, all 8 personalities, missing empty.
  it('returns a full team covering all 8 personalities', () => {
    const pool: Villager[] = []
    const speciesList = ['Cat', 'Dog', 'Bear', 'Bird']
    PERSONALITY_KEYS.forEach((p, pi) => {
      for (let k = 0; k < 3; k++) {
        pool.push(mk(`${p}-${k}`, p, speciesList[(pi + k) % speciesList.length]))
      }
    })
    const scores: Scores = {}
    for (const v of pool) scores[v.id] = Math.floor(Math.random() * 4) + 1

    const res = recommend(pool, scores, PRESETS.fav)
    expect(res.team.length).toBe(TEAM_SIZE)
    expect(coverageOK(res.team)).toBe(true)
    expect(res.missing).toEqual([])
    // no duplicate villagers
    expect(new Set(res.team.map((v) => v.id)).size).toBe(TEAM_SIZE)
  })

  // ② recommend (greedy+localsearch) score >= hand-built greedy baseline.
  it('local search does not do worse than a greedy baseline', () => {
    const pool: Villager[] = []
    const speciesList = ['Cat', 'Dog', 'Bear', 'Bird', 'Frog']
    PERSONALITY_KEYS.forEach((p, pi) => {
      for (let k = 0; k < 4; k++) {
        // make high scores cluster on one species to create swap opportunities
        const species = k === 0 ? 'Cat' : speciesList[(pi + k) % speciesList.length]
        pool.push(mk(`${p}-${k}`, p, species))
      }
    })
    const scores: Scores = {}
    for (const v of pool) {
      scores[v.id] = v.species === 'Cat' ? TIER_SCORE.S : TIER_SCORE.B
    }

    const w = PRESETS.species
    const res = recommend(pool, scores, w)

    // hand-built greedy baseline: top-score per personality + fill by marginal,
    // reproduced by taking recommend with species weight 0 (pure greedy-ish)
    // Instead: build a naive greedy team manually for comparison.
    const greedy: Villager[] = []
    const used = new Set<string>()
    for (const p of PERSONALITY_KEYS) {
      const cands = pool
        .filter((v) => v.personality === p)
        .sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))
      if (cands[0]) {
        greedy.push(cands[0])
        used.add(cands[0].id)
      }
    }
    while (greedy.length < TEAM_SIZE) {
      const rest = pool
        .filter((v) => !used.has(v.id))
        .sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))
      if (!rest[0]) break
      greedy.push(rest[0])
      used.add(rest[0].id)
    }
    const greedyScore = totalScore(greedy, scores, w)

    expect(res.score).toBeGreaterThanOrEqual(greedyScore - 1e-9)
  })

  // ③ 'species' preset yields <= species dup pairs vs 'fav' preset when top-fav share species.
  it('species preset reduces species duplicates vs fav preset', () => {
    const pool: Villager[] = []
    const altSpecies = ['Dog', 'Bear', 'Bird', 'Frog', 'Wolf']
    PERSONALITY_KEYS.forEach((p, pi) => {
      // a high-fav Cat for every personality (top picks all share species)
      pool.push(mk(`${p}-cat`, p, 'Cat'))
      // lower-fav diverse alternatives
      for (let k = 0; k < 3; k++) {
        pool.push(mk(`${p}-alt${k}`, p, altSpecies[(pi + k) % altSpecies.length]))
      }
    })
    const scores: Scores = {}
    for (const v of pool) {
      scores[v.id] = v.species === 'Cat' ? TIER_SCORE.S : TIER_SCORE.C
    }

    const favRes = recommend(pool, scores, PRESETS.fav)
    const speciesRes = recommend(pool, scores, PRESETS.species)

    expect(countSpeciesPairs(speciesRes.team)).toBeLessThanOrEqual(
      countSpeciesPairs(favRes.team),
    )
  })

  // ④ Personality with no rated villagers is still covered; missing stays empty.
  it('forces unrated inclusion for coverage', () => {
    const pool: Villager[] = []
    PERSONALITY_KEYS.forEach((p, pi) => {
      for (let k = 0; k < 2; k++) {
        pool.push(mk(`${p}-${k}`, p, `S${pi}`))
      }
    })
    // Rate everyone EXCEPT the 'Uchi' personality villagers.
    const scores: Scores = {}
    for (const v of pool) {
      if (v.personality !== 'Uchi') scores[v.id] = TIER_SCORE.A
    }

    const res = recommend(pool, scores, PRESETS.fav)
    expect(res.missing).toEqual([])
    const personalities = new Set(res.team.map((v) => v.personality))
    expect(personalities.has('Uchi')).toBe(true)
    expect(coverageOK(res.team)).toBe(true)
  })

  // ⑤ Configurable team size: 3..10. Small teams (<8) skip hard coverage and never crash.
  it('respects a custom team size and relaxes coverage below 8', () => {
    const pool: Villager[] = []
    const speciesList = ['Cat', 'Dog', 'Bear', 'Bird']
    PERSONALITY_KEYS.forEach((p, pi) => {
      for (let k = 0; k < 3; k++) {
        pool.push(mk(`${p}-${k}`, p, speciesList[(pi + k) % speciesList.length]))
      }
    })
    const scores: Scores = {}
    for (const v of pool) scores[v.id] = TIER_SCORE.A

    for (const size of [3, 5, 7, 8, 10]) {
      const res = recommend(pool, scores, PRESETS.fav, size)
      expect(res.team.length).toBe(size)
      expect(new Set(res.team.map((v) => v.id)).size).toBe(size) // no dupes
      if (size >= 8) {
        expect(coverageOK(res.team)).toBe(true)
        expect(res.missing).toEqual([])
      } else {
        // small teams: no missing reported, coverage not forced
        expect(res.missing).toEqual([])
      }
    }
  })

  // ⑥ Team size larger than pool returns the whole pool without looping forever.
  it('caps team at pool size when pool is smaller than requested', () => {
    const pool = PERSONALITY_KEYS.slice(0, 3).map((p, i) => mk(`${p}-0`, p, `S${i}`))
    const res = recommend(pool, {}, PRESETS.fav, 10)
    expect(res.team.length).toBe(3)
  })

  // missing populated when a personality absent from pool
  it('reports missing personalities absent from pool', () => {
    const pool: Villager[] = []
    PERSONALITY_KEYS.filter((p) => p !== 'Smug').forEach((p, i) => {
      pool.push(mk(`${p}-0`, p, `S${i}`))
      pool.push(mk(`${p}-1`, p, `S${i}`))
    })
    const res = recommend(pool, {}, PRESETS.fav)
    expect(res.missing).toContain('Smug')
    expect(coverageOK(res.team)).toBe(false)
  })
})
