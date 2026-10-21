import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { Pokemon } from '../data/types'
import { ALL_SPECIALTIES, HABITATS, TYPES } from '../data/types'
import { PokemonCard } from './PokemonCard'
import { RecommendPanel } from './RecommendPanel'
import { usePk, typeLabel, habitatLabel, specialtyLabel } from '../i18n'
import { usePokopiaState, setTier, toggleIn } from '../lib/store'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export function PickerApp({ all }: { all: Pokemon[] }) {
  const { locale, t } = usePk()
  const state = usePokopiaState()
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [type, setType] = useState('')
  const [habitat, setHabitat] = useState('')
  const [ratedOnly, setRatedOnly] = useState(false)
  const [recruitedOnly, setRecruitedOnly] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return all.filter((p) => {
      if (q) {
        const names = [p.nameEn, p.names.ko, p.names.en, p.names.ja].join(' ').toLowerCase()
        if (!names.includes(q)) return false
      }
      if (specialty && !p.specialties.includes(specialty)) return false
      if (type && !p.types.includes(type)) return false
      if (habitat && p.habitat !== habitat) return false
      if (ratedOnly && !state.ratings[p.id]) return false
      if (recruitedOnly && !state.recruited.includes(p.id)) return false
      return true
    })
  }, [all, query, specialty, type, habitat, ratedOnly, recruitedOnly, state.ratings, state.recruited])

  const selectCls =
    'rounded-md border border-border bg-background px-2 py-2 text-sm text-foreground'

  return (
    <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
        <div className="order-2 lg:order-1">
          <div className="mb-3 flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[180px] flex-1">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('search.placeholder')}
                  className="pl-8"
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {filtered.length} / {all.length}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className={selectCls}
                aria-label={t('filter.specialty')}
              >
                <option value="">
                  {t('filter.specialty')}: {t('filter.all')}
                </option>
                {ALL_SPECIALTIES.map((s) => (
                  <option key={s} value={s}>
                    {specialtyLabel(s)}
                  </option>
                ))}
              </select>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={selectCls}
                aria-label={t('filter.type')}
              >
                <option value="">
                  {t('filter.type')}: {t('filter.all')}
                </option>
                {TYPES.map((ty) => (
                  <option key={ty} value={ty}>
                    {typeLabel(ty, locale)}
                  </option>
                ))}
              </select>
              <select
                value={habitat}
                onChange={(e) => setHabitat(e.target.value)}
                className={selectCls}
                aria-label={t('filter.habitat')}
              >
                <option value="">
                  {t('filter.habitat')}: {t('filter.all')}
                </option>
                {HABITATS.map((h) => (
                  <option key={h} value={h}>
                    {habitatLabel(h, locale)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setRatedOnly((v) => !v)}
                aria-pressed={ratedOnly}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm transition-colors',
                  ratedOnly
                    ? 'border-transparent bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:bg-accent',
                )}
              >
                {t('filter.ratedOnly')}
              </button>
              <button
                type="button"
                onClick={() => setRecruitedOnly((v) => !v)}
                aria-pressed={recruitedOnly}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm transition-colors',
                  recruitedOnly
                    ? 'border-transparent bg-sky-500 text-white'
                    : 'border-border bg-background text-muted-foreground hover:bg-accent',
                )}
              >
                {t('filter.recruitedOnly')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {filtered.map((p) => (
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
        </div>

        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-20">
            <RecommendPanel all={all} />
          </div>
        </div>
      </div>
    </div>
  )
}
