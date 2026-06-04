import { useMemo, useState } from 'react'
import type { PersonalityKey, Tier, Villager } from '@/data/types'
import { PERSONALITY_KEYS } from '@/data/types'
import villagersData from '@/data/villagers.json'
import { useLocale } from '@/i18n'
import { useRatings } from '@/hooks/useRatings'
import { useBlacklist } from '@/hooks/useBlacklist'
import { useResidents } from '@/hooks/useResidents'
import { VillagerCard } from './VillagerCard'
import {
  FilterBar,
  applyFilter,
  EMPTY_FILTER,
} from './FilterBar'
import type { VillagerFilter } from './FilterBar'

const VILLAGERS = villagersData as Villager[]

export function VillagerGrid() {
  const { locale } = useLocale()
  const { ratings, setTier, remove: removeRating } = useRatings()
  const { has: isBlacklisted, toggle: toggleBlacklist, remove: removeBlacklist } = useBlacklist()
  const { residents, has: isResident, toggle: toggleResident, remove: removeResident } = useResidents()
  const [filter, setFilter] = useState<VillagerFilter>(EMPTY_FILTER)

  // 평가/블랙리스트/거주중 3개는 상호배타. 하나를 켜면 나머지는 해제.
  const onSetTier = (id: string, t: Tier) => {
    removeBlacklist(id)
    removeResident(id)
    setTier(id, t)
  }
  const onToggleBlacklist = (id: string) => {
    if (!isBlacklisted(id)) {
      removeRating(id)
      removeResident(id)
    }
    toggleBlacklist(id)
  }
  const onToggleResident = (id: string) => {
    if (!isResident(id)) {
      removeRating(id)
      removeBlacklist(id)
    }
    toggleResident(id)
  }

  const speciesList = useMemo(
    () => Array.from(new Set(VILLAGERS.map((v) => v.species))).sort(),
    [],
  )

  const personalityCounts = useMemo(() => {
    const counts = Object.fromEntries(
      PERSONALITY_KEYS.map((p) => [p, 0]),
    ) as Record<PersonalityKey, number>
    for (const v of VILLAGERS) counts[v.personality] += 1
    return counts
  }, [])

  const filtered = useMemo(
    () => applyFilter(VILLAGERS, filter, locale, ratings, residents),
    [filter, locale, ratings, residents],
  )

  return (
    <div className="flex flex-col gap-4">
      <FilterBar
        search={filter.search}
        onSearchChange={(search) => setFilter((f) => ({ ...f, search }))}
        species={filter.species}
        onSpeciesChange={(species) => setFilter((f) => ({ ...f, species }))}
        personality={filter.personality}
        onPersonalityChange={(personality) =>
          setFilter((f) => ({ ...f, personality }))
        }
        ratedOnly={filter.ratedOnly}
        onRatedOnlyChange={(ratedOnly) => setFilter((f) => ({ ...f, ratedOnly }))}
        residentOnly={filter.residentOnly}
        onResidentOnlyChange={(residentOnly) =>
          setFilter((f) => ({ ...f, residentOnly }))
        }
        speciesList={speciesList}
        personalityCounts={personalityCounts}
        shownCount={filtered.length}
        totalCount={VILLAGERS.length}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {filtered.map((v) => (
          <VillagerCard
            key={v.id}
            villager={v}
            tier={ratings[v.id]}
            blacklisted={isBlacklisted(v.id)}
            resident={isResident(v.id)}
            onSetTier={onSetTier}
            onClearTier={removeRating}
            onToggleBlacklist={onToggleBlacklist}
            onToggleResident={onToggleResident}
            locale={locale}
          />
        ))}
      </div>
    </div>
  )
}
