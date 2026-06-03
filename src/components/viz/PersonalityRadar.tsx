import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import type { Villager, Locale } from '@/data/types'
import { PERSONALITY_KEYS } from '@/data/types'
import { personalityLabel } from '@/i18n'

export function PersonalityRadar({ team, locale }: { team: Villager[]; locale: Locale }) {
  const counts = new Map<string, number>()
  for (const v of team) {
    counts.set(v.personality, (counts.get(v.personality) ?? 0) + 1)
  }

  let maxCount = 0
  const data = PERSONALITY_KEYS.map((key) => {
    const count = counts.get(key) ?? 0
    if (count > maxCount) maxCount = count
    return { axis: personalityLabel(key, locale), count }
  })

  const domainMax = Math.max(2, maxCount)

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid />
        <PolarAngleAxis dataKey="axis" tick={{ fontSize: 11 }} />
        <PolarRadiusAxis domain={[0, domainMax]} tickCount={domainMax + 1} tick={{ fontSize: 10 }} />
        <Radar
          dataKey="count"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.45}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
