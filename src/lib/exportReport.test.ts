import { describe, it, expect } from 'vitest'
import type { Locale, PersonalityKey, Ratings, Villager } from '@/data/types'
import {
  buildReportMarkdown,
  buildReportJSON,
  reportFilename,
  coverageCount,
  formatDate,
  type ReportInput,
} from './exportReport'

function mk(id: string, personality: PersonalityKey, species: string): Villager {
  return {
    id,
    names: { ko: `${id}-ko`, en: `${id}-en`, ja: `${id}-ja` },
    nameEn: `${id}-en`,
    personality,
    species,
    gender: 'Male',
    image: '',
  }
}

// 5명: 다양한 성격/종족. 평가/거주/제외/추천에 골고루 배치.
const V = {
  a: mk('a', 'Jock', 'Cat'),
  b: mk('b', 'Lazy', 'Dog'),
  c: mk('c', 'Cranky', 'Cat'),
  d: mk('d', 'Peppy', 'Bear'),
  e: mk('e', 'Normal', 'Bird'),
}
const ALL = Object.values(V)

const DATE = new Date(2026, 5, 4) // 2026-06-04 (월 0-index)

function baseInput(overrides: Partial<ReportInput> = {}): ReportInput {
  const ratings: Ratings = { a: 'S', b: 'A', c: 'C' }
  return {
    ratings,
    residentIds: ['d'],
    blacklistIds: ['e'],
    result: { team: [V.a, V.b, V.d], score: 7.25, missing: [] },
    preset: 'fav',
    teamSize: 10,
    locale: 'ko',
    villagers: ALL,
    date: DATE,
    ...overrides,
  }
}

describe('helpers', () => {
  it('formatDate emits YYYY-MM-DD', () => {
    expect(formatDate(new Date(2026, 0, 9))).toBe('2026-01-09')
  })

  it('reportFilename includes locale, date and extension', () => {
    expect(reportFilename('en', 'json', DATE)).toBe('acnh-villagers_en_2026-06-04.json')
    expect(reportFilename('ja', 'md', DATE)).toBe('acnh-villagers_ja_2026-06-04.md')
  })

  it('coverageCount counts distinct personalities', () => {
    expect(coverageCount([V.a, V.b, V.d])).toBe(3)
    expect(coverageCount([V.a, V.c])).toBe(2) // Jock + Cranky
    expect(coverageCount([])).toBe(0)
  })
})

describe('buildReportMarkdown', () => {
  it('includes metadata: preset label, team size, score, coverage', () => {
    const md = buildReportMarkdown(baseInput())
    expect(md).toContain('# 드림 주민 보고서')
    expect(md).toContain('2026-06-04')
    expect(md).toContain('찜') // preset.fav 라벨 (ko)
    expect(md).toContain('**팀 인원**: 10')
    expect(md).toContain('**총점**: 7.3') // toFixed(1)
    expect(md).toContain('3/8') // 팀 3성격 커버
  })

  it('lists recommended villagers with localized name, personality, species and score', () => {
    const md = buildReportMarkdown(baseInput())
    // a: Jock/Cat tier S -> score 4
    expect(md).toContain('1. a-ko — 운동광 · 고양이 (총점 4)')
    // d: resident, but in team, unrated -> score 0
    expect(md).toContain('d-ko — 단순활발 · 곰 (총점 0)')
  })

  it('groups the pool by tier and only shows non-empty tiers', () => {
    const md = buildReportMarkdown(baseInput())
    expect(md).toContain('### S (1)')
    expect(md).toContain('### A (1)')
    expect(md).toContain('### C (1)')
    expect(md).not.toContain('### B') // B 티어 없음
  })

  it('renders residents and excluded sections', () => {
    const md = buildReportMarkdown(baseInput())
    expect(md).toContain('## 현재 거주 중 (1)')
    expect(md).toContain('d-ko — 단순활발 · 곰')
    expect(md).toContain('## 제외 목록 (1)')
    expect(md).toContain('e-ko — 친절함 · 새')
  })

  it('uses "없음" placeholder for empty sections', () => {
    const md = buildReportMarkdown(
      baseInput({
        ratings: {},
        residentIds: [],
        blacklistIds: [],
        result: { team: [], score: 0, missing: [] },
      }),
    )
    expect((md.match(/_없음_/g) ?? []).length).toBe(4) // 추천/풀/거주/제외 모두 비어있음
  })

  it('respects locale (en labels)', () => {
    const md = buildReportMarkdown(baseInput({ locale: 'en' as Locale }))
    expect(md).toContain('# Dream Villager Report')
    expect(md).toContain('## Recommended team (3)')
    expect(md).toContain('a-en — Jock · Cat')
  })
})

describe('buildReportJSON', () => {
  it('produces valid JSON with the expected shape', () => {
    const doc = JSON.parse(buildReportJSON(baseInput()))
    expect(doc.generatedAt).toBe('2026-06-04')
    expect(doc.locale).toBe('ko')
    expect(doc.preset).toBe('fav')
    expect(doc.teamSize).toBe(10)
    expect(doc.score).toBe(7.25)
    expect(doc.coverage).toEqual({ covered: 3, total: 8 })
    expect(doc.recommended).toHaveLength(3)
    expect(doc.recommended[0]).toMatchObject({
      id: 'a',
      name: 'a-ko',
      personalityKey: 'Jock',
      speciesKey: 'Cat',
      score: 4,
    })
    expect(doc.pool.S).toHaveLength(1)
    expect(doc.pool.B).toHaveLength(0)
    expect(doc.residents.map((r: { id: string }) => r.id)).toEqual(['d'])
    expect(doc.excluded.map((r: { id: string }) => r.id)).toEqual(['e'])
  })
})
