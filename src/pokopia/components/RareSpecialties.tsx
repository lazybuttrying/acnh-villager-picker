import { useMemo } from 'react'
import type { Pokemon } from '../data/types'
import { ALL_SPECIALTIES } from '../data/types'
import { usePokopiaState } from '../lib/store'
import { usePk, pokemonName, habitatLabel, specialtyLabel } from '../i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const TIER_CHIP: Record<string, string> = {
  S: 'bg-amber-400 text-amber-950',
  A: 'bg-emerald-500 text-white',
  B: 'bg-blue-500 text-white',
  C: 'bg-gray-400 text-white',
}

/**
 * Rare specialties roundup: specialties with two holders or fewer in the
 * whole game. If a town ever needs one, it can only come from these exact
 * Pokemon, which makes them natural collection targets.
 */
export function RareSpecialties({ all }: { all: Pokemon[] }) {
  const { locale, t } = usePk()
  const state = usePokopiaState()

  const rare = useMemo(() => {
    const counts = new Map<string, Pokemon[]>()
    for (const p of all) {
      for (const s of p.specialties) {
        const list = counts.get(s) ?? []
        list.push(p)
        counts.set(s, list)
      }
    }
    return ALL_SPECIALTIES.map((s) => ({ specialty: s, holders: counts.get(s) ?? [] })).filter(
      ({ holders }) => holders.length >= 1 && holders.length <= 2,
    )
  }, [all])

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{t('rare.title')}</CardTitle>
        <p className="text-sm text-muted-foreground">{t('rare.desc')}</p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {rare.map(({ specialty, holders }) => (
            <div key={specialty} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-sm font-semibold">
                {specialtyLabel(specialty)}
              </span>
              <div className="flex flex-wrap gap-2">
                {holders.map((p) => {
                  const tier = state.ratings[p.id]
                  return (
                    <span
                      key={p.id}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-background py-0.5 pl-0.5 pr-2"
                    >
                      <img
                        src={p.image}
                        alt={pokemonName(p, locale)}
                        loading="lazy"
                        decoding="async"
                        className="h-7 w-7 rounded-full bg-muted object-contain"
                      />
                      <span className="text-xs">{pokemonName(p, locale)}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {habitatLabel(p.habitat, locale)}
                      </span>
                      {tier && (
                        <span
                          className={cn(
                            'rounded-full px-1 text-[10px] font-bold',
                            TIER_CHIP[tier],
                          )}
                        >
                          {tier}
                        </span>
                      )}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          <a href="/pokopia-guides/rare-specialties/" className="text-primary underline">
            {t('rare.more')}
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
