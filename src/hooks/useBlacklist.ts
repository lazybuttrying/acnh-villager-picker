import { useCallback, useMemo, useSyncExternalStore } from 'react'

// 블랙리스트(제외) — 평가(useRatings)와 독립된 두 번째 선택 차원.
// 추천 풀에서 제외된다. localStorage 영속(string[]).
const KEY = 'acnh-blacklist-v1'

type Blacklist = Record<string, true>

function load(): Blacklist {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const arr = JSON.parse(raw) as unknown
    if (!Array.isArray(arr)) return {}
    const out: Blacklist = {}
    for (const id of arr) if (typeof id === 'string') out[id] = true
    return out
  } catch {
    return {}
  }
}

function save(b: Blacklist): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(Object.keys(b)))
  } catch {
    /* ignore quota errors */
  }
}

let state: Blacklist = load()
const listeners = new Set<() => void>()

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
function getSnapshot(): Blacklist {
  return state
}
function commit(next: Blacklist): void {
  state = next
  save(next)
  for (const l of listeners) l()
}

function toggleId(id: string): void {
  const next: Blacklist = { ...state }
  if (next[id]) delete next[id]
  else next[id] = true
  commit(next)
}
function removeId(id: string): void {
  if (!state[id]) return
  const next: Blacklist = { ...state }
  delete next[id]
  commit(next)
}
function clearAll(): void {
  if (Object.keys(state).length === 0) return
  commit({})
}

export function useBlacklist(): {
  blacklist: Blacklist
  ids: string[]
  has: (id: string) => boolean
  toggle: (id: string) => void
  remove: (id: string) => void
  clear: () => void
} {
  const blacklist = useSyncExternalStore(subscribe, getSnapshot)
  const ids = useMemo(() => Object.keys(blacklist), [blacklist])
  const has = useCallback((id: string) => id in blacklist, [blacklist])
  const toggle = useCallback((id: string) => toggleId(id), [])
  const remove = useCallback((id: string) => removeId(id), [])
  const clear = useCallback(() => clearAll(), [])
  return { blacklist, ids, has, toggle, remove, clear }
}
