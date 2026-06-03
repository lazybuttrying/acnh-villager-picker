import { useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
import type { PersonalityKey, PresetId, Villager } from '@/data/types'
import { PERSONALITY_KEYS, TEAM_SIZE } from '@/data/types'
import villagersData from '@/data/villagers.json'
import { useRatings } from '@/hooks/useRatings'
import { useBlacklist } from '@/hooks/useBlacklist'
import { useResidents } from '@/hooks/useResidents'
import { recommend, PRESETS } from '@/lib/recommend'
import { useLocale, LanguageSwitcher } from '@/i18n'
import { useView } from '@/hooks/useView'
import { LandingPage } from '@/components/landing/LandingPage'
import { VillagerGrid } from '@/components/eval/VillagerGrid'
import { SelectionSummary } from '@/components/eval/SelectionSummary'
import { RecommendPanel } from '@/components/viz/RecommendPanel'
import { PersonalityTable } from '@/components/viz/PersonalityTable'
import { Card, CardContent } from '@/components/ui/card'
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet'

const VILLAGERS = villagersData as Villager[]

function App() {
  const { locale, t } = useLocale()
  const { view, goAbout, goApp } = useView()
  const { ratings, scores } = useRatings()
  const { blacklist } = useBlacklist()
  const { residents } = useResidents()
  const [preset, setPreset] = useState<PresetId>('fav')
  const [teamSize, setTeamSize] = useState<number>(TEAM_SIZE)
  const [includeResidents, setIncludeResidents] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  // 성격별 배치표는 S풀 또는 거주 중 주민이 하나라도 있을 때만 노출.
  const hasTableData = useMemo(
    () => Object.values(ratings).some((tier) => tier === 'S') || Object.keys(residents).length > 0,
    [ratings, residents],
  )

  // 블랙리스트(제외)는 항상 풀에서 제외. 거주중 주민은 풀에서 빼되,
  // includeResidents=ON이면 팀에 '고정 포함'(pinned)해 점수를 함께 계산한다.
  const pool = useMemo(
    () => VILLAGERS.filter((v) => !(v.id in blacklist) && !(v.id in residents)),
    [blacklist, residents],
  )
  const residentVillagers = useMemo(
    () => VILLAGERS.filter((v) => v.id in residents),
    [residents],
  )

  const result = useMemo(
    () =>
      recommend(
        pool,
        scores,
        PRESETS[preset],
        teamSize,
        includeResidents ? residentVillagers : [],
      ),
    [pool, scores, preset, teamSize, includeResidents, residentVillagers],
  )

  // 엣지케이스(스펙 §7-1): 사용자가 단 한 명도 평가하지 않은 성격 → 커버리지 위해 미평가 강제편입
  const emptyPersonalities = useMemo<PersonalityKey[]>(() => {
    const ratedP = new Set<PersonalityKey>()
    for (const v of VILLAGERS) {
      if (ratings[v.id]) ratedP.add(v.personality)
    }
    return PERSONALITY_KEYS.filter((p) => !ratedP.has(p))
  }, [ratings])

  const panel = (
    <RecommendPanel
      team={result.team}
      score={result.score}
      missing={result.missing}
      preset={preset}
      onPreset={setPreset}
      teamSize={teamSize}
      onTeamSize={setTeamSize}
      includeResidents={includeResidents}
      onIncludeResidents={setIncludeResidents}
      residentCount={residentVillagers.length}
      emptyPersonalities={emptyPersonalities}
      locale={locale}
    />
  )

  // 소개 랜딩 뷰 — 해시('#about')일 때 메인 UI 대신 전체 화면 차지. (훅은 위에서 모두 호출 후 분기)
  if (view === 'about') {
    return <LandingPage onEnter={goApp} />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="container flex items-center justify-between gap-4 py-3">
          <h1 className="min-w-0 truncate text-lg font-bold tracking-tight sm:text-xl">
            <button
              type="button"
              onClick={goAbout}
              title={t('about.hint')}
              aria-label={t('about.hint')}
              className="truncate rounded transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t('app.title')}
            </button>
          </h1>
          <div className="flex items-center gap-2">
            <SelectionSummary />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="container grid grid-cols-1 gap-6 py-6 lg:grid-cols-[1fr_24rem]">
        <section className="min-w-0 pb-20 lg:pb-0">
          <VillagerGrid />
        </section>
        {/* 데스크톱: 사이드 패널. 모바일에서는 숨기고 하단 드로어로 제공. */}
        <aside className="hidden lg:sticky lg:top-20 lg:block lg:h-fit">{panel}</aside>
      </main>

      {/* 성격별 배치표 — S풀/거주 중을 8성격 컬럼으로. 전체 폭 영역. */}
      {hasTableData && (
        <section className="container pb-20 lg:pb-6">
          <Card>
            <CardContent className="pt-6">
              <PersonalityTable />
            </CardContent>
          </Card>
        </section>
      )}

      {/* 모바일: 하단 고정 버튼 → 추천 드로어 */}
      <div className="lg:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t('recommend.title')}</span>
              <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs tabular-nums">
                {result.team.length}
              </span>
              <span className="tabular-nums opacity-90">{result.score.toFixed(1)}</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[88vh] overflow-y-auto p-4">
            <SheetTitle className="sr-only">{t('recommend.title')}</SheetTitle>
            {panel}
          </SheetContent>
        </Sheet>
      </div>

      <footer className="container py-6 text-center text-xs text-muted-foreground">
        비공식 팬 제작 · Animal Crossing 및 관련 명칭/이미지는 Nintendo의 자산입니다. (Nintendo 비제휴)
      </footer>
    </div>
  )
}

export default App
