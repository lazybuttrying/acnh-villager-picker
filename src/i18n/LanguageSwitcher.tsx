import type { Locale } from '@/data/types'
import { Languages } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLocale } from './LocaleProvider'

const LANG_OPTIONS: { value: Locale; label: string; short: string }[] = [
  { value: 'ko', label: '한국어', short: '한' },
  { value: 'en', label: 'English', short: 'EN' },
  { value: 'ja', label: '日本語', short: '日' },
]

// On mobile the trigger collapses to a globe icon + short label so the header
// keeps room for the title and the evaluation pill; full labels on sm+.
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale()

  return (
    <Select
      value={locale}
      onValueChange={(value) => setLocale(value as Locale)}
    >
      <SelectTrigger
        className="w-auto shrink-0 gap-1.5 px-2.5 sm:w-[140px] sm:px-3"
        aria-label={t('lang.label')}
      >
        <Languages className="h-4 w-4 shrink-0 text-muted-foreground" />
        <SelectValue placeholder={t('lang.label')} />
      </SelectTrigger>
      <SelectContent>
        {LANG_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            <span className="sm:hidden">{opt.short}</span>
            <span className="hidden sm:inline">{opt.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
