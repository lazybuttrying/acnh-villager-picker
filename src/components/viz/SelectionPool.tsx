import { useMemo } from 'react'
import { X } from 'lucide-react'
import type { Locale, Tier, Villager } from '@/data/types'
import villagersData from '@/data/villagers.json'
import { useRatings } from '@/hooks/useRatings'
import { useLocale, villagerName } from '@/i18n'
import { cn } from '@/lib/utils'

const VILLAGERS = villagersData as Villager[]
const BY_ID = new Map(VILLAGERS.map((v) => [v.id, v]))
const TIERS: Tier[] = ['S', 'A', 'B', 'C']

const TIER_CHIP: Record<Tier, string> = {
  S: 'bg-amber-400 text-amber-950',
  A: 'bg-emerald-500 text-white',
  B: 'bg-blue-500 text-white',
  C: 'bg-gray-400 text-white',
}

/**
 * 현재 선택 풀: 사용자가 평가한 주민을 티어별로 표시.
 * 아바타 클릭 → 티어 사이클, × → 즉시 해제. 공유 스토어라 추천이 즉시 갱신된다.
 */
export function SelectionPool() {
  const { ratings, cycle, remove } = useRatings()
  const { locale, t } = useLocale()

  const byTier = useMemo(() => {
    const groups: Record<Tier, Villager[]> = { S: [], A: [], B: [], C: [] }
    for (const [id, tier] of Object.entries(ratings)) {
      const v = BY_ID.get(id)
      if (v) groups[tier].push(v)
    }
    for (const tr of TIERS) {
      groups[tr].sort((a, b) => villagerName(a, locale).localeCompare(villagerName(b, locale), locale))
    }
    return groups
  }, [ratings, locale])

  const total = Object.keys(ratings).length

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold">{t('recommend.pool')}</span>
        <span className="text-xs tabular-nums text-muted-foreground">{total}</span>
      </div>

      {total === 0 ? (
        <p className="rounded-md border border-dashed py-4 text-center text-xs text-muted-foreground">
          {t('selection.empty')}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {TIERS.filter((tr) => byTier[tr].length > 0).map((tr) => (
            <div key={tr} className="flex items-start gap-2">
              <span
                className={cn(
                  'mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-bold',
                  TIER_CHIP[tr],
                )}
              >
                {tr}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {byTier[tr].map((v) => (
                  <PoolChip
                    key={v.id}
                    villager={v}
                    locale={locale}
                    onCycle={() => cycle(v.id)}
                    onRemove={() => remove(v.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PoolChip({
  villager,
  locale,
  onCycle,
  onRemove,
}: {
  villager: Villager
  locale: Locale
  onCycle: () => void
  onRemove: () => void
}) {
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        onClick={onCycle}
        title={villagerName(villager, locale)}
        className="flex items-center gap-1 rounded-full border bg-card py-0.5 pl-0.5 pr-2 text-xs hover:bg-accent hover:text-accent-foreground"
      >
        <img
          src={villager.image}
          alt=""
          loading="lazy"
          width={20}
          height={20}
          className="h-5 w-5 rounded-full object-cover"
        />
        <span className="max-w-20 truncate">{villagerName(villager, locale)}</span>
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label="remove"
        className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground group-hover:flex"
      >
        <X className="h-2.5 w-2.5" />
      </button>
    </span>
  )
}
