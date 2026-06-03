import { useMemo } from 'react'
import { Ban, X } from 'lucide-react'
import type { Villager } from '@/data/types'
import villagersData from '@/data/villagers.json'
import { useBlacklist } from '@/hooks/useBlacklist'
import { useLocale, villagerName } from '@/i18n'

const VILLAGERS = villagersData as Villager[]
const BY_ID = new Map(VILLAGERS.map((v) => [v.id, v]))

/**
 * 제외(블랙리스트) 추적: 평가 풀과 별개로 추천에서 빼버린 주민.
 * 공유 스토어라 추가/해제 시 추천이 즉시 갱신된다. 비어 있으면 렌더하지 않음.
 */
export function BlacklistTracker() {
  const { ids, remove } = useBlacklist()
  const { locale, t } = useLocale()

  const villagers = useMemo(
    () =>
      ids
        .map((id) => BY_ID.get(id))
        .filter((v): v is Villager => !!v)
        .sort((a, b) => villagerName(a, locale).localeCompare(villagerName(b, locale), locale)),
    [ids, locale],
  )

  if (villagers.length === 0) return null

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-destructive">
          <Ban className="h-3.5 w-3.5" />
          {t('recommend.blacklist')}
        </span>
        <span className="text-xs tabular-nums text-muted-foreground">{villagers.length}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {villagers.map((v) => (
          <span key={v.id} className="group relative inline-flex">
            <button
              type="button"
              onClick={() => remove(v.id)}
              title={villagerName(v, locale)}
              className="flex items-center gap-1 rounded-full border border-destructive/40 bg-destructive/5 py-0.5 pl-0.5 pr-2 text-xs text-muted-foreground hover:bg-destructive/15"
            >
              <img
                src={v.image}
                alt=""
                loading="lazy"
                width={20}
                height={20}
                className="h-5 w-5 rounded-full object-cover grayscale"
              />
              <span className="max-w-20 truncate line-through">{villagerName(v, locale)}</span>
              <X className="h-3 w-3 shrink-0" />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}
