import { ArrowLeft } from 'lucide-react'
import { useLocale, LanguageSwitcher } from '@/i18n'
import { Button } from '@/components/ui/button'

// 개인정보처리방침 — useView('privacy')일 때 App이 이 화면만 렌더한다(랜딩과 동일 패턴).
// AdSense 승인 요건(개인정보처리방침 페이지) 충족 + 광고 쿠키/동의 고지.
const UPDATED = '2026-06-04'

export function PrivacyPolicy({ onBack }: { onBack: () => void }) {
  const { t } = useLocale()

  const sections = [
    { title: t('privacy.localStorage.title'), body: t('privacy.localStorage.body') },
    { title: t('privacy.ads.title'), body: t('privacy.ads.body') },
    { title: t('privacy.cookies.title'), body: t('privacy.cookies.body') },
    { title: t('privacy.consent.title'), body: t('privacy.consent.body') },
    { title: t('privacy.contact.title'), body: t('privacy.contact.body') },
  ]

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
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('privacy.title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('privacy.updated')}: {UPDATED}
        </p>
        <p className="mt-5 text-base text-muted-foreground">{t('privacy.intro')}</p>

        <div className="mt-8 flex flex-col gap-6">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-semibold">{s.title}</h2>
              <p className="mt-2 text-base text-muted-foreground">{s.body}</p>
            </section>
          ))}

          {/* 맞춤 광고 설정/벤더 정책 외부 링크 */}
          <section>
            <h2 className="text-xl font-semibold">{t('privacy.optout.title')}</h2>
            <p className="mt-2 text-base text-muted-foreground">
              {t('privacy.optout.body')}{' '}
              <a
                className="text-primary underline"
                href="https://adssettings.google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                adssettings.google.com
              </a>
              {' · '}
              <a
                className="text-primary underline"
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
              >
                policies.google.com/technologies/ads
              </a>
            </p>
          </section>
        </div>

        <p className="mt-10 border-t pt-6 text-sm text-muted-foreground">{t('landing.disclaimer')}</p>
      </main>
    </div>
  )
}
