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
import { VillagerGrid } from '@/components/eval/VillagerGrid'
import { SelectionSummary } from '@/components/eval/SelectionSummary'
import { RecommendPanel } from '@/components/viz/RecommendPanel'
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet'

const VILLAGERS = villagersData as Villager[]

function App() {
  const { locale, t } = useLocale()
  const { ratings, scores } = useRatings()
  const { blacklist } = useBlacklist()
  const { residents } = useResidents()
  const [preset, setPreset] = useState<PresetId>('fav')
  const [teamSize, setTeamSize] = useState<number>(TEAM_SIZE)
  const [sheetOpen, setSheetOpen] = useState(false)

  // 블랙리스트(제외) + 현재 거주중 주민은 추천 풀에서 제외 (이미 보유/원치 않음)
  const pool = useMemo(
    () => VILLAGERS.filter((v) => !(v.id in blacklist) && !(v.id in residents)),
    [blacklist, residents],
  )

  const result = useMemo(
    () => recommend(pool, scores, PRESETS[preset], teamSize),
    [pool, scores, preset, teamSize],
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
      emptyPersonalities={emptyPersonalities}
      locale={locale}
    />
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="container flex items-center justify-between gap-4 py-3">
          <h1 className="truncate text-lg font-bold tracking-tight sm:text-xl">{t('app.title')}</h1>
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
