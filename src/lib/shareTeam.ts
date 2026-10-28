import type { Tier, Villager } from '@/data/types'
import { decodeBase64Url, encodeBase64Url } from './base64url'

export interface SharedMember {
  id: string
  tier: Tier
}

const TIERS: Tier[] = ['S', 'A', 'B', 'C']
const MAX_MEMBERS = 10

/** Encode team members (id + tier) into a URL-safe string. */
export function encodeTeam(members: SharedMember[]): string {
  const payload = members.map((m) => `${m.id}:${m.tier}`).join(',')
  return encodeBase64Url(payload)
}

/** Decode a share code back into members. Returns null on invalid input. */
export function decodeTeam(code: string): SharedMember[] | null {
  try {
    if (!code || !/^[A-Za-z0-9_-]+$/.test(code)) return null
    const payload = decodeBase64Url(code)
    if (!payload) return null
    const members = payload.split(',').map((part) => {
      const idx = part.lastIndexOf(':')
      const id = part.slice(0, idx)
      const tier = part.slice(idx + 1)
      if (!id || !(TIERS as string[]).includes(tier)) throw new Error('bad member')
      return { id, tier: tier as Tier }
    })
    if (members.length < 1 || members.length > MAX_MEMBERS) return null
    return members
  } catch {
    return null
  }
}

/** Resolve decoded members against the villager list. Null when any id is unknown. */
export function resolveTeam(
  villagers: Villager[],
  members: SharedMember[],
): (Villager & { tier: Tier })[] | null {
  const out: (Villager & { tier: Tier })[] = []
  for (const m of members) {
    const v = villagers.find((x) => x.id === m.id)
    if (!v) return null
    out.push({ ...v, tier: m.tier })
  }
  return out
}

/** Full share URL for the current origin. */
export function makeShareUrl(members: SharedMember[]): string {
  return `${window.location.origin}${window.location.pathname}#/team/${encodeTeam(members)}`
}
