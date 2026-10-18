import { ArrowLeft, Sparkles } from 'lucide-react'
import type { Tier, Villager } from '@/data/types'
import villagersData from '@/data/villagers.json'
import { getTeamCode } from '@/hooks/useView'
import { decodeTeam, resolveTeam } from '@/lib/shareTeam'
import { LanguageSwitcher, personalityLabel, speciesLabel, useLocale, villagerName } from '@/i18n'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const VILLAGERS = villagersData as Villager[]

const TIER_CHIP: Record<Tier, string> = {
  S: 'bg-amber-400 text-amber-950',
  A: 'bg-emerald-500 text-white',
  B: 'bg-blue-500 text-white',
  C: 'bg-gray-400 text-white',
}

/** Read-only landing page for a shared dream team (#/team/<code>). */
export function SharedTeamView({ onBack }: { onBack: () => void }) {
  const { t, locale } = useLocale()

  const code = getTeamCode()
  const members = code ? decodeTeam(code) : null
  const team = members ? resolveTeam(VILLAGERS, members) : null

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            {t('privacy.back')}
          </Button>
          <span className="truncate text-sm font-bold">{t('share.teamTitle')}</span>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        {!team ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">{t('share.invalid')}</p>
            <Button className="mt-4" onClick={onBack}>
              {t('share.cta')}
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-extrabold tracking-tight">{t('share.teamTitle')}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{t('share.viewHint')}</p>
            </div>

            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {team.map((v) => (
                <li key={v.id} className="overflow-hidden rounded-xl border bg-card text-card-foreground">
                  <img
                    src={v.image}
                    alt={villagerName(v, locale)}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                  <div className="p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-bold">{villagerName(v, locale)}</span>
                      <span
                        className={cn(
                          'flex h-5 min-w-5 items-center justify-center rounded px-1.5 text-xs font-bold leading-none',
                          TIER_CHIP[v.tier],
                        )}
                      >
                        {v.tier}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {personalityLabel(v.personality, locale)} · {speciesLabel(v.species, locale)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border bg-gradient-to-br from-emerald-50 to-lime-50 p-6 text-center dark:from-emerald-950/40 dark:to-lime-950/20">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="mt-3 text-lg font-extrabold">{t('share.ctaTitle')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t('share.ctaHint')}</p>
              <Button className="mt-4" size="lg" onClick={onBack}>
                {t('share.cta')}
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Badge variant="outline">villagertier.com</Badge>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
