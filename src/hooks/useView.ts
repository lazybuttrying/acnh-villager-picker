import { useCallback, useEffect, useState } from 'react'

// 라우터 없이 해시 한 칸으로 뷰를 가른다. '#about' = 소개 랜딩, 그 외 = 메인 앱.
// 해시 기반이라 GitHub Pages(base:'./') 및 브라우저 뒤로가기와 그대로 호환된다.
export type View = 'app' | 'about'

function parseHash(): View {
  return window.location.hash.replace(/^#\/?/, '') === 'about' ? 'about' : 'app'
}

function scrollTop(): void {
  window.scrollTo({ top: 0 })
}

export function useView(): { view: View; goAbout: () => void; goApp: () => void } {
  const [view, setView] = useState<View>(parseHash)

  useEffect(() => {
    const onHashChange = () => {
      setView(parseHash())
      scrollTop()
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const goAbout = useCallback(() => {
    // 해시 변경 → hashchange 리스너가 상태 갱신(뒤로가기로 앱 복귀 가능)
    window.location.hash = 'about'
  }, [])

  const goApp = useCallback(() => {
    // 해시 제거로 깔끔한 URL 유지. replaceState는 hashchange를 발생시키지 않으므로 직접 갱신.
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    setView('app')
    scrollTop()
  }, [])

  return { view, goAbout, goApp }
}
