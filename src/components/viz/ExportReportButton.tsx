import { Download } from 'lucide-react'
import type { PresetId, Villager } from '@/data/types'
import villagersData from '@/data/villagers.json'
import { useRatings } from '@/hooks/useRatings'
import { useBlacklist } from '@/hooks/useBlacklist'
import { useResidents } from '@/hooks/useResidents'
import { useLocale } from '@/i18n'
import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import {
  buildReportMarkdown,
  buildReportJSON,
  reportFilename,
  type ReportInput,
  type ReportResult,
} from '@/lib/exportReport'

const VILLAGERS = villagersData as Villager[]

/** content를 파일로 다운로드 (Blob + objectURL, 외부 의존성 0). */
function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function ExportReportButton({
  result,
  preset,
  teamSize,
}: {
  result: ReportResult
  preset: PresetId
  teamSize: number
}) {
  const { ratings } = useRatings()
  const { ids: blacklistIds } = useBlacklist()
  const { ids: residentIds } = useResidents()
  const { locale, t } = useLocale()

  const handleExport = (ext: 'md' | 'json') => {
    const input: ReportInput = {
      ratings,
      residentIds,
      blacklistIds,
      result,
      preset,
      teamSize,
      locale,
      villagers: VILLAGERS,
      date: new Date(),
    }
    if (ext === 'md') {
      downloadFile(reportFilename(locale, 'md', input.date), buildReportMarkdown(input), 'text/markdown;charset=utf-8')
    } else {
      downloadFile(reportFilename(locale, 'json', input.date), buildReportJSON(input), 'application/json;charset=utf-8')
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5" aria-label={t('report.export')}>
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t('report.export')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-1.5">
        <div className="flex flex-col gap-0.5">
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => handleExport('md')}>
            {t('report.markdown')}
          </Button>
          <Button variant="ghost" size="sm" className="justify-start" onClick={() => handleExport('json')}>
            {t('report.json')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
