import { ArrowRight } from 'lucide-react'
import { useHub } from './i18n'
import { LanguageSwitcher } from '@/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function App() {
  const { t } = useHub()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-2 px-4 py-3">
          <img src="/favicon.svg" alt="" className="h-8 w-8" />
          <span className="text-lg font-bold">villagertier.com</span>
          <div className="ml-auto">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <section className="text-center">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">villagertier.com</h1>
          <p className="mt-3 text-lg text-muted-foreground">{t('tagline')}</p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t('intro')}
          </p>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <Card className="overflow-hidden">
            <img
              src="/og-image.png"
              alt={t('acnh.title')}
              className="aspect-[1200/630] w-full object-cover"
            />
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                {t('acnh.meta')}
              </p>
              <h2 className="mt-1 text-xl font-bold">{t('acnh.title')}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('acnh.desc')}</p>
              <Button asChild className="mt-4 gap-2">
                <a href="acnh/">
                  {t('acnh.cta')}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <img
              src="/pokopia-og-image.png"
              alt={t('pokopia.title')}
              className="aspect-[1200/630] w-full object-cover"
            />
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-600 dark:text-orange-400">
                {t('pokopia.meta')}
              </p>
              <h2 className="mt-1 text-xl font-bold">{t('pokopia.title')}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('pokopia.desc')}</p>
              <Button
                asChild
                className="mt-4 gap-2 bg-orange-600 text-white hover:bg-orange-500"
              >
                <a href="pokopia/">
                  {t('pokopia.cta')}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="mx-auto mt-12 max-w-2xl text-center">
          <h2 className="text-lg font-bold">{t('about.title')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('about.body')}</p>
        </section>

        <section className="mx-auto mt-12 max-w-2xl text-center">
          <h2 className="text-lg font-bold">{t('guides.title')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('guides.desc')}</p>
          <Button asChild variant="outline" className="mt-4 gap-2">
            <a href="guides/">
              {t('guides.cta')}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </section>
      </main>

      <footer className="border-t border-border py-4">
        <p className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground">
          {t('footer')}
        </p>
      </footer>
    </div>
  )
}
