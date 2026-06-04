import type { ComponentType } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Download,
  Home,
  Languages,
  Sparkles,
} from 'lucide-react'
import { useLocale, LanguageSwitcher } from '@/i18n'
import { Button } from '@/components/ui/button'
import { AdSlot } from '@/components/ads/AdSlot'

// 사이트 소개 랜딩. 라우터 없이 useView('about')일 때 App이 이 화면만 렌더한다.
// onEnter: 메인 앱으로 진입/복귀(상단 뒤로가기 버튼 + 하단 CTA 공용).

interface Feature {
  icon: ComponentType<{ className?: string }>
  titleKey: string
  descKey: string
}

const FEATURES: Feature[] = [
  { icon: ClipboardList, titleKey: 'landing.feat.rate.title', descKey: 'landing.feat.rate.desc' },
  { icon: Sparkles, titleKey: 'landing.feat.recommend.title', descKey: 'landing.feat.recommend.desc' },
  { icon: Home, titleKey: 'landing.feat.manage.title', descKey: 'landing.feat.manage.desc' },
  { icon: Languages, titleKey: 'landing.feat.i18n.title', descKey: 'landing.feat.i18n.desc' },
  { icon: Download, titleKey: 'landing.feat.export.title', descKey: 'landing.feat.export.desc' },
]

const STEP_KEYS = ['landing.step.1', 'landing.step.2', 'landing.step.3'] as const

// 티어→점수 표기. 색은 앱 카드(TIER_ACTIVE)와 동일하게 맞춘다.
const TIER_BADGES = [
  { tier: 'S', score: 4, cls: 'bg-amber-400 text-amber-950' },
  { tier: 'A', score: 3, cls: 'bg-emerald-500 text-white' },
  { tier: 'B', score: 2, cls: 'bg-blue-500 text-white' },
  { tier: 'C', score: 1, cls: 'bg-gray-400 text-white' },
] as const

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const { t } = useLocale()

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 바: 앱으로 돌아가기 + 언어 스위처 */}
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="container flex items-center justify-between gap-4 py-3">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={onEnter}>
            <ArrowLeft className="h-4 w-4" />
            <span>{t('landing.back')}</span>
          </Button>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="container max-w-3xl py-10">
        {/* 히어로 */}
        <section className="flex flex-col items-center text-center">
          <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-7 w-7" />
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{t('app.title')}</h1>
          <p className="mt-3 text-xl font-medium text-primary">{t('landing.tagline')}</p>
          <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">{t('landing.intro')}</p>
          <Button size="lg" className="mt-8 gap-2" onClick={onEnter}>
            {t('landing.start')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </section>

        {/* 주요 기능 */}
        <section className="mt-16">
          <h2 className="mb-5 text-center text-2xl font-bold">{t('landing.featuresTitle')}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, titleKey, descKey }) => (
              <div
                key={titleKey}
                className="flex gap-3 rounded-xl border bg-card p-4 text-card-foreground"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold">{t(titleKey)}</h3>
                  <p className="mt-1 text-base text-muted-foreground">{t(descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 사용 방법 */}
        <section className="mt-16">
          <h2 className="mb-5 text-center text-2xl font-bold">{t('landing.howTitle')}</h2>
          <ol className="mx-auto flex max-w-xl flex-col gap-3">
            {STEP_KEYS.map((key, i) => (
              <li key={key} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-base">{t(key)}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* 광고(보수적): env 미설정 시 null */}
        <AdSlot slot={import.meta.env.VITE_ADSENSE_SLOT_LANDING} className="mt-16" />

        {/* 점수 산출 방법 */}
        <section className="mt-16">
          <h2 className="mb-2 text-center text-2xl font-bold">{t('landing.score.title')}</h2>
          <p className="mb-5 text-center text-base text-muted-foreground">{t('landing.score.intro')}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* 티어 = 점수 */}
            <div className="rounded-xl border bg-card p-4 text-card-foreground">
              <h3 className="text-lg font-semibold">{t('landing.score.tier.title')}</h3>
              <p className="mt-1 text-base text-muted-foreground">{t('landing.score.tier.desc')}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {TIER_BADGES.map(({ tier, score, cls }) => (
                  <span
                    key={tier}
                    className={`inline-flex items-center gap-0.5 rounded-md px-2.5 py-1 text-sm font-bold tabular-nums ${cls}`}
                  >
                    {tier}
                    <span className="opacity-80">={score}</span>
                  </span>
                ))}
              </div>
            </div>
            {/* 다양성 */}
            <div className="rounded-xl border bg-card p-4 text-card-foreground">
              <h3 className="text-lg font-semibold">{t('landing.score.diversity.title')}</h3>
              <p className="mt-1 text-base text-muted-foreground">{t('landing.score.diversity.desc')}</p>
            </div>
            {/* 프리셋 */}
            <div className="rounded-xl border bg-card p-4 text-card-foreground">
              <h3 className="text-lg font-semibold">{t('landing.score.preset.title')}</h3>
              <p className="mt-1 text-base text-muted-foreground">{t('landing.score.preset.desc')}</p>
            </div>
          </div>
          <p className="mx-auto mt-4 w-fit rounded-lg bg-muted px-3.5 py-2 text-center text-base tabular-nums text-muted-foreground">
            {t('landing.score.formula')}
          </p>
        </section>

        {/* 하단 CTA */}
        <section className="mt-16 flex flex-col items-center">
          <Button size="lg" className="gap-2" onClick={onEnter}>
            {t('landing.start')}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </section>
      </main>

      <footer className="container py-8 text-center text-sm text-muted-foreground">
        {t('landing.disclaimer')}
      </footer>
    </div>
  )
}
