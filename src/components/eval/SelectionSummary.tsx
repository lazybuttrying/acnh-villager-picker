import { useMemo } from 'react'
import type { PersonalityKey, Tier, Villager } from '@/data/types'
import { PERSONALITY_KEYS } from '@/data/types'
import villagersData from '@/data/villagers.json'
import { RotateCcw } from 'lucide-react'
import { useRatings } from '@/hooks/useRatings'
import { useBlacklist } from '@/hooks/useBlacklist'
import { useResidents } from '@/hooks/useResidents'
import { useLocale, personalityLabel } from '@/i18n'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const VILLAGERS = villagersData as Villager[]
const TIERS: Tier[] = ['S', 'A', 'B', 'C']

const TIER_CHIP: Record<Tier, string> = {
  S: 'bg-amber-400 text-amber-950',
  A: 'bg-emerald-500 text-white',
  B: 'bg-blue-500 text-white',
  C: 'bg-gray-400 text-white',
}

export function SelectionSummary() {
  const { ratings, clear: clearRatings } = useRatings()
  const { ids: blacklistIds, clear: clearBlacklist } = useBlacklist()
  const { ids: residentIds, clear: clearResidents } = useResidents()
  const { locale, t } = useLocale()

  const canReset =
    Object.keys(ratings).length > 0 || blacklistIds.length > 0 || residentIds.length > 0

  const handleReset = () => {
    if (!canReset) return
    if (window.confirm(t('selection.resetConfirm'))) {
      clearRatings()
      clearBlacklist()
      clearResidents()
    }
  }

  const { total, byTier, coveredCount, byPersonality } = useMemo(() => {
    const byTier: Record<Tier, number> = { S: 0, A: 0, B: 0, C: 0 }
    const byPersonality = Object.fromEntries(
      PERSONALITY_KEYS.map((p) => [p, 0]),
    ) as Record<PersonalityKey, number>

    const personalityOf = new Map(VILLAGERS.map((v) => [v.id, v.personality]))
    let total = 0
    for (const [id, tier] of Object.entries(ratings)) {
      byTier[tier] += 1
      total += 1
      const p = personalityOf.get(id)
      if (p) byPersonality[p] += 1
    }
    const coveredCount = PERSONALITY_KEYS.filter((p) => byPersonality[p] > 0).length
    return { total, byTier, coveredCount, byPersonality }
  }, [ratings])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {t('selection.rated')}
          </span>
          <span className="text-sm font-bold tabular-nums">{total}</span>
          <span className="hidden items-center gap-1 sm:flex">
            {TIERS.map((tr) => (
              <span
                key={tr}
                className={cn(
                  'flex h-5 min-w-5 items-center justify-center rounded px-1 text-[10px] font-bold tabular-nums',
                  byTier[tr] ? TIER_CHIP[tr] : 'bg-muted text-muted-foreground',
                )}
              >
                {byTier[tr]}
              </span>
            ))}
          </span>
          <Badge variant="secondary" className="tabular-nums">
            {coveredCount}/8
          </Badge>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">{t('selection.title')}</span>
          <Button
            variant="ghost"
            size="sm"
            disabled={!canReset}
            onClick={handleReset}
            className="h-7 gap-1 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <RotateCcw className="h-3 w-3" />
            {t('selection.reset')}
          </Button>
        </div>

        {total === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            {t('selection.empty')}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <div>
              <div className="mb-1.5 text-xs font-medium text-muted-foreground">
                {t('selection.byTier')}
              </div>
              <div className="flex gap-2">
                {TIERS.map((tr) => (
                  <div
                    key={tr}
                    className={cn(
                      'flex flex-1 flex-col items-center rounded-md py-1.5',
                      TIER_CHIP[tr],
                    )}
                  >
                    <span className="text-[11px] font-bold leading-none">{tr}</span>
                    <span className="text-sm font-bold tabular-nums leading-tight">
                      {byTier[tr]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>{t('selection.coverage')}</span>
                <span className="tabular-nums">{coveredCount}/8</span>
              </div>
              <ul className="flex flex-col gap-1">
                {PERSONALITY_KEYS.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm">
                    <span
                      className={cn(
                        'h-2 w-2 shrink-0 rounded-full',
                        byPersonality[p] ? 'bg-primary' : 'bg-muted-foreground/30',
                      )}
                    />
                    <span
                      className={cn(
                        'flex-1',
                        !byPersonality[p] && 'text-muted-foreground',
                      )}
                    >
                      {personalityLabel(p, locale)}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {byPersonality[p]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
