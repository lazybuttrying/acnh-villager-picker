import type { Ratings } from '@/data/types'

const KEY = 'acnh-ratings-v1'

export function loadRatings(): Ratings {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return parsed as Ratings
    return {}
  } catch {
    return {}
  }
}

export function saveRatings(r: Ratings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(r))
  } catch {
    // ignore quota / serialization errors
  }
}
