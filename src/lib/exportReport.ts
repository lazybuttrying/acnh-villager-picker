import type {
  Locale,
  PersonalityKey,
  PresetId,
  Ratings,
  Tier,
  Villager,
} from '@/data/types'
import { PERSONALITY_KEYS, TIER_SCORE } from '@/data/types'
import {
  messages,
  personalityLabel,
  presetLabel,
  speciesLabel,
  villagerName,
} from '@/i18n'

// T1: 최종 주민풀 보고서. 외부 의존성 0 · CORS 무관(텍스트/JSON Blob 다운로드).
// 모든 함수는 순수(입력 → 문자열). UI는 ExportReportButton이 담당한다.

const TIERS: Tier[] = ['S', 'A', 'B', 'C']

export interface ReportResult {
  team: Villager[]
  score: number
  missing: PersonalityKey[]
}

export interface ReportInput {
  ratings: Ratings
  /** 현재 거주 중 주민 id 목록 */
  residentIds: string[]
  /** 제외(블랙리스트) 주민 id 목록 */
  blacklistIds: string[]
  result: ReportResult
  preset: PresetId
  teamSize: number
  locale: Locale
  /** 전체 주민 목록 (id → 주민 해석용) */
  villagers: Villager[]
  /** 파일명/헤더용 날짜. 테스트 주입 가능. 기본 현재 시각. */
  date?: Date
}

/** locale 한정 t(). i18n 컨텍스트 없이 순수하게 messages 테이블만 조회. */
function makeT(locale: Locale): (key: string) => string {
  return (key) => messages[locale]?.[key] ?? messages.en[key] ?? key
}

/** YYYY-MM-DD (로컬 타임존). */
export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 다운로드 파일명: acnh-villagers_<locale>_<YYYY-MM-DD>.<ext> */
export function reportFilename(locale: Locale, ext: 'md' | 'json', date: Date = new Date()): string {
  return `acnh-villagers_${locale}_${formatDate(date)}.${ext}`
}

/** 팀이 커버하는 고유 성격 수 (0..8). */
export function coverageCount(team: Villager[]): number {
  const seen = new Set<PersonalityKey>()
  for (const v of team) seen.add(v.personality)
  return seen.size
}

function byId(villagers: Villager[]): Map<string, Villager> {
  return new Map(villagers.map((v) => [v.id, v]))
}

function scoreOf(ratings: Ratings, id: string): number {
  const tier = ratings[id]
  return tier ? TIER_SCORE[tier] : 0
}

/** 티어별 선택 풀: S/A/B/C 순, 각 티어 내부는 이름 정렬. */
function poolByTier(
  ratings: Ratings,
  index: Map<string, Villager>,
  locale: Locale,
): Record<Tier, Villager[]> {
  const out: Record<Tier, Villager[]> = { S: [], A: [], B: [], C: [] }
  for (const [id, tier] of Object.entries(ratings)) {
    const v = index.get(id)
    if (v) out[tier].push(v)
  }
  for (const tier of TIERS) {
    out[tier].sort((a, b) => villagerName(a, locale).localeCompare(villagerName(b, locale), locale))
  }
  return out
}

function resolveSorted(
  ids: string[],
  index: Map<string, Villager>,
  locale: Locale,
): Villager[] {
  return ids
    .map((id) => index.get(id))
    .filter((v): v is Villager => v !== undefined)
    .sort((a, b) => villagerName(a, locale).localeCompare(villagerName(b, locale), locale))
}

function line(v: Villager, locale: Locale): string {
  return `${villagerName(v, locale)} — ${personalityLabel(v.personality, locale)} · ${speciesLabel(v.species, locale)}`
}

