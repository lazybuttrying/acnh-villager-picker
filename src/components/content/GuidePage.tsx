import { ArrowLeft } from 'lucide-react'
import { useLocale, LanguageSwitcher, personalityLabel, villagerName } from '@/i18n'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Locale, PersonalityKey, Villager } from '@/data/types'
import { PERSONALITY_KEYS } from '@/data/types'
import villagersData from '@/data/villagers.json'

const VILLAGERS = villagersData as Villager[]
const byId = new Map<string, Villager>(VILLAGERS.map((v) => [v.id, v]))

// Representative villagers per personality (ids verified against data).
const EXAMPLES: Record<PersonalityKey, string[]> = {
  Jock: ['der01', 'cat10', 'shp15', 'rbt03'],
  Lazy: ['cat00', 'cat06', 'ocp02', 'dog02'],
  Cranky: ['cat09', 'wol06', 'pbr00', 'cat15'],
  Smug: ['cat23', 'squ17', 'hrs13', 'wol10'],
  Peppy: ['wol12', 'cat02', 'cat05', 'rbt00'],
  Normal: ['ocp01', 'rbt02', 'cbr01', 'der00'],
  Snooty: ['cat19', 'der08', 'cbr19', 'wol03'],
  Uchi: ['dog17', 'cat21', 'shp12', 'ost10'],
}

function PersonalitySection({ pkey, locale }: { pkey: PersonalityKey; locale: Locale }) {
  const { t } = useLocale()
  const examples = (EXAMPLES[pkey] ?? [])
    .map((id) => byId.get(id))
    .filter((v): v is Villager => v !== undefined)

  return (
    <section>
      <h3 className="text-lg font-semibold">{personalityLabel(pkey, locale)}</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {examples.map((v) => (
          <Badge key={v.id} variant="secondary" className="font-normal">
            {villagerName(v, locale)}
          </Badge>
        ))}
      </div>
      <p className="mt-2 text-base text-muted-foreground">{t(`guide.p.${pkey.toLowerCase()}.body`)}</p>
    </section>
  )
}

// Villager personality guide — rendered by App for the 'guide' view (same
// pattern as the legal pages). Covers the 8 personalities, the 35 species,
// tier ratings, and team-balance tips.
export function GuidePage({ onBack }: { onBack: () => void }) {
  const { t, locale } = useLocale()

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
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('guide.title')}</h1>
        <p className="mt-5 text-base text-muted-foreground">{t('guide.intro')}</p>

        <div className="mt-10">
          <h2 className="text-2xl font-bold tracking-tight">{t('guide.personalities.title')}</h2>
          <p className="mt-2 text-base text-muted-foreground">{t('guide.personalities.intro')}</p>
          <div className="mt-6 flex flex-col gap-8">
            {PERSONALITY_KEYS.map((p) => (
              <PersonalitySection key={p} pkey={p} locale={locale} />
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-8">
          <section>
            <h2 className="text-2xl font-bold tracking-tight">{t('guide.species.title')}</h2>
            <p className="mt-2 text-base text-muted-foreground">{t('guide.species.body')}</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold tracking-tight">{t('guide.tiers.title')}</h2>
            <p className="mt-2 text-base text-muted-foreground">{t('guide.tiers.body')}</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold tracking-tight">{t('guide.balance.title')}</h2>
            <p className="mt-2 text-base text-muted-foreground">{t('guide.balance.body')}</p>
          </section>
        </div>

        <p className="mt-10 border-t pt-6 text-sm text-muted-foreground">{t('landing.disclaimer')}</p>
      </main>
    </div>
  )
}
