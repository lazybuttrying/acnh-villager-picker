import { useSyncExternalStore } from 'react'
import type { Tier } from '@/data/types'
import { TIER_SCORE } from '@/data/types'
import type { Scores } from './recommend'
import { tierScore } from './recommend'

export interface PokopiaState {
  ratings: Record<string, Tier>
  blacklist: string[]
  recruited: string[]
}

const KEY = 'pokopia-state-v1'

const EMPTY: PokopiaState = { ratings: {}, blacklist: [], recruited: [] }

function load(): PokopiaState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<PokopiaState>
    return {
      ratings: parsed.ratings ?? {},
      blacklist: parsed.blacklist ?? [],
      recruited: parsed.recruited ?? [],
    }
  } catch {
    return EMPTY
  }
}

let state: PokopiaState = load()
const listeners = new Set<() => void>()

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot(): PokopiaState {
  return state
}

function commit(next: PokopiaState): void {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // storage full/blocked: keep in-memory state only
  }
  for (const cb of listeners) cb()
}

export function usePokopiaState(): PokopiaState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export function setTier(id: string, tier: Tier | undefined): void {
  const ratings = { ...state.ratings }
  if (tier === undefined) delete ratings[id]
  else ratings[id] = tier
  commit({ ...state, ratings })
}

export function toggleIn(list: 'blacklist' | 'recruited', id: string): void {
  const cur = state[list]
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
  commit({ ...state, [list]: next })
}

export function scoresFromRatings(ratings: Record<string, Tier>): Scores {
  const s: Scores = {}
  for (const [id, tier] of Object.entries(ratings)) {
    s[id] = tierScore(tier)
  }
  return s
}

export { TIER_SCORE }
