import { useEffect, useMemo, useState } from 'react'
import type { Pokemon } from './data/types'
import pokemonData from './data/pokemon.json'
import { PickerApp } from './components/PickerApp'
import { Landing } from './components/Landing'
import { SharedTeamView } from './components/SharedTeamView'
import { usePk } from './i18n'
import { LanguageSwitcher } from '@/i18n'

const ALL = pokemonData as Pokemon[]

type View = { kind: 'landing' } | { kind: 'app' } | { kind: 'team'; code: string }

function parseHash(): View {
  const hash = window.location.hash
  if (hash.startsWith('#/team/')) return { kind: 'team', code: hash.slice('#/team/'.length) }
  if (hash === '#/app') return { kind: 'app' }
  return { kind: 'landing' }
}

export default function App() {
  const { t } = usePk()
  const [view, setView] = useState<View>(() => parseHash())

  // Warm Pokopia palette: scoped to this page via a body class (portal-safe).
  useEffect(() => {
    document.body.classList.add('pk-theme')
    return () => document.body.classList.remove('pk-theme')
  }, [])

  useEffect(() => {
    const onChange = () => setView(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  useEffect(() => {
    document.title =
      view.kind === 'app'
        ? `${t('app.title')} | villagertier.com`
        : `${t('hero.title')} | villagertier.com`
  }, [view, t])

  const go = (v: View) => {
    if (v.kind === 'app') window.location.hash = '#/app'
    else if (v.kind === 'landing') window.location.hash = '#/'
    setView(v)
  }

  const body = useMemo(() => {
    if (view.kind === 'app') return <PickerApp all={ALL} />
    if (view.kind === 'team')
      return <SharedTeamView all={ALL} code={view.code} onStart={() => go({ kind: 'app' })} />
    return <Landing all={ALL} onStart={() => go({ kind: 'app' })} />
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-3 py-2.5 sm:px-4">
          <a
            href="#/"
            className="flex items-center gap-2 font-bold"
            onClick={(e) => {
              e.preventDefault()
              go({ kind: 'landing' })
            }}
          >
            <img src="../favicon.svg" alt="" className="h-7 w-7" />
            <span className="hidden sm:inline">{t('hero.title')}</span>
            <span className="sm:hidden">Pokopia</span>
          </a>
          <div className="ml-auto flex items-center gap-2">
            <a href="../acnh/" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              {t('nav.acnh')}
            </a>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1">{body}</main>

      <footer className="border-t border-border py-4">
        <p className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground">
          {t('footer.disclaimer')}
        </p>
      </footer>
    </div>
  )
}
