import type { Locale, Tier } from '@/data/types'

export type { Locale, Tier }

export interface Pokemon {
  id: string // Serebii pokedex slug, unique per entry (forms included)
  dex: number // Pokopia pokedex number
  names: Record<Locale, string>
  nameEn: string // display name incl. form (e.g. "Tatsugiri Curly Form")
  types: string[] // 1-2 Pokemon type keys (EN)
  specialties: string[] // 1-2 specialty keys (EN); "???" means unknown in-game
  habitat: string // ideal habitat key: Bright | Warm | Humid | Cool | Dark | Dry
  natId: number // national pokedex number (for artwork)
  image: string // official artwork URL (PokeAPI sprites CDN)
}

export const TEAM_SIZE = 10

/** Specialties that count toward town coverage (excludes the unknown marker). */
export const COVERAGE_SPECIALTIES: string[] = [
  'Build',
  'Chop',
  'Water',
  'Burn',
  'Grow',
  'Fly',
  'Crush',
  'Generate',
  'Gather',
  'Search',
  'Trade',
  'Litter',
  'Recycle',
  'Bulldoze',
  'Teleport',
  'Hype',
]

export const ALL_SPECIALTIES: string[] = [
  'Build',
  'Chop',
  'Water',
  'Burn',
  'Grow',
  'Fly',
  'Crush',
  'Generate',
  'Gather',
  'Search',
  'Trade',
  'Litter',
  'Recycle',
  'Bulldoze',
  'Teleport',
  'Hype',
  'Collect',
  'Explode',
  'Storage',
  'Yawn',
  'Appraise',
  'Transform',
  'Gather Honey',
  'Dream Island',
  'Illuminate',
  'Eat',
  'Paint',
  'DJ',
  'Party',
  'Rarify',
  'Engineer',
]

export const HABITATS: string[] = ['Bright', 'Warm', 'Humid', 'Cool', 'Dark', 'Dry']

export const TYPES: string[] = [
  'Normal',
  'Fire',
  'Water',
  'Electric',
  'Grass',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon',
  'Dark',
  'Steel',
  'Fairy',
]

export type PresetId = 'fav' | 'specialty' | 'type'
