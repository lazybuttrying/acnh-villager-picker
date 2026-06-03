import { Home, Minus, Plus } from 'lucide-react'
import type { Villager, PersonalityKey, PresetId, Locale, Tier } from '@/data/types'
import { useResidents } from '@/hooks/useResidents'
import { useRatings } from '@/hooks/useRatings'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Separator } from '@/components/ui/separator'
import { useLocale, villagerName, personalityLabel, speciesLabel } from '@/i18n'
import { cn } from '@/lib/utils'
import { PresetToggle } from './PresetToggle'
import { PersonalityRadar } from './PersonalityRadar'
import { SelectionPool } from './SelectionPool'
import { BlacklistTracker } from './BlacklistTracker'
import { ResidentTracker } from './ResidentTracker'
import { ExportReportButton } from './ExportReportButton'

export const MIN_TEAM = 3
export const MAX_TEAM = 10

const TIER_CHIP: Record<Tier, string> = {
  S: 'bg-amber-400 text-amber-950',
  A: 'bg-emerald-500 text-white',
  B: 'bg-blue-500 text-white',
  C: 'bg-gray-400 text-white',
}

export function RecommendPanel({
  team,
  score,
  missing,
  preset,
  onPreset,
  teamSize,
  onTeamSize,
  includeResidents,
  onIncludeResidents,
  residentCount,
  emptyPersonalities,
  locale,
}: {
  team: Villager[]
  score: number
  missing: PersonalityKey[]
  preset: PresetId
  onPreset: (p: PresetId) => void
  teamSize: number
  onTeamSize: (n: number) => void
  includeResidents: boolean
  onIncludeResidents: (v: boolean) => void
  residentCount: number
  emptyPersonalities?: PersonalityKey[]
  locale: Locale
}) {
  const { t } = useLocale()
  const { has: isResident } = useResidents()
  const { ratings, scores } = useRatings()
  const clamp = (n: number) => Math.min(MAX_TEAM, Math.max(MIN_TEAM, n))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{t('recommend.title')}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="tabular-nums">
              {t('recommend.score')}: {score.toFixed(1)}
            </Badge>
            <ExportReportButton
              result={{ team, score, missing }}
              preset={preset}
              teamSize={teamSize}
            />
          </div>
        </div>
        <div className="pt-2">
          <PresetToggle value={preset} onChange={onPreset} />
        </div>
        {/* 팀 인원 조절 (3~10). 8 미만이면 8성격 커버 제약은 자동 완화. */}
        <div className="flex items-center justify-between gap-2 pt-3">
          <span className="text-xs font-medium text-muted-foreground">{t('recommend.teamSize')}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={teamSize <= MIN_TEAM}
              onClick={() => onTeamSize(clamp(teamSize - 1))}
              aria-label="-"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="w-6 text-center text-sm font-bold tabular-nums">{teamSize}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={teamSize >= MAX_TEAM}
              onClick={() => onTeamSize(clamp(teamSize + 1))}
              aria-label="+"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        {/* 현재 거주 중 주민을 팀/점수에 포함할지 토글 — 포함 시/제외 시 점수 비교 */}
        {residentCount > 0 && (
          <div className="flex items-center justify-between gap-2 pt-2">
            <span className="text-xs font-medium text-muted-foreground">
              {t('recommend.includeResidents')}
              <span className="ml-1 tabular-nums">({residentCount})</span>
            </span>
            <Toggle
              variant="outline"
              size="sm"
              pressed={includeResidents}
              onPressedChange={onIncludeResidents}
              aria-label={t('recommend.includeResidents')}
              className="h-7 data-[state=on]:bg-sky-500 data-[state=on]:text-white"
            >
              {includeResidents ? 'ON' : 'OFF'}
            </Toggle>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <SelectionPool />
        <ResidentTracker />
        <BlacklistTracker />
        <Separator />

        {(missing.length > 0 || (emptyPersonalities && emptyPersonalities.length > 0)) && (
          <div className="flex flex-wrap gap-1.5">
            {missing.map((key) => (
              <Badge key={`missing-${key}`} variant="destructive">
                {personalityLabel(key, locale)}
              </Badge>
            ))}
            {emptyPersonalities?.map((key) => (
              <Badge key={`empty-${key}`} variant="outline" className="text-muted-foreground">
                {personalityLabel(key, locale)} {t('recommend.noFav')}
              </Badge>
            ))}
          </div>
        )}

        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {team.map((v) => (
            <li
              key={v.id}
              className="flex items-center gap-3 rounded-lg border bg-card p-2 text-card-foreground"
            >
              <img
                src={v.image}
                alt={villagerName(v, locale)}
                loading="lazy"
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-md object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 truncate text-sm font-medium">
                  {isResident(v.id) && <Home className="h-3 w-3 shrink-0 text-sky-500" />}
                  <span className="truncate">{villagerName(v, locale)}</span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                  <span>{personalityLabel(v.personality, locale)}</span>
                  <span aria-hidden>·</span>
                  <span>{speciesLabel(v.species, locale)}</span>
                </div>
              </div>
              {/* 항목별 추천 점수(찜 호감도). 버튼 없이 그대로 노출. */}
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                <span className="text-sm font-bold tabular-nums leading-none">
                  {(scores[v.id] ?? 0).toFixed(1)}
                </span>
                {ratings[v.id] ? (
                  <span
                    className={cn(
                      'flex h-4 min-w-4 items-center justify-center rounded px-1 text-[10px] font-bold leading-none',
                      TIER_CHIP[ratings[v.id]],
                    )}
                  >
                    {ratings[v.id]}
                  </span>
                ) : (
                  <span className="text-[10px] leading-none text-muted-foreground">
                    {t('tier.unrated')}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>

        <Separator />

        <PersonalityRadar team={team} locale={locale} />
      </CardContent>
    </Card>
  )
}
