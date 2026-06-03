import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Locale } from '@/data/types'
import { messages } from './messages'

const STORAGE_KEY = 'acnh-locale-v1'

interface LocaleContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

function isLocale(value: unknown): value is Locale {
  return value === 'ko' || value === 'en' || value === 'ja'
}

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // localStorage 접근 불가 — 자동 감지로 진행.
  }

  const nav = typeof navigator !== 'undefined' ? navigator.language : ''
  if (nav.startsWith('ko')) return 'ko'
  if (nav.startsWith('ja')) return 'ja'
  return 'en'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // 영속화 실패는 무시.
      }
      if (typeof document !== 'undefined') {
        document.documentElement.lang = next
      }
    }
  }, [])

  const t = useCallback(
    (key: string): string =>
      messages[locale]?.[key] ?? messages.en[key] ?? key,
    [locale],
  )

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return ctx
}
