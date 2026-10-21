import { ArrowRight, Calculator, Heart, Layers, Sparkles } from 'lucide-react'
import type { Pokemon } from '../data/types'
import { usePk, pokemonName } from '../i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function Landing({
  all,
  onStart,
}: {
  all: Pokemon[]
  onStart: () => void
}) {
  const { locale, t } = usePk()
  const showcase = [
    'pikachu',
    'eevee',
    'bulbasaur',
    'charmander',
    'squirtle',
    'snorlax',
    'ditto',
    'mew',
  ]
    .map((id) => all.find((p) => p.id === id))
    .filter((p): p is Pokemon => !!p)

  const features = [
    { icon: Heart, title: t('features.tier.title'), desc: t('features.tier.desc') },
    { icon: Sparkles, title: t('features.spec.title'), desc: t('features.spec.desc') },
    { icon: Layers, title: t('features.type.title'), desc: t('features.type.desc') },
    { icon: Calculator, title: t('features.why.title'), desc: t('features.why.desc') },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <section className="text-center">
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{t('hero.title')}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">
          {t('hero.subtitle')}
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button size="lg" onClick={onStart}>
            {t('hero.cta')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{t('hero.note')}</p>

        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-4 gap-2 sm:grid-cols-8">
          {showcase.map((p) => (
            <div key={p.id} className="flex flex-col items-center gap-1">
              <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-muted">
                <img
                  src={p.image}
                  alt={pokemonName(p, locale)}
                  loading="lazy"
                  className="h-full w-full object-contain p-1.5"
                />
              </div>
              <span className="w-full truncate text-center text-[11px] text-muted-foreground">
                {pokemonName(p, locale)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-center text-xl font-bold">{t('steps.title')}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Card key={n}>
              <CardContent className="p-4">
                <h3 className="font-semibold">{t(`steps.${n}.title`)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(`steps.${n}.desc`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-center text-xl font-bold">{t('features.title')}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <Card key={f.title}>
              <CardContent className="flex gap-3 p-4">
                <f.icon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <Card>
          <CardContent className="p-5">
            <h2 className="text-lg font-bold">{t('about.title')}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t('about.body')}</p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 text-center">
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold">{t('cross.title')}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('cross.body')}</p>
            <Button asChild variant="outline" className="mt-3">
              <a href="../acnh/">
                {t('cross.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
