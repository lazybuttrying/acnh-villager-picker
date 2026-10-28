import { useMemo, useState } from 'react'
import { Check, Copy, Download, Share2 } from 'lucide-react'
import type { Pokemon, PresetId } from '../data/types'
import type { Tier } from '@/data/types'
import { PRESETS, recommend, scoreBreakdown, formHouses } from '../lib/recommend'
import { usePokopiaState, scoresFromRatings } from '../lib/store'
import { usePk, pokemonName, houseLabel, habitatLabel } from '../i18n'
import { encodeTeam, teamUrl } from '../lib/shareTeam'
import type { TeamEntry } from '../lib/shareTeam'
import { renderTeamImage } from '../lib/teamImage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const PRESET_IDS: PresetId[] = ['fav', 'specialty', 'type']
const HOUSE_COUNTS = [1, 2, 3, 4, 5, 6]

const TIER_CHIP: Record<Tier, string> = {
  S: 'bg-amber-400 text-amber-950',
  A: 'bg-emerald-500 text-white',
  B: 'bg-blue-500 text-white',
  C: 'bg-gray-400 text-white',
}

export function RecommendPanel({ all }: { all: Pokemon[] }) {
  const { locale, t } = usePk()
  const state = usePokopiaState()
  const [preset, setPreset] = useState<PresetId>('fav')
  const [houseCount, setHouseCount] = useState(3)
  const [copied, setCopied] = useState(false)

  const ratedCount = Object.keys(state.ratings).length

  const { houses, breakdown } = useMemo(() => {
    const scores = scoresFromRatings(state.ratings)
    const blacklist = new Set(state.blacklist)
    const recruitedSet = new Set(state.recruited)
    const pinned = all.filter((p) => recruitedSet.has(p.id))
    const pool = all.filter((p) => !blacklist.has(p.id) && !recruitedSet.has(p.id))
    const w = PRESETS[preset]
    const { team } = recommend(pool, scores, w, houseCount * 4, pinned)
    return {
      houses: formHouses(team, scores, houseCount),
      breakdown: scoreBreakdown(team, scores, w),
    }
  }, [all, state.ratings, state.blacklist, state.recruited, preset, houseCount])

  const housesWithTiers: TeamEntry[][] = houses.map((house) =>
    house.map((pokemon) => ({ pokemon, tier: state.ratings[pokemon.id] })),
  )
  const flatTeam = houses.flat()

  async function handleCopy() {
    const code = encodeTeam(housesWithTiers)
    try {
      await navigator.clipboard.writeText(teamUrl(code))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable
    }
  }

  function handleTweet() {
    const code = encodeTeam(housesWithTiers)
    const names = flatTeam.map((p) => pokemonName(p, locale)).join(', ')
    const text = `${t('share.imageTagline')}\n${names}\n${teamUrl(code)}`
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      '_blank',
      'noopener',
    )
  }

  async function handleSaveImage() {
    const blob = await renderTeamImage(housesWithTiers, {
      title: t('hero.title'),
      tagline: t('share.imageTagline'),
      locale,
      houseLabel: (n) => houseLabel(n, locale),
    })
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pokopia-dream-town.png'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Share2 className="h-5 w-5 text-primary" />
          {t('rec.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">{t('rec.preset')}</span>
          {PRESET_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setPreset(id)}
              aria-pressed={preset === id}
              className={cn(
                'rounded-full border px-3 py-1 text-sm transition-colors',
                preset === id
                  ? 'border-transparent bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:bg-accent',
              )}
            >
              {t(`rec.preset.${id}`)}
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">{t('rec.houses')}</span>
          <select
            value={houseCount}
            onChange={(e) => setHouseCount(Number(e.target.value))}
            className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            aria-label={t('rec.houses')}
          >
            {HOUSE_COUNTS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {ratedCount === 0 && state.recruited.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('rec.empty')}</p>
        ) : (
          <>
            <div className="space-y-3">
              {housesWithTiers.map((house, hi) => {
                const habitats = [...new Set(house.map(({ pokemon }) => pokemon.habitat))]
                return (
                  <div key={hi} className="rounded-lg border border-border p-2">
                    <div className="mb-2 flex items-center gap-2 px-1">
                      <span className="text-sm font-bold">{houseLabel(hi + 1, locale)}</span>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
                        {habitats.length === 1
                          ? habitatLabel(habitats[0], locale)
                          : t('rec.mixed')}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {house.length}/4
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {house.map(({ pokemon, tier }) => (
                        <div key={pokemon.id} className="flex flex-col items-center gap-1">
                          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-muted">
                            <img
                              src={pokemon.image}
                              alt={pokemonName(pokemon, locale)}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-contain p-1"
                            />
                            {tier && (
                              <span
                                className={cn(
                                  'absolute bottom-1 right-1 rounded-full px-1.5 text-[10px] font-bold',
                                  TIER_CHIP[tier],
                                )}
                              >
                                {tier}
                              </span>
                            )}
                          </div>
                          <span className="w-full truncate text-center text-[11px] leading-tight">
                            {pokemonName(pokemon, locale)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-4">
              <div>
                <span className="text-muted-foreground">{t('rec.score.total')}: </span>
                <strong>{breakdown.total.toFixed(1)}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">{t('rec.score.tier')}: </span>
                <strong>{breakdown.fav}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">{t('rec.score.coverage')}: </span>
                <strong>{breakdown.coverage}/16</strong>
              </div>
              <div>
                <span className="text-muted-foreground">{t('rec.score.typeDup')}: </span>
                <strong>{breakdown.typeDup}</strong>
              </div>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">{t('rec.covered')}: </span>
                {breakdown.covered.join(', ') || '-'}
              </p>
              <p>
                <span className="font-semibold text-foreground">{t('rec.missing')}: </span>
                {breakdown.missing.join(', ') || '-'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={handleCopy}>
                {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
                {copied ? t('share.copied') : t('share.copyLink')}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={handleTweet}>
                {t('share.tweet')}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={handleSaveImage}>
                <Download className="mr-1.5 h-4 w-4" />
                {t('share.saveImage')}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
