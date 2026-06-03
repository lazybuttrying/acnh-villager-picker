import { useState } from 'react'
import type { MouseEvent } from 'react'
import { Ban, Home } from 'lucide-react'
import type { Locale, Tier, Villager } from '@/data/types'
import { TIER_SCORE } from '@/data/types'
import { villagerName, personalityLabel, speciesLabel, useLocale } from '@/i18n'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const TIERS = Object.keys(TIER_SCORE) as Tier[] // S, A, B, C

const TIER_ACTIVE: Record<Tier, string> = {
  S: 'bg-amber-400 text-amber-950 border-transparent',
  A: 'bg-emerald-500 text-white border-transparent',
  B: 'bg-blue-500 text-white border-transparent',
  C: 'bg-gray-400 text-white border-transparent',
}

export function VillagerCard({
  villager,
  tier,
  blacklisted = false,
  resident = false,
  onSetTier,
  onClearTier,
  onToggleBlacklist,
  onToggleResident,
  locale,
}: {
  villager: Villager
  tier?: Tier
  blacklisted?: boolean
  resident?: boolean
  onSetTier: (id: string, tier: Tier) => void
  onClearTier: (id: string) => void
  onToggleBlacklist: (id: string) => void
  onToggleResident: (id: string) => void
  locale: Locale
}) {
  const [imgError, setImgError] = useState(false)
  const { t } = useLocale()
  const name = villagerName(villager, locale)
  const tierDisabled = blacklisted || resident // 제외/거주 중이면 평가 무의미

  function handleBan(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    onToggleBlacklist(villager.id)
  }

  function handleResident(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    onToggleResident(villager.id)
  }

  function handleTier(e: MouseEvent<HTMLButtonElement>, tr: Tier) {
    e.stopPropagation()
    if (tier === tr) onClearTier(villager.id) // 같은 티어 재클릭 → 해제
    else onSetTier(villager.id, tr)
  }

  return (
    <Card
      className={cn(
        'group relative select-none overflow-hidden transition-shadow',
        blacklisted ? 'opacity-50 ring-2 ring-destructive/60 grayscale' : 'hover:shadow-md',
        resident && 'ring-2 ring-sky-500',
        !blacklisted && !resident && tier !== undefined && 'ring-2 ring-primary',
      )}
    >
      {/* 블랙리스트(제외) 토글 — 좌상단 */}
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

      {/* 현재 거주 중 토글 — 우상단 */}
      <button
        type="button"
        onClick={handleResident}
        aria-label={t('card.resident')}
        aria-pressed={resident}
        title={t('card.resident')}
        className={cn(
          'absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full border transition-opacity',
          resident
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
              src={villager.image}
              loading="lazy"
              alt={name}
              onError={() => setImgError(true)}
              className="h-full w-full object-contain"
            />
          )}
        </div>
        <div className="w-full text-center">
          <p className="truncate text-sm font-semibold leading-tight" title={name}>
            {name}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {speciesLabel(villager.species, locale)} · {personalityLabel(villager.personality, locale)}
          </p>
        </div>

        {/* 티어 버튼: S/A/B/C 한번에 표시 — 직접 선택(재클릭 해제) */}
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
