// Google AdSense 로더/푸시 헬퍼. env(VITE_ADSENSE_CLIENT) 미설정 시 전부 no-op이라
// 개발/승인 전에는 어떤 스크립트도 붙지 않는다. 퍼블리셔·슬롯 ID는 페이지 소스에
// 노출되는 공개값이므로 비밀이 아니며, env는 환경별 설정/미설정 전환 용도일 뿐이다.

export const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT

let loaded = false

// 앱 시작 시 1회: 계정 검증 메타 + adsbygoogle 로더 스크립트 주입. env 없으면 아무것도 안 함.
export function loadAdSense(): void {
  if (loaded || !ADSENSE_CLIENT || typeof document === 'undefined') return
  loaded = true

  if (!document.querySelector('meta[name="google-adsense-account"]')) {
    const meta = document.createElement('meta')
    meta.name = 'google-adsense-account'
    meta.content = ADSENSE_CLIENT
    document.head.appendChild(meta)
  }

  const script = document.createElement('script')
  script.async = true
  script.crossOrigin = 'anonymous'
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`
  document.head.appendChild(script)
}

// <ins> 마운트 후 광고 요청. 로더 로드 전/중복 푸시 등 예외는 조용히 무시.
export function pushAd(): void {
  if (!ADSENSE_CLIENT) return
  try {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  } catch {
    // ignore
  }
}
