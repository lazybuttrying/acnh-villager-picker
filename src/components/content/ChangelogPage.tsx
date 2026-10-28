import { ArrowLeft } from 'lucide-react'
import { useLocale, LanguageSwitcher } from '@/i18n'
import { Button } from '@/components/ui/button'

// Update history, newest first. Entry copy lives in i18n (changelog.eN.*).
const ENTRIES = [6, 5, 0, 1, 2, 3, 4] as const

// Changelog page — rendered by App for the 'changelog' view (same pattern as
// the other content pages). Signals an actively maintained site.
export function ChangelogPage({ onBack }: { onBack: () => void }) {
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
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('changelog.title')}</h1>
        <p className="mt-5 text-base text-muted-foreground">{t('changelog.intro')}</p>

        <div className="mt-8 flex flex-col gap-8">
          {ENTRIES.map((n) => (
            <section key={n}>
              <p className="text-sm font-medium tabular-nums text-primary">
                {t(`changelog.e${n}.date`)}
              </p>
              <h2 className="mt-1 text-xl font-semibold">{t(`changelog.e${n}.title`)}</h2>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                {t(`changelog.e${n}.body`)}
              </p>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
