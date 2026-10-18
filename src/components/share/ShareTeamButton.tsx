import { useState } from 'react'
import { Check, Copy, ImageDown, Share2 } from 'lucide-react'
import type { Tier, Villager } from '@/data/types'
import { useLocale, villagerName } from '@/i18n'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { encodeTeam, makeShareUrl, type SharedMember } from '@/lib/shareTeam'
import { drawTeamImage } from '@/lib/teamImage'

/** X logo (brand icons are not in lucide). */
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/** Share a recommended team: copy link, post to X, or save a card image. */
export function ShareTeamButton({
  team,
  ratings,
}: {
  team: Villager[]
  ratings: Record<string, Tier>
}) {
  const { t, locale } = useLocale()
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)

  const members: SharedMember[] = team.map((v) => ({ id: v.id, tier: ratings[v.id] ?? 'C' }))
  const url = makeShareUrl(members)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Clipboard may be unavailable (permissions); fall back to a prompt-free selection.
      const ta = document.createElement('textarea')
      ta.value = url
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const postToX = () => {
    const text = t('share.xText')
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,width=560,height=460',
    )
  }

  const saveImage = async () => {
    if (busy) return
    setBusy(true)
    try {
      const blob = await drawTeamImage(
        team.map((v) => ({ name: villagerName(v, locale), image: v.image, tier: ratings[v.id] ?? 'C' })),
        t('share.imageTitle'),
        t('share.imageTagline'),
      )
      const file = new File([blob], `villagertier-team-${encodeTeam(members).slice(0, 8)}.png`, {
        type: 'image/png',
      })
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: t('share.imageTitle'), url })
      } else {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = file.name
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.setTimeout(() => URL.revokeObjectURL(a.href), 4000)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5">
          <Share2 className="h-3.5 w-3.5" />
          {t('share.button')}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-1.5">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={copyLink}>
          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          {copied ? t('share.copied') : t('share.copyLink')}
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={postToX}>
          <XIcon className="h-4 w-4" />
          {t('share.xPost')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={saveImage}
          disabled={busy}
        >
          <ImageDown className="h-4 w-4" />
          {t('share.saveImage')}
        </Button>
      </PopoverContent>
    </Popover>
  )
}
