import { useCallback, useMemo, useSyncExternalStore } from 'react'

// 현재 거주 중인 주민 — 평가/블랙리스트와 독립된 세 번째 선택 차원.
// "이미 같이 살고 있는" 주민. 추천 풀에서 제외된다(이미 보유). localStorage 영속(string[]).
const KEY = 'acnh-residents-v1'

type Residents = Record<string, true>

function load(): Residents {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const arr = JSON.parse(raw) as unknown
    if (!Array.isArray(arr)) return {}
    const out: Residents = {}
    for (const id of arr) if (typeof id === 'string') out[id] = true
    return out
  } catch {
    return {}
  }
}

function save(r: Residents): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(Object.keys(r)))
  } catch {
    /* ignore quota errors */
  }
}

let state: Residents = load()
const listeners = new Set<() => void>()

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
function getSnapshot(): Residents {
  return state
}
function commit(next: Residents): void {
  state = next
  save(next)
  for (const l of listeners) l()
}

function toggleId(id: string): void {
  const next: Residents = { ...state }
  if (next[id]) delete next[id]
  else next[id] = true
  commit(next)
}
function removeId(id: string): void {
  if (!state[id]) return
  const next: Residents = { ...state }
  delete next[id]
  commit(next)
}
function clearAll(): void {
  if (Object.keys(state).length === 0) return
  commit({})
}

export function useResidents(): {
  residents: Residents
  ids: string[]
  has: (id: string) => boolean
  toggle: (id: string) => void
  remove: (id: string) => void
  clear: () => void
} {
  const residents = useSyncExternalStore(subscribe, getSnapshot)
  const ids = useMemo(() => Object.keys(residents), [residents])
  const has = useCallback((id: string) => id in residents, [residents])
  const toggle = useCallback((id: string) => toggleId(id), [])
  const remove = useCallback((id: string) => removeId(id), [])
  const clear = useCallback(() => clearAll(), [])
  return { residents, ids, has, toggle, remove, clear }
}
