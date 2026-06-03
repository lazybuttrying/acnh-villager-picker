import { Check, ChevronDown } from 'lucide-react'
import type { Locale, PersonalityKey, Villager } from '@/data/types'
import { PERSONALITY_KEYS } from '@/data/types'
import { useLocale, villagerName, personalityLabel, speciesLabel } from '@/i18n'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

// Sentinel for the "all" option (Radix Select disallows empty-string values).
const ALL = '__all__'

export interface VillagerFilter {
  search: string
  species: string[] // 빈 배열 = 전체. 다중 선택.
  personality: PersonalityKey | null
  ratedOnly: boolean
}

export const EMPTY_FILTER: VillagerFilter = {
  search: '',
  species: [],
  personality: null,
  ratedOnly: false,
}

/**
 * Pure filter helper. `ratings` maps villagerId -> Tier (presence = rated).
 * Search matches the current-locale name AND the English name (case-insensitive).
 */
export function applyFilter(
  list: Villager[],
  filter: VillagerFilter,
  locale: Locale,
  ratings: Record<string, unknown>,
): Villager[] {
  const q = filter.search.trim().toLowerCase()
  const speciesSet = filter.species.length ? new Set(filter.species) : null
  return list.filter((v) => {
    if (speciesSet && !speciesSet.has(v.species)) return false
    if (filter.personality && v.personality !== filter.personality) return false
    if (filter.ratedOnly && !(v.id in ratings)) return false
    if (q) {
      const localeName = villagerName(v, locale).toLowerCase()
      const enName = v.nameEn.toLowerCase()
      if (!localeName.includes(q) && !enName.includes(q)) return false
    }
    return true
  })
}

export function FilterBar({
  search,
  onSearchChange,
  species,
  onSpeciesChange,
  personality,
  onPersonalityChange,
  ratedOnly,
  onRatedOnlyChange,
  speciesList,
  personalityCounts,
  shownCount,
  totalCount,
}: {
  search: string
  onSearchChange: (v: string) => void
  species: string[]
  onSpeciesChange: (v: string[]) => void
  personality: PersonalityKey | null
  onPersonalityChange: (v: PersonalityKey | null) => void
  ratedOnly: boolean
  onRatedOnlyChange: (v: boolean) => void
  /** Distinct species keys present in the data. */
  speciesList: string[]
  /** Per-personality total count (so shallow pools like Uchi stay visible). */
  personalityCounts: Record<PersonalityKey, number>
  shownCount: number
  totalCount: number
}) {
  const { locale, t } = useLocale()

  const toggleSpecies = (s: string) =>
    onSpeciesChange(
      species.includes(s) ? species.filter((x) => x !== s) : [...species, s],
    )

  const speciesTriggerLabel =
    species.length === 0
      ? t('filter.allSpecies')
      : species.length === 1
        ? speciesLabel(species[0], locale)
        : `${t('filter.species')} ${species.length}`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full sm:w-64"
          aria-label={t('search.placeholder')}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between gap-2 font-normal sm:w-44"
            >
              <span className="flex items-center gap-1.5 truncate">
                <span className="truncate">{speciesTriggerLabel}</span>
                {species.length > 0 && (
                  <Badge variant="secondary" className="tabular-nums">
                    {species.length}
                  </Badge>
                )}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-56 p-1">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                {t('filter.allSpecies')}
              </span>
              {species.length > 0 && (
                <button
                  type="button"
                  onClick={() => onSpeciesChange([])}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {t('filter.clear')}
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {speciesList.map((s) => {
                const checked = species.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => toggleSpecies(s)}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                        checked
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input',
                      )}
                    >
                      {checked && <Check className="h-3 w-3" />}
                    </span>
                    <span className="truncate">{speciesLabel(s, locale)}</span>
                  </button>
                )
              })}
            </div>
          </PopoverContent>
        </Popover>

        <Select
          value={personality ?? ALL}
          onValueChange={(v) =>
            onPersonalityChange(v === ALL ? null : (v as PersonalityKey))
          }
        >
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t('filter.allPersonalities')}</SelectItem>
            {PERSONALITY_KEYS.map((p) => (
              <SelectItem key={p} value={p}>
                <span className="flex w-full items-center justify-between gap-2">
                  <span>{personalityLabel(p, locale)}</span>
                  <Badge variant="secondary" className="ml-2">
                    {personalityCounts[p] ?? 0}
                  </Badge>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Toggle
          variant="outline"
          pressed={ratedOnly}
          onPressedChange={onRatedOnlyChange}
          aria-label={t('filter.ratedOnly')}
        >
          {t('filter.ratedOnly')}
        </Toggle>
      </div>

      <div className="text-xs text-muted-foreground">
        {shownCount} / {totalCount}
      </div>
    </div>
  )
}
