import { ArrowLeft } from 'lucide-react'
import { useLocale, LanguageSwitcher } from '@/i18n'
import { Button } from '@/components/ui/button'

// 문의하기 — useView('contact')일 때 App이 이 화면만 렌더한다(privacy와 동일 패턴).
// 투명성/신뢰(및 AdSense 평가)를 위한 연락 경로 안내. 개인 정보 노출을 피해 공개 저장소 이슈를 채널로 둔다.
const REPO = 'https://github.com/lazybuttrying/acnh-villager-picker'

export function Contact({ onBack }: { onBack: () => void }) {
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
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('contact.title')}</h1>
        <p className="mt-5 text-base text-muted-foreground">{t('contact.intro')}</p>

        <div className="mt-8 flex flex-col gap-6">
          <section>
            <h2 className="text-xl font-semibold">{t('contact.github.title')}</h2>
            <p className="mt-2 text-base text-muted-foreground">
              {t('contact.github.body')}{' '}
              <a
                className="text-primary underline"
                href={`${REPO}/issues`}
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/lazybuttrying/acnh-villager-picker/issues
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">{t('contact.response.title')}</h2>
            <p className="mt-2 text-base text-muted-foreground">{t('contact.response.body')}</p>
          </section>
        </div>

        <p className="mt-10 border-t pt-6 text-sm text-muted-foreground">{t('landing.disclaimer')}</p>
      </main>
    </div>
  )
}
