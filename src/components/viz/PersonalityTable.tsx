import { useMemo } from 'react'
import type { Locale, PersonalityKey, Villager } from '@/data/types'
import { PERSONALITY_KEYS } from '@/data/types'
import villagersData from '@/data/villagers.json'
import { useRatings } from '@/hooks/useRatings'
import { useResidents } from '@/hooks/useResidents'
import { useLocale, villagerName, personalityLabel } from '@/i18n'
import { cn } from '@/lib/utils'

const VILLAGERS = villagersData as Villager[]
const BY_ID = new Map(VILLAGERS.map((v) => [v.id, v]))

/** 한 그룹(S풀/거주 중)을 8성격 컬럼으로 분배한 매핑. */
function groupByPersonality(villagers: Villager[], locale: Locale): Record<PersonalityKey, Villager[]> {
  const cols = Object.fromEntries(PERSONALITY_KEYS.map((p) => [p, [] as Villager[]])) as Record<
    PersonalityKey,
    Villager[]
  >
  for (const v of villagers) cols[v.personality].push(v)
  for (const p of PERSONALITY_KEYS) {
    cols[p].sort((a, b) => villagerName(a, locale).localeCompare(villagerName(b, locale), locale))
  }
  return cols
}

/**
 * 추천 패널 보조 뷰: S풀 / 현재 거주 중 두 그룹을 8가지 성격 컬럼으로 배열한 표.
 * - 컬럼 = 8성격, 행 그룹 = S풀 / 거주 중.
 * - 평가(S)·거주는 서로 독립 스토어라 한 주민이 양쪽에 모두 나타날 수 있다.
 * - 좁은 패널을 고려해 가로 스크롤. 둘 다 비면 렌더하지 않음.
 */
export function PersonalityTable() {
  const { ratings } = useRatings()
  const { residents } = useResidents()
  const { locale, t } = useLocale()

  const sPool = useMemo(() => {
    const list: Villager[] = []
    for (const [id, tier] of Object.entries(ratings)) {
      if (tier !== 'S') continue
      const v = BY_ID.get(id)
      if (v) list.push(v)
    }
    return groupByPersonality(list, locale)
  }, [ratings, locale])

  const residentCols = useMemo(() => {
    const list: Villager[] = []
    for (const id of Object.keys(residents)) {
      const v = BY_ID.get(id)
      if (v) list.push(v)
    }
    return groupByPersonality(list, locale)
  }, [residents, locale])

  const sTotal = useMemo(
    () => PERSONALITY_KEYS.reduce((n, p) => n + sPool[p].length, 0),
    [sPool],
  )
  const resTotal = useMemo(
    () => PERSONALITY_KEYS.reduce((n, p) => n + residentCols[p].length, 0),
    [residentCols],
  )

  if (sTotal === 0 && resTotal === 0) return null

  const rows: { key: string; label: string; chip: string; cols: Record<PersonalityKey, Villager[]>; total: number }[] = [
    { key: 'S', label: t('ptable.sPool'), chip: 'bg-amber-400 text-amber-950', cols: sPool, total: sTotal },
    { key: 'R', label: t('ptable.residents'), chip: 'bg-primary text-primary-foreground', cols: residentCols, total: resTotal },
  ]

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold">{t('ptable.title')}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-background px-1.5 py-1 text-left font-medium text-muted-foreground" />
              {PERSONALITY_KEYS.map((p) => (
                <th
                  key={p}
                  className="min-w-20 border-b px-1.5 py-1 text-center font-medium text-muted-foreground"
                >
                  {personalityLabel(p, locale)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="align-top">
                <th
                  scope="row"
                  className="sticky left-0 z-10 whitespace-nowrap bg-background px-1.5 py-2 text-left align-top"
                >
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-bold',
                      row.chip,
                    )}
                  >
                    {row.label}
                    <span className="tabular-nums opacity-80">{row.total}</span>
                  </span>
                </th>
                {PERSONALITY_KEYS.map((p) => (
                  <td key={p} className="min-w-20 border-b border-l px-1 py-1.5">
                    {row.cols[p].length === 0 ? (
                      <span className="block text-center text-[11px] text-muted-foreground/40">·</span>
                    ) : (
                      <ul className="flex flex-col gap-1">
                        {row.cols[p].map((v) => (
                          <li key={v.id} className="flex items-center gap-1" title={villagerName(v, locale)}>
                            <img
                              src={v.image}
                              alt=""
                              loading="lazy"
                              width={18}
                              height={18}
                              className="h-[18px] w-[18px] shrink-0 rounded-full object-cover"
                            />
                            <span className="truncate">{villagerName(v, locale)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
