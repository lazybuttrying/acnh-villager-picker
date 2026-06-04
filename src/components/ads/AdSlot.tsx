import { useEffect, useRef } from 'react'
import { useLocale } from '@/i18n'
import { ADSENSE_CLIENT, pushAd } from '@/ads/adsense'

// AdSense 광고 슬롯. client·slot env가 둘 다 있어야 렌더한다(없으면 null →
// 승인 전/미설정 상태에서 빈 광고 영역이 생기지 않음). 마운트 시 1회만 push.
export function AdSlot({
  slot,
  format = 'auto',
  className,
}: {
  slot?: string
  format?: string
  className?: string
}) {
  const { t } = useLocale()
  const pushed = useRef(false)

  useEffect(() => {
    if (ADSENSE_CLIENT && slot && !pushed.current) {
      pushed.current = true
      pushAd()
    }
  }, [slot])

  if (!ADSENSE_CLIENT || !slot) return null

  return (
    <div className={`mx-auto w-full max-w-3xl ${className ?? ''}`}>
      <p className="mb-1 text-center text-[11px] uppercase tracking-wide text-muted-foreground/70">
        {t('ads.label')}
      </p>
      <ins
        className="adsbygoogle block overflow-hidden rounded-xl border bg-card/40"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
