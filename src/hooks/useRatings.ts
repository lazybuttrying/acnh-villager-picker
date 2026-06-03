import { useCallback, useMemo, useSyncExternalStore } from 'react'
import type { Ratings, Scores, Tier } from '@/data/types'
import { TIER_SCORE } from '@/data/types'
import { loadRatings, saveRatings } from '@/lib/storage'

const CYCLE: Tier[] = ['S', 'A', 'B', 'C']

function nextTier(current: Tier | undefined): Tier | undefined {
  if (current === undefined) return 'S'
  const idx = CYCLE.indexOf(current)
  if (idx === -1) return 'S'
  if (idx === CYCLE.length - 1) return undefined // cycling off C
  return CYCLE[idx + 1]
}

// 모듈 싱글톤 스토어 — 여러 useRatings 소비자(그리드/추천패널)가 동일 상태를 공유한다.
let ratingsState: Ratings = loadRatings()
const listeners = new Set<() => void>()

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot(): Ratings {
  return ratingsState
}

function commit(next: Ratings): void {
  ratingsState = next
  saveRatings(next)
  for (const l of listeners) l()
}

function cycleRating(id: string): void {
  const next: Ratings = { ...ratingsState }
  const nt = nextTier(ratingsState[id])
  if (nt === undefined) {
    delete next[id]
  } else {
    next[id] = nt
  }
  commit(next)
}

function removeRating(id: string): void {
  if (!(id in ratingsState)) return
  const next: Ratings = { ...ratingsState }
  delete next[id]
  commit(next)
}

function setRating(id: string, tier: Tier): void {
  if (ratingsState[id] === tier) return
  commit({ ...ratingsState, [id]: tier })
}

function clearRatings(): void {
  if (Object.keys(ratingsState).length === 0) return
  commit({})
}

export function useRatings(): {
  ratings: Ratings
  cycle: (id: string) => void
  setTier: (id: string, tier: Tier) => void
  remove: (id: string) => void
  clear: () => void
  scores: Scores
} {
  const ratings = useSyncExternalStore(subscribe, getSnapshot)
  const cycle = useCallback((id: string) => cycleRating(id), [])
  const setTier = useCallback((id: string, tier: Tier) => setRating(id, tier), [])
  const remove = useCallback((id: string) => removeRating(id), [])
  const clear = useCallback(() => clearRatings(), [])

  const scores = useMemo<Scores>(() => {
    const s: Scores = {}
    for (const [id, tier] of Object.entries(ratings)) {
      s[id] = TIER_SCORE[tier]
    }
    return s
  }, [ratings])

  return { ratings, cycle, setTier, remove, clear, scores }
}
