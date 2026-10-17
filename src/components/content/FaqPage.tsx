import { ArrowLeft } from 'lucide-react'
import { useLocale, LanguageSwitcher } from '@/i18n'
import { Button } from '@/components/ui/button'

// Frequently asked questions — rendered by App for the 'faq' view (same
// pattern as the legal pages).
const QA_COUNT = 9

export function FaqPage({ onBack }: { onBack: () => void }) {
  const { t } = useLocale()
  const items = Array.from({ length: QA_COUNT }, (_, i) => ({
    q: t(`faq.q${i + 1}.q`),
    a: t(`faq.q${i + 1}.a`),
  }))

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
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('faq.title')}</h1>
        <p className="mt-5 text-base text-muted-foreground">{t('faq.intro')}</p>

        <div className="mt-8 flex flex-col gap-6">
          {items.map((item) => (
            <section key={item.q}>
              <h2 className="text-xl font-semibold">{item.q}</h2>
              <p className="mt-2 text-base text-muted-foreground">{item.a}</p>
            </section>
          ))}
        </div>

        <p className="mt-10 border-t pt-6 text-sm text-muted-foreground">{t('landing.disclaimer')}</p>
      </main>
    </div>
  )
}
