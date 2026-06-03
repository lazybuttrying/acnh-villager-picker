import { Minus, Plus } from 'lucide-react'
import type { Villager, PersonalityKey, PresetId, Locale } from '@/data/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useLocale, villagerName, personalityLabel, speciesLabel } from '@/i18n'
import { PresetToggle } from './PresetToggle'
import { PersonalityRadar } from './PersonalityRadar'
import { SelectionPool } from './SelectionPool'
import { BlacklistTracker } from './BlacklistTracker'
import { ResidentTracker } from './ResidentTracker'

export const MIN_TEAM = 3
export const MAX_TEAM = 10

export function RecommendPanel({
  team,
  score,
  missing,
  preset,
  onPreset,
  teamSize,
  onTeamSize,
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
  emptyPersonalities?: PersonalityKey[]
  locale: Locale
}) {
  const { t } = useLocale()
  const clamp = (n: number) => Math.min(MAX_TEAM, Math.max(MIN_TEAM, n))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{t('recommend.title')}</CardTitle>
          <Badge variant="secondary" className="tabular-nums">
            {t('recommend.score')}: {score.toFixed(1)}
          </Badge>
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
                <div className="truncate text-sm font-medium">{villagerName(v, locale)}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                  <span>{personalityLabel(v.personality, locale)}</span>
                  <span aria-hidden>·</span>
                  <span>{speciesLabel(v.species, locale)}</span>
                </div>
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
