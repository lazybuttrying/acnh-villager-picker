import { useMemo } from 'react'
import { Home, X } from 'lucide-react'
import type { Villager } from '@/data/types'
import villagersData from '@/data/villagers.json'
import { useResidents } from '@/hooks/useResidents'
import { useLocale, villagerName } from '@/i18n'

const VILLAGERS = villagersData as Villager[]
const BY_ID = new Map(VILLAGERS.map((v) => [v.id, v]))

/**
 * 현재 거주 중 추적: 이미 같이 사는 주민. 추천 풀에서 제외된다.
 * 공유 스토어라 추가/해제 시 추천이 즉시 갱신. 비어 있으면 렌더 안 함.
 */
export function ResidentTracker() {
  const { ids, remove } = useResidents()
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
        <span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
          <Home className="h-3.5 w-3.5" />
          {t('recommend.residents')}
        </span>
        <span className="text-xs tabular-nums text-muted-foreground">{villagers.length}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {villagers.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => remove(v.id)}
            title={villagerName(v, locale)}
            className="flex items-center gap-1 rounded-full border border-primary/40 bg-primary/5 py-0.5 pl-0.5 pr-2 text-xs hover:bg-primary/15"
          >
            <img
              src={v.image}
              alt=""
              loading="lazy"
              width={20}
              height={20}
              className="h-5 w-5 rounded-full object-cover"
            />
            <span className="max-w-20 truncate">{villagerName(v, locale)}</span>
            <X className="h-3 w-3 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  )
}
