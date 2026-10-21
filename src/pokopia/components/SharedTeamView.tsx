import { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import type { Pokemon } from '../data/types'
import type { Tier } from '@/data/types'
import { decodeTeam } from '../lib/shareTeam'
import { usePk, pokemonName, typeLabel, specialtyLabel } from '../i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const TIER_CHIP: Record<Tier, string> = {
  S: 'bg-amber-400 text-amber-950',
  A: 'bg-emerald-500 text-white',
  B: 'bg-blue-500 text-white',
  C: 'bg-gray-400 text-white',
}

export function SharedTeamView({
  all,
  code,
  onStart,
}: {
  all: Pokemon[]
  code: string
  onStart: () => void
}) {
  const { locale, t } = usePk()
  const team = useMemo(() => decodeTeam(code, all), [code, all])

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <h1 className="text-center text-2xl font-bold">{t('shared.title')}</h1>
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {team.map(({ pokemon, tier }) => (
          <Card key={pokemon.id}>
            <CardContent className="flex flex-col items-center gap-1 p-2">
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-muted">
                <img
                  src={pokemon.image}
                  alt={pokemonName(pokemon, locale)}
                  loading="lazy"
                  className="h-full w-full object-contain p-1.5"
                />
                {tier && (
                  <span
                    className={cn(
                      'absolute bottom-1 right-1 rounded-full px-1.5 text-[10px] font-bold',
                      TIER_CHIP[tier],
                    )}
                  >
                    {tier}
                  </span>
                )}
              </div>
              <p className="w-full truncate text-center text-sm font-semibold">
                {pokemonName(pokemon, locale)}
              </p>
              <p className="w-full truncate text-center text-xs text-muted-foreground">
                {pokemon.types.map((ty) => typeLabel(ty, locale)).join(' · ')}
              </p>
              <p className="w-full truncate text-center text-xs text-muted-foreground">
                {pokemon.specialties.map(specialtyLabel).join(' · ')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button size="lg" onClick={onStart}>
          {t('shared.cta')}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
