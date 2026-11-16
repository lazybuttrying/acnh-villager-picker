import { useMemo, useState } from 'react'
import type { Pokemon } from '../data/types'
import { COVERAGE_SPECIALTIES, HABITATS } from '../data/types'
import { coveredSpecialties } from '../lib/recommend'
import { usePokopiaState, setTier, toggleIn } from '../lib/store'
import { usePk, habitatLabel, specialtyLabel } from '../i18n'
import { PokemonCard } from './PokemonCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

/**
 * Habitat planner: Pokopia residents arrive because the environment suits
 * them, so planning starts from the habitat, not from the Pokemon. Pick a
 * habitat to see who comes, and which coverage specialties that group
 * brings (and misses) on its own. Cards rate and recruit in place.
 */
export function HabitatPlanner({ all }: { all: Pokemon[] }) {
  const { locale, t } = usePk()
  const state = usePokopiaState()
  const [habitat, setHabitat] = useState(HABITATS[0])

  const group = useMemo(
    () => all.filter((p) => p.habitat === habitat).sort((a, b) => a.dex - b.dex),
    [all, habitat],
  )
  const covered = useMemo(() => coveredSpecialties(group), [group])
  const missing = COVERAGE_SPECIALTIES.filter((s) => !covered.has(s))

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{t('planner.title')}</CardTitle>
        <p className="text-sm text-muted-foreground">{t('planner.desc')}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {HABITATS.map((h) => {
            const count = all.filter((p) => p.habitat === h).length
            return (
              <button
                key={h}
                type="button"
                onClick={() => setHabitat(h)}
                aria-pressed={habitat === h}
                className={cn(
                  'rounded-full border px-3 py-1 text-sm transition-colors',
                  habitat === h
                    ? 'border-transparent bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:bg-accent',
                )}
              >
                {habitatLabel(h, locale)} · {count}
              </button>
            )
          })}
        </div>

        <div className="space-y-1 text-xs text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">{t('rec.covered')} </span>
            <span>
              {covered.size}/16: {[...covered].map((s) => specialtyLabel(s)).join(', ') || '-'}
            </span>
          </p>
          <p>
            <span className="font-semibold text-foreground">{t('rec.missing')}: </span>
            {missing.map((s) => specialtyLabel(s)).join(', ') || '-'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {group.map((p) => (
            <PokemonCard
              key={p.id}
              pokemon={p}
              tier={state.ratings[p.id]}
              blacklisted={state.blacklist.includes(p.id)}
              recruited={state.recruited.includes(p.id)}
              onSetTier={(id, tier) => setTier(id, tier)}
              onClearTier={(id) => setTier(id, undefined)}
              onToggleBlacklist={(id) => toggleIn('blacklist', id)}
              onToggleRecruited={(id) => toggleIn('recruited', id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
