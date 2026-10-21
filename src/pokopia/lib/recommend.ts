import type { Pokemon, PresetId } from '../data/types'
import { COVERAGE_SPECIALTIES, TEAM_SIZE } from '../data/types'
import type { Tier } from '@/data/types'
import { TIER_SCORE } from '@/data/types'

export type Scores = Record<string, number>

export interface Weights {
  fav: number
  coverage: number
  type: number
}

export const PRESETS: Record<PresetId, Weights> = {
  fav: { fav: 1.0, coverage: 0.6, type: 0.25 },
  specialty: { fav: 0.6, coverage: 1.6, type: 0.3 },
  type: { fav: 0.6, coverage: 0.6, type: 1.5 },
}

const EPS = 1e-9

export function tierScore(tier: Tier | undefined): number {
  return tier ? TIER_SCORE[tier] : 0
}

/** Sum over groups of c*(c-1)/2 (number of duplicate pairs). */
export function dupPairs(counts: Map<string, number>): number {
  let sum = 0
  for (const c of counts.values()) {
    sum += (c * (c - 1)) / 2
  }
  return sum
}

function typeCounts(set: Pokemon[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const p of set) {
    for (const t of p.types) m.set(t, (m.get(t) ?? 0) + 1)
  }
  return m
}

/** Distinct coverage specialties present in the set ("???" never counts). */
export function coveredSpecialties(set: Pokemon[]): Set<string> {
  const seen = new Set<string>()
  for (const p of set) {
    for (const s of p.specialties) {
      if (COVERAGE_SPECIALTIES.includes(s)) seen.add(s)
    }
  }
  return seen
}

export interface Breakdown {
  fav: number
  coverage: number
  covered: string[]
  missing: string[]
  typeDup: number
  total: number
}

export function scoreBreakdown(set: Pokemon[], scores: Scores, w: Weights): Breakdown {
  let fav = 0
  for (const p of set) fav += scores[p.id] ?? 0
  const coveredSet = coveredSpecialties(set)
  const covered = COVERAGE_SPECIALTIES.filter((s) => coveredSet.has(s))
  const missing = COVERAGE_SPECIALTIES.filter((s) => !coveredSet.has(s))
  const typeDup = dupPairs(typeCounts(set))
  return {
    fav,
    coverage: covered.length,
    covered,
    missing,
    typeDup,
    total: w.fav * fav + w.coverage * covered.length - w.type * typeDup,
  }
}

export function totalScore(set: Pokemon[], scores: Scores, w: Weights): number {
  return scoreBreakdown(set, scores, w).total
}

/**
 * Build a recommended town team.
 * Greedy fill by marginal gain, then a swap-improvement pass.
 * `pinned` members (already recruited) are always kept and never swapped out.
 */
export function recommend(
  pool: Pokemon[],
  scores: Scores,
  w: Weights,
  teamSize: number = TEAM_SIZE,
  pinned: Pokemon[] = [],
): { team: Pokemon[]; score: number } {
  const size = Math.max(1, Math.floor(teamSize))
  const team: Pokemon[] = []
  const selected = new Set<string>()

  for (const p of pinned) {
    if (team.length >= size) break
    if (selected.has(p.id)) continue
    team.push(p)
    selected.add(p.id)
  }
  const pinnedCount = team.length

  while (team.length < size) {
    let best: Pokemon | null = null
    let bestGain = -Infinity
    const base = totalScore(team, scores, w)
    for (const p of pool) {
      if (selected.has(p.id)) continue
      team.push(p)
      const gain = totalScore(team, scores, w) - base
      team.pop()
      if (gain > bestGain + EPS) {
        bestGain = gain
        best = p
      }
    }
    if (!best) break
    team.push(best)
    selected.add(best.id)
  }

  // Swap pass: replace a non-pinned member with a pool candidate while it helps.
  let improved = true
  let guard = 0
  while (improved && guard++ < 40) {
    improved = false
    const base = totalScore(team, scores, w)
    outer: for (let i = pinnedCount; i < team.length; i++) {
      for (const cand of pool) {
        if (selected.has(cand.id)) continue
        const removed = team[i]
        team[i] = cand
        const next = totalScore(team, scores, w)
        if (next > base + EPS) {
          selected.delete(removed.id)
          selected.add(cand.id)
          improved = true
          break outer
        }
        team[i] = removed
      }
    }
  }

  return { team, score: totalScore(team, scores, w) }
}

function scoreSum(set: Pokemon[], scores: Scores): number {
  return set.reduce((acc, p) => acc + (scores[p.id] ?? 0), 0)
}

/**
 * Partition a selected team into houses of 1-4 (the way Pokopia homes work).
 * Housemates prefer sharing an ideal habitat: full habitat groups are chunked
 * into houses of 4 first, leftovers merge into mixed houses, and if fewer
 * houses than requested come out, the largest houses split to reach the count.
 */
export function formHouses(team: Pokemon[], scores: Scores, houseCount: number): Pokemon[][] {
  if (team.length === 0) return []
  const target = Math.max(1, Math.min(houseCount, team.length))

  const groups = new Map<string, Pokemon[]>()
  for (const p of team) {
    const g = groups.get(p.habitat) ?? []
    g.push(p)
    groups.set(p.habitat, g)
  }
  for (const g of groups.values()) {
    g.sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))
  }
  const ordered = [...groups.values()].sort(
    (a, b) => b.length - a.length || scoreSum(b, scores) - scoreSum(a, scores),
  )

  const houses: Pokemon[][] = []
  const partials: Pokemon[] = []
  for (const g of ordered) {
    let i = 0
    while (g.length - i >= 4) {
      houses.push(g.slice(i, i + 4))
      i += 4
    }
    for (; i < g.length; i++) partials.push(g[i])
  }
  partials.sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))
  for (let i = 0; i < partials.length; i += 4) {
    houses.push(partials.slice(i, i + 4))
  }

  while (houses.length < target) {
    let idx = -1
    let max = 1
    houses.forEach((h, i) => {
      if (h.length > max) {
        max = h.length
        idx = i
      }
    })
    if (idx === -1) break
    const h = houses[idx]
    const half = Math.ceil(h.length / 2)
    houses.splice(idx, 1, h.slice(0, half), h.slice(half))
  }

  return houses.sort((a, b) => scoreSum(b, scores) - scoreSum(a, scores))
}
