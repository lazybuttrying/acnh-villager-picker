import type { Pokemon } from '../data/types'
import type { Tier } from '@/data/types'

const MAX_TEAM = 10
const TIERS: Tier[] = ['S', 'A', 'B', 'C']

/** Encode a team as base64url of "id:tier" pairs joined by commas. */
export function encodeTeam(team: { pokemon: Pokemon; tier?: Tier }[]): string {
  const raw = team
    .slice(0, MAX_TEAM)
    .map(({ pokemon, tier }) => `${pokemon.id}:${tier ?? ''}`)
    .join(',')
  const b64 = btoa(unescape(encodeURIComponent(raw)))
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeTeam(
  code: string,
  all: Pokemon[],
): { pokemon: Pokemon; tier?: Tier }[] {
  let raw: string
  try {
    const b64 = code.replace(/-/g, '+').replace(/_/g, '/')
    raw = decodeURIComponent(escape(atob(b64)))
  } catch {
    return []
  }
  const byId = new Map(all.map((p) => [p.id, p]))
  const out: { pokemon: Pokemon; tier?: Tier }[] = []
  for (const part of raw.split(',')) {
    const [id, tier] = part.split(':')
    const pokemon = byId.get(id)
    if (!pokemon) continue
    out.push({
      pokemon,
      tier: TIERS.includes(tier as Tier) ? (tier as Tier) : undefined,
    })
    if (out.length >= MAX_TEAM) break
  }
  return out
}

export function teamUrl(code: string): string {
  return `${window.location.origin}${window.location.pathname}#/team/${code}`
}
