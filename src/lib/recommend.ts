import type { Villager, Scores, PersonalityKey, PresetId } from '@/data/types'
import { TEAM_SIZE, PERSONALITY_KEYS } from '@/data/types'

export interface Weights {
  fav: number
  species: number
  personality: number
}

export const PRESETS: Record<PresetId, Weights> = {
  fav: { fav: 1.0, species: 0.2, personality: 0.2 },
  species: { fav: 0.6, species: 1.5, personality: 0.3 },
  personality: { fav: 0.6, species: 0.3, personality: 1.5 },
}

const EPS = 1e-9

/** Σ c*(c-1)/2 over group counts. */
export function dupPairs(counts: Map<string, number>): number {
  let sum = 0
  for (const c of counts.values()) {
    sum += (c * (c - 1)) / 2
  }
  return sum
}

function countBy(set: Villager[], key: (v: Villager) => string): Map<string, number> {
  const m = new Map<string, number>()
  for (const v of set) {
    m.set(key(v), (m.get(key(v)) ?? 0) + 1)
  }
  return m
}

/** w.fav*Σscores − w.species*dupPairs(species) − w.personality*dupPairs(personality). */
export function totalScore(set: Villager[], scores: Scores, w: Weights): number {
  let fav = 0
  for (const v of set) {
    fav += scores[v.id] ?? 0
  }
  const speciesDup = dupPairs(countBy(set, (v) => v.species))
  const personalityDup = dupPairs(countBy(set, (v) => v.personality))
  return w.fav * fav - w.species * speciesDup - w.personality * personalityDup
}

/** True if the set covers all 8 personalities. */
export function coverageOK(set: Villager[]): boolean {
  const seen = new Set<PersonalityKey>()
  for (const v of set) {
    seen.add(v.personality)
  }
  return PERSONALITY_KEYS.every((p) => seen.has(p))
}

/**
 * 추천 팀 구성.
 * @param teamSize 목표 인원. 기본 TEAM_SIZE(10). 3~10 등 사용자가 조절 가능.
 *
 * ⚠️ 커버리지 주의: 8성격 전부 커버는 팀이 **8명 이상일 때만** 가능하다.
 * teamSize < 8이면 8성격 하드 제약을 풀고, 성격/종족 소프트 패널티(totalScore)만으로
 * 다양성을 유도한다. teamSize ≥ 8이면 풀에 존재하는 모든 성격 커버를 강제한다.
 */
export function recommend(
  pool: Villager[],
  scores: Scores,
  w: Weights,
  teamSize: number = TEAM_SIZE,
): { team: Villager[]; score: number; missing: PersonalityKey[] } {
  const size = Math.max(1, Math.floor(teamSize))
  const availablePersonalities = new Set<PersonalityKey>(pool.map((v) => v.personality))
  // 8성격 전부 커버는 인원이 8 이상일 때만 의미가 있다.
  const enforceCoverage = size >= PERSONALITY_KEYS.length

  // missing: 풀에 단 한 명도 없는 성격(데이터/블랙리스트 사유). 커버리지 강제 시에만 보고.
  const missing: PersonalityKey[] = enforceCoverage
    ? PERSONALITY_KEYS.filter((p) => !availablePersonalities.has(p))
    : []

  // 커버리지 충족 판정(일반화): 강제 모드면 풀에 존재하는 모든 성격이 팀에 있어야 함.
  const coverageEnough = (set: Villager[]): boolean => {
    if (!enforceCoverage) return true
    const seen = new Set<PersonalityKey>()
    for (const v of set) seen.add(v.personality)
    for (const p of availablePersonalities) {
      if (!seen.has(p)) return false
    }
    return true
  }

  const team: Villager[] = []
  const selected = new Set<string>()

  // 커버리지 강제 시에만: 성격별 최고 호감도 1명씩 시드(미평가뿐이어도 커버 위해 선택).
  if (enforceCoverage) {
    for (const p of PERSONALITY_KEYS) {
      const candidates = pool.filter((v) => v.personality === p)
      if (candidates.length === 0) continue
      let best = candidates[0]
      let bestScore = scores[best.id] ?? 0
      for (const v of candidates) {
        const s = scores[v.id] ?? 0
        if (s > bestScore) {
          best = v
          bestScore = s
        }
      }
      team.push(best)
      selected.add(best.id)
    }
  }

  // 남은 슬롯: 한계 이득 최대로 size까지 채움.
  while (team.length < size) {
    let bestV: Villager | null = null
    let bestGain = -Infinity
    const base = totalScore(team, scores, w)
    for (const v of pool) {
      if (selected.has(v.id)) continue
      team.push(v)
      const gain = totalScore(team, scores, w) - base
      team.pop()
      if (gain > bestGain) {
        bestGain = gain
        bestV = v
      }
    }
    if (bestV === null) break // 풀 소진
    team.push(bestV)
    selected.add(bestV.id)
  }

  // 2-opt 로컬서치: 선택 1명을 비선택 풀 주민과 교체(커버리지 유지 + 총점 개선 시).
  const MAX_PASSES = 50
  for (let pass = 0; pass < MAX_PASSES; pass++) {
    let improved = false
    let curScore = totalScore(team, scores, w)
    for (let i = 0; i < team.length; i++) {
      const removed = team[i]
      for (const v of pool) {
        if (selected.has(v.id)) continue
        team[i] = v
        if (coverageEnough(team)) {
          const newScore = totalScore(team, scores, w)
          if (newScore > curScore + EPS) {
            selected.delete(removed.id)
            selected.add(v.id)
            curScore = newScore
            improved = true
            break
          }
        }
        team[i] = removed
      }
    }
    if (!improved) break
  }

  return { team, score: totalScore(team, scores, w), missing }
}
