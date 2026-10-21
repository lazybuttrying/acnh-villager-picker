import { useState } from 'react'
import { ArrowLeft, Check, Copy, Download } from 'lucide-react'
import { LanguageSwitcher, useLocale } from '@/i18n'
import { Button } from '@/components/ui/button'

const PROMO_IMAGE = '/event-promo.png'
const SITE_URL = 'https://villagertier.com/'

/** X logo (brand icons are not in lucide). */
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

/** Share-event promo page: save the promo image, then post it on X. */
export function EventPage({ onBack }: { onBack: () => void }) {
  const { t } = useLocale()
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)

  const saveImage = async () => {
    if (busy) return
    setBusy(true)
    try {
      const res = await fetch(PROMO_IMAGE)
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'villagertier-promo.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.setTimeout(() => URL.revokeObjectURL(a.href), 4000)
    } finally {
      setBusy(false)
    }
  }

  const postToX = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(t('event.tweetText'))}&url=${encodeURIComponent(SITE_URL)}`,
      '_blank',
      'noopener,width=560,height=460',
    )
  }

  const copyText = async () => {
    const text = `${t('event.tweetText')} ${SITE_URL}`
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-3">
          <Button variant="ghost" size="sm" className="gap-1.5" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            {t('privacy.back')}
          </Button>
          <span className="truncate text-sm font-bold">{t('event.title')}</span>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">{t('event.title')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('event.lede')}</p>
        </div>

        {/* Promo image preview */}
        <div className="mx-auto mt-6 max-w-md overflow-hidden rounded-2xl border shadow-sm">
          <img src={PROMO_IMAGE} alt={t('event.title')} className="aspect-square w-full object-cover" />
        </div>

        {/* Steps */}
        <ol className="mx-auto mt-6 flex max-w-md flex-col gap-3">
          {[
            { n: 1, title: t('event.step1title'), desc: t('event.step1desc') },
            { n: 2, title: t('event.step2title'), desc: t('event.step2desc') },
          ].map((s) => (
            <li key={s.n} className="flex items-start gap-3 rounded-lg border bg-card p-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {s.n}
              </span>
              <span>
                <span className="block text-sm font-bold">{s.title}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">{s.desc}</span>
              </span>
            </li>
          ))}
        </ol>

        {/* Suggested tweet text */}
        <div className="mx-auto mt-6 max-w-md rounded-lg border bg-muted/40 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-muted-foreground">{t('event.tweetPreview')}</span>
            <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={copyText}>
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? t('event.copied') : t('event.copyText')}
            </Button>
          </div>
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed">{t('event.tweetText')}</p>
        </div>

        {/* Actions */}
        <div className="mx-auto mt-6 flex max-w-md flex-col gap-2.5 sm:flex-row">
          <Button size="lg" variant="outline" className="flex-1 gap-2" onClick={saveImage} disabled={busy}>
            <Download className="h-4 w-4" />
            {t('event.saveImage')}
          </Button>
          <Button size="lg" className="flex-1 gap-2" onClick={postToX}>
            <XIcon className="h-4 w-4" />
            {t('event.tweet')}
          </Button>
        </div>
      </main>
    </div>
  )
}
