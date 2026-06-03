import type { Locale } from '@/data/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLocale } from './LocaleProvider'

const LANG_OPTIONS: { value: Locale; label: string }[] = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
]

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale()

  return (
    <Select
      value={locale}
      onValueChange={(value) => setLocale(value as Locale)}
    >
      <SelectTrigger className="w-[140px]" aria-label={t('lang.label')}>
        <SelectValue placeholder={t('lang.label')} />
      </SelectTrigger>
      <SelectContent>
        {LANG_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
