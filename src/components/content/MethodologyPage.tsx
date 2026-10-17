import { ArrowLeft } from 'lucide-react'
import { useLocale, LanguageSwitcher } from '@/i18n'
import { Button } from '@/components/ui/button'

// Scoring methodology — rendered by App for the 'methodology' view (same
// pattern as the legal pages). Documents the exact formula used by
// src/lib/recommend.ts so users can verify how recommendations are computed.
const SECTIONS = [
  'formula',
  'tiers',
  'penalty',
  'presets',
  'coverage',
  'algorithm',
  'teamsize',
  'data',
] as const

export function MethodologyPage({ onBack }: { onBack: () => void }) {
  const { t } = useLocale()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="container flex items-center justify-between gap-4 py-3">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            <span>{t('privacy.back')}</span>
          </Button>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="container max-w-3xl py-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('methodology.title')}</h1>
        <p className="mt-5 text-base text-muted-foreground">{t('methodology.intro')}</p>

        <div className="mt-8 flex flex-col gap-6">
          {SECTIONS.map((s) => (
            <section key={s}>
              <h2 className="text-xl font-semibold">{t(`methodology.${s}.title`)}</h2>
              <p className="mt-2 text-base text-muted-foreground">{t(`methodology.${s}.body`)}</p>
            </section>
          ))}
        </div>

        <p className="mt-10 border-t pt-6 text-sm text-muted-foreground">{t('landing.disclaimer')}</p>
      </main>
    </div>
  )
}
