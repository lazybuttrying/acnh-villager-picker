import type { Pokemon } from '../data/types'
import type { Tier } from '@/data/types'
import { decodeBase64Url, encodeBase64Url } from '@/lib/base64url'

const MAX_HOUSES = 6
const MAX_PER_HOUSE = 4
const TIERS: Tier[] = ['S', 'A', 'B', 'C']

export type TeamEntry = { pokemon: Pokemon; tier?: Tier }

/**
 * Encode houses as base64url: members are "id:tier" joined by ",",
 * houses joined by ";". A code without ";" is one house (legacy links).
 */
export function encodeTeam(houses: TeamEntry[][]): string {
  const raw = houses
    .slice(0, MAX_HOUSES)
    .map((house) =>
      house
        .slice(0, MAX_PER_HOUSE)
        .map(({ pokemon, tier }) => `${pokemon.id}:${tier ?? ''}`)
        .join(','),
    )
    .filter((s) => s.length > 0)
    .join(';')
  return encodeBase64Url(raw)
}

export function decodeTeam(code: string, all: Pokemon[]): TeamEntry[][] {
  let raw: string
  try {
    raw = decodeBase64Url(code)
  } catch {
    return []
  }
  const byId = new Map(all.map((p) => [p.id, p]))
  const houses: TeamEntry[][] = []
  for (const group of raw.split(';')) {
    const house: TeamEntry[] = []
    for (const part of group.split(',')) {
      if (!part) continue
      const [id, tier] = part.split(':')
      const pokemon = byId.get(id)
      if (!pokemon) continue
      house.push({
        pokemon,
        tier: TIERS.includes(tier as Tier) ? (tier as Tier) : undefined,
      })
      if (house.length >= MAX_PER_HOUSE) break
    }
    if (house.length > 0) houses.push(house)
    if (houses.length >= MAX_HOUSES) break
  }
  return houses
}

export function teamUrl(code: string): string {
  return `${window.location.origin}${window.location.pathname}#/team/${code}`
}
