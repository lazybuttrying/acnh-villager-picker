import { useState } from 'react'
import type { MouseEvent } from 'react'
import { Ban, Home } from 'lucide-react'
import type { Tier } from '@/data/types'
import { TIER_SCORE } from '@/data/types'
import type { Pokemon } from '../data/types'
import { usePk, pokemonName, typeLabel, habitatLabel, specialtyLabel } from '../i18n'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const TIERS = Object.keys(TIER_SCORE) as Tier[]

const TIER_ACTIVE: Record<Tier, string> = {
  S: 'bg-amber-400 text-amber-950 border-transparent',
  A: 'bg-emerald-500 text-white border-transparent',
  B: 'bg-blue-500 text-white border-transparent',
  C: 'bg-gray-400 text-white border-transparent',
}

export function PokemonCard({
  pokemon,
  tier,
  blacklisted = false,
  recruited = false,
  onSetTier,
  onClearTier,
  onToggleBlacklist,
  onToggleRecruited,
}: {
  pokemon: Pokemon
  tier?: Tier
  blacklisted?: boolean
  recruited?: boolean
  onSetTier: (id: string, tier: Tier) => void
  onClearTier: (id: string) => void
  onToggleBlacklist: (id: string) => void
  onToggleRecruited: (id: string) => void
}) {
  const [imgError, setImgError] = useState(false)
  const { locale, t } = usePk()
  const name = pokemonName(pokemon, locale)
  const tierDisabled = blacklisted || recruited

  function handleBan(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    onToggleBlacklist(pokemon.id)
  }

  function handleRecruited(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    onToggleRecruited(pokemon.id)
  }

  function handleTier(e: MouseEvent<HTMLButtonElement>, tr: Tier) {
    e.stopPropagation()
    if (tier === tr) onClearTier(pokemon.id)
    else onSetTier(pokemon.id, tr)
  }

  return (
    <Card
      className={cn(
        'group relative select-none overflow-hidden transition-shadow',
        blacklisted ? 'opacity-50 ring-2 ring-destructive/60 grayscale' : 'hover:shadow-md',
        recruited && 'ring-2 ring-sky-500',
        !blacklisted && !recruited && tier !== undefined && 'ring-2 ring-primary',
      )}
    >
      <button
        type="button"
        onClick={handleBan}
        aria-label={t('card.blacklist')}
        aria-pressed={blacklisted}
        title={t('card.blacklist')}
        className={cn(
          'absolute left-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full border transition-opacity',
          blacklisted
            ? 'border-transparent bg-destructive text-destructive-foreground opacity-100'
            : 'border-border bg-background/80 text-muted-foreground opacity-0 hover:bg-destructive hover:text-destructive-foreground group-hover:opacity-100 focus-visible:opacity-100',
        )}
      >
        <Ban className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={handleRecruited}
        aria-label={t('card.recruited')}
        aria-pressed={recruited}
        title={t('card.recruited')}
        className={cn(
          'absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full border transition-opacity',
          recruited
            ? 'border-transparent bg-sky-500 text-white opacity-100'
            : 'border-border bg-background/80 text-muted-foreground opacity-0 hover:bg-sky-500 hover:text-white group-hover:opacity-100 focus-visible:opacity-100',
        )}
      >
        <Home className="h-3.5 w-3.5" />
      </button>

      <CardContent className="flex flex-col items-center gap-1.5 p-2">
        <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-muted">
          {imgError ? (
            <span className="text-2xl text-muted-foreground" aria-hidden="true">
              ?
            </span>
          ) : (
            <img
              src={pokemon.image}
              loading="lazy"
              decoding="async"
              alt={name}
              onError={() => setImgError(true)}
              className="h-full w-full object-contain p-1.5"
            />
          )}
        </div>
        <div className="w-full text-center">
          <p className="truncate text-sm font-semibold leading-tight" title={name}>
            {name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {pokemon.types.map((ty) => typeLabel(ty, locale)).join(' · ')}
          </p>
          <p className="truncate text-xs text-muted-foreground" title={pokemon.specialties.join(', ')}>
            {pokemon.specialties.map(specialtyLabel).join(' · ')} · {habitatLabel(pokemon.habitat, locale)}
          </p>
        </div>

        <div className="grid w-full grid-cols-4 gap-1" aria-label="tier">
          {TIERS.map((tr) => {
            const active = tier === tr
            return (
              <button
                key={tr}
                type="button"
                disabled={tierDisabled}
                aria-pressed={active}
                onClick={(e) => handleTier(e, tr)}
                className={cn(
                  'h-7 rounded-md border text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                  active
                    ? TIER_ACTIVE[tr]
                    : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                {tr}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