/** 사람이 읽는 Markdown 보고서. */
export function buildReportMarkdown(input: ReportInput): string {
  const { ratings, residentIds, blacklistIds, result, preset, teamSize, locale, villagers } = input
  const date = input.date ?? new Date()
  const t = makeT(locale)
  const index = byId(villagers)
  const covered = coverageCount(result.team)
  const total = PERSONALITY_KEYS.length

  const out: string[] = []
  out.push(`# ${t('report.title')}`)
  out.push('')
  out.push(`- **${t('report.generatedAt')}**: ${formatDate(date)}`)
  out.push(`- **${t('report.preset')}**: ${presetLabel(preset, locale)}`)
  out.push(`- **${t('report.teamSize')}**: ${teamSize}`)
  out.push(`- **${t('report.score')}**: ${result.score.toFixed(1)}`)
  out.push(`- **${t('report.coverage')}**: ${covered}/${total}`)
  out.push('')

  // 추천 팀
  out.push(`## ${t('report.recommended')} (${result.team.length})`)
  if (result.team.length === 0) {
    out.push(`_${t('report.none')}_`)
  } else {
    result.team.forEach((v, i) => {
      out.push(`${i + 1}. ${line(v, locale)} (${t('report.score')} ${scoreOf(ratings, v.id)})`)
    })
  }
  out.push('')

  // 티어별 선택 풀
  out.push(`## ${t('report.pool')}`)
  const pool = poolByTier(ratings, index, locale)
  const poolEmpty = TIERS.every((tier) => pool[tier].length === 0)
  if (poolEmpty) {
    out.push(`_${t('report.none')}_`)
  } else {
    for (const tier of TIERS) {
      if (pool[tier].length === 0) continue
      out.push(`### ${tier} (${pool[tier].length})`)
      for (const v of pool[tier]) out.push(`- ${line(v, locale)}`)
    }
  }
  out.push('')

  // 현재 거주 중
  const residents = resolveSorted(residentIds, index, locale)
  out.push(`## ${t('report.residents')} (${residents.length})`)
  if (residents.length === 0) out.push(`_${t('report.none')}_`)
  else for (const v of residents) out.push(`- ${line(v, locale)}`)
  out.push('')

  // 제외 목록
  const excluded = resolveSorted(blacklistIds, index, locale)
  out.push(`## ${t('report.excluded')} (${excluded.length})`)
  if (excluded.length === 0) out.push(`_${t('report.none')}_`)
  else for (const v of excluded) out.push(`- ${line(v, locale)}`)
  out.push('')

  return out.join('\n')
}

interface ReportEntry {
  id: string
  name: string
  personality: string
  personalityKey: PersonalityKey
  species: string
  speciesKey: string
}

function entry(v: Villager, locale: Locale): ReportEntry {
  return {
    id: v.id,
    name: villagerName(v, locale),
    personality: personalityLabel(v.personality, locale),
    personalityKey: v.personality,
    species: speciesLabel(v.species, locale),
    speciesKey: v.species,
  }
}

/** 기계가 읽는 JSON 보고서 (재가공/재import 용). */
export function buildReportJSON(input: ReportInput): string {
  const { ratings, residentIds, blacklistIds, result, preset, teamSize, locale, villagers } = input
  const date = input.date ?? new Date()
  const index = byId(villagers)
  const pool = poolByTier(ratings, index, locale)

  const doc = {
    generatedAt: formatDate(date),
    locale,
    preset,
    teamSize,
    score: Number(result.score.toFixed(2)),
    coverage: { covered: coverageCount(result.team), total: PERSONALITY_KEYS.length },
    missing: result.missing,
    recommended: result.team.map((v) => ({ ...entry(v, locale), score: scoreOf(ratings, v.id) })),
    pool: Object.fromEntries(
      TIERS.map((tier) => [tier, pool[tier].map((v) => entry(v, locale))]),
    ) as Record<Tier, ReportEntry[]>,
    residents: resolveSorted(residentIds, index, locale).map((v) => entry(v, locale)),
    excluded: resolveSorted(blacklistIds, index, locale).map((v) => entry(v, locale)),
  }
  return JSON.stringify(doc, null, 2)
}
