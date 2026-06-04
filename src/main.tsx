import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LocaleProvider } from '@/i18n'
import { loadAdSense } from '@/ads/adsense'

// AdSense 로더 주입(env 미설정 시 no-op).
loadAdSense()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <App />
    </LocaleProvider>
  </StrictMode>,
)
