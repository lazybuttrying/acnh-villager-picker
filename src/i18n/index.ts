import type { Locale, Villager } from '@/data/types'

export { LocaleProvider, useLocale } from './LocaleProvider'
export { LanguageSwitcher } from './LanguageSwitcher'
export { personalityLabel, speciesLabel, presetLabel } from './labels'
export { messages } from './messages'

// 주민 이름 로케일 변환 (ja 결측 등은 en 폴백).
export function villagerName(v: Villager, locale: Locale): string {
  return v.names[locale] ?? v.names.en
}
