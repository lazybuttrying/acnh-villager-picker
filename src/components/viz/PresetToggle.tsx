import type { PresetId } from '@/data/types'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useLocale } from '@/i18n'

export function PresetToggle({
  value,
  onChange,
}: {
  value: PresetId
  onChange: (p: PresetId) => void
}) {
  const { t } = useLocale()

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as PresetId)
      }}
      className="justify-start"
    >
      <ToggleGroupItem value="fav" aria-label={t('preset.fav')}>
        {t('preset.fav')}
      </ToggleGroupItem>
      <ToggleGroupItem value="species" aria-label={t('preset.species')}>
        {t('preset.species')}
      </ToggleGroupItem>
      <ToggleGroupItem value="personality" aria-label={t('preset.personality')}>
        {t('preset.personality')}
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
