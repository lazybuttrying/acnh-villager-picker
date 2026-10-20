import { useCallback, useMemo, useSyncExternalStore } from 'react'

// amiibo 카드 보유 — 평가/거주/블랙리스트와 독립된 네 번째 선택 차원.
// "이 주민의 amiibo 카드를 실제로 갖고 있는" 상태. 언제든 섬에 부를 수 있다는
// 소유 기록이므로 다른 상태와 상호배타가 아니다. localStorage 영속(string[]).
const KEY = 'acnh-owned-v1'

type Owned = Record<string, true>

function load(): Owned {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const arr = JSON.parse(raw) as unknown
    if (!Array.isArray(arr)) return {}
    const out: Owned = {}
    for (const id of arr) if (typeof id === 'string') out[id] = true
    return out
  } catch {
    return {}
  }
}

function save(o: Owned): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(Object.keys(o)))
  } catch {
    /* ignore quota errors */
  }
}

let state: Owned = load()
const listeners = new Set<() => void>()

function subscribe(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}
function getSnapshot(): Owned {
  return state
}
function commit(next: Owned): void {
  state = next
  save(next)
  for (const l of listeners) l()
}

function toggleId(id: string): void {
  const next: Owned = { ...state }
  if (next[id]) delete next[id]
  else next[id] = true
  commit(next)
}
function removeId(id: string): void {
  if (!state[id]) return
  const next: Owned = { ...state }
  delete next[id]
  commit(next)
}
function clearAll(): void {
  if (Object.keys(state).length === 0) return
  commit({})
}

export function useOwned(): {
  owned: Owned
  ids: string[]
  has: (id: string) => boolean
  toggle: (id: string) => void
  remove: (id: string) => void
  clear: () => void
} {
  const owned = useSyncExternalStore(subscribe, getSnapshot)
  const ids = useMemo(() => Object.keys(owned), [owned])
  const has = useCallback((id: string) => id in owned, [owned])
  const toggle = useCallback((id: string) => toggleId(id), [])
  const remove = useCallback((id: string) => removeId(id), [])
  const clear = useCallback(() => clearAll(), [])
  return { owned, ids, has, toggle, remove, clear }
}
