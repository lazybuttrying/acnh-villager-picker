/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Google AdSense 퍼블리셔 ID(ca-pub-…)와 광고 단위 슬롯 ID. 미설정 시 광고 비활성.
  readonly VITE_ADSENSE_CLIENT?: string
  readonly VITE_ADSENSE_SLOT_MAIN?: string
  readonly VITE_ADSENSE_SLOT_LANDING?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  adsbygoogle?: unknown[]
}
