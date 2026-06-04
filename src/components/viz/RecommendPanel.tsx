import { useState } from 'react'
import { Home, Minus, Plus } from 'lucide-react'
import type { Villager, PersonalityKey, PresetId, Locale, Tier } from '@/data/types'
import { PERSONALITY_KEYS } from '@/data/types'
import { useResidents } from '@/hooks/useResidents'
import { useRatings } from '@/hooks/useRatings'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'
import { Separator } from '@/components/ui/separator'
import { useLocale, villagerName, personalityLabel, speciesLabel, presetLabel } from '@/i18n'
import { cn } from '@/lib/utils'
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

const TOTAL_P = PERSONALITY_KEYS.length

/** 팀이 커버하는 고유 성격 수 (0..8). */
function coverage(team: Villager[]): number {
  return new Set(team.map((v) => v.personality)).size
}

export interface PresetResult {
  preset: PresetId
  team: Villager[]
  score: number
  missing: PersonalityKey[]
}

export function RecommendPanel({
  results,
  teamSize,
  onTeamSize,
  includeResidents,
  onIncludeResidents,
  residentCount,
  emptyPersonalities,
  locale,
}: {
  /** 세 프리셋(찜/종족/성격) 추천을 모두 담은 배열. 순서대로 세로 섹션으로 노출. */
  results: PresetResult[]
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
  const [selected, setSelected] = useState<PresetId>('fav')
  const clamp = (n: number) => Math.min(MAX_TEAM, Math.max(MIN_TEAM, n))
  const hasRatings = Object.keys(ratings).length > 0
  // 점수표에서 고른 프리셋의 추천 팀만 1회 노출. 기본은 찜. 표시·내보내기 공통 대상.
  const shown = results.find((r) => r.preset === selected) ?? results[0]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{t('recommend.title')}</CardTitle>
          {shown && (
            <ExportReportButton
              result={{ team: shown.team, score: shown.score, missing: shown.missing }}
              preset={shown.preset}
              teamSize={teamSize}
            />
          )}
        </div>
        {/* 팀 인원 조절 (3~10). 8 미만이면 8성격 커버 제약은 자동 완화. 세 프리셋 공통. */}
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
        {/* 프리셋별 점수·커버리지 비교표 */}
        <div className="overflow-hidden rounded-lg border">
          <div className="border-b bg-muted/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
            {t('recommend.scoreTableTitle')}
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b">
                <th className="px-3 py-1.5 text-left font-medium">{t('report.preset')}</th>
                <th className="px-3 py-1.5 text-right font-medium">{t('recommend.score')}</th>
                <th className="px-3 py-1.5 text-right font-medium">{t('recommend.coverageShort')}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr
                  key={`score-${r.preset}`}
                  onClick={() => setSelected(r.preset)}
                  aria-selected={r.preset === selected}
                  className={cn(
                    'cursor-pointer border-b transition-colors last:border-0 hover:bg-accent/50',
                    r.preset === selected && 'bg-accent',
                  )}
                >
                  <td className="px-3 py-1.5 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full',
                          r.preset === selected ? 'bg-primary' : 'bg-muted-foreground/30',
                        )}
                      />
                      {presetLabel(r.preset, locale)}
                    </span>
                  </td>
                  <td className="px-3 py-1.5 text-right font-bold tabular-nums">{r.score.toFixed(1)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">
                    {coverage(r.team)}/{TOTAL_P}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SelectionPool />
        <ResidentTracker />
        <BlacklistTracker />

        {/* 찜한 주민이 없는 성격 — 추천 시 미평가로 채워진다는 힌트.
            평가가 하나도 없을 땐 8개 전부 떠서 노이즈가 되므로 숨긴다. */}
        {hasRatings && emptyPersonalities && emptyPersonalities.length > 0 && (
          <div className="rounded-lg border border-dashed p-3">
            <div className="text-xs font-semibold text-muted-foreground">
              {t('recommend.noFavTitle')}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {emptyPersonalities.map((key) => (
                <Badge key={`empty-${key}`} variant="outline" className="text-muted-foreground">
                  {personalityLabel(key, locale)}
                </Badge>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">
              {t('recommend.noFavHint')}
            </p>
          </div>
        )}

        {/* 점수표에서 선택한 프리셋의 추천 팀 + 레이더 — 1회만 노출 */}
        {shown && (
          <section className="space-y-3">
            <Separator />
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold">{presetLabel(shown.preset, locale)}</h3>
              <Badge variant="secondary" className="tabular-nums">
                {t('recommend.score')}: {shown.score.toFixed(1)}
              </Badge>
            </div>

            {/* 선택한 프리셋 팀이 커버하지 못한 성격 */}
            {shown.missing.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {shown.missing.map((key) => (
                  <Badge key={`missing-${key}`} variant="destructive">
                    {personalityLabel(key, locale)}
                  </Badge>
                ))}
              </div>
            )}

            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {shown.team.map((v) => (
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

            <PersonalityRadar team={shown.team} locale={locale} />
          </section>
        )}
      </CardContent>
    </Card>
  )
}
