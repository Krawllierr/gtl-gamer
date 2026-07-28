import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useSessao } from '../hooks/useSessao'
import { useDemo } from '../hooks/useDemo'

const ABAS = [
  { para: '/', rotulo: 'Portfólio', icone: '◍' },
  { para: '/tarefas', rotulo: 'Tarefas', icone: '☑' },
  { para: '/checkin', rotulo: 'Check-in', icone: '＋' },
  { para: '/ciclo', rotulo: 'Ciclo', icone: '◷' },
  { para: '/constituicao', rotulo: 'Regras', icone: '§' },
]

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acento/50'

function tituloRota(pathname: string) {
  if (pathname === '/projeto/novo') return 'Novo projeto'
  if (pathname.startsWith('/projeto/')) return 'Projeto'
  return null
}

export default function Layout() {
  const { perfil, sair } = useSessao()
  const { ativo: demo, alternar } = useDemo()
  const loc = useLocation()
  const nav = useNavigate()
  const subtitulo = tituloRota(loc.pathname)
  const emProjeto = loc.pathname.startsWith('/projeto/')

  return (
    <div className="mx-auto min-h-screen max-w-3xl pb-24">
      <header className="sticky top-0 z-10 border-b border-borda bg-fundo/90 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {emProjeto && (
              <button
                type="button"
                onClick={() => nav('/')}
                aria-label="Voltar ao portfólio"
                className={`flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md border border-borda bg-white/5 text-suave hover:text-texto ${FOCUS}`}
              >
                ←
              </button>
            )}
            <div className="min-w-0">
              <div className="text-sm font-semibold tracking-wide">GTL GAMER</div>
              <div className="truncate text-xs text-suave">
                {subtitulo ?? `${perfil?.nome} · ${perfil?.titulo}`}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={alternar}
              aria-pressed={demo}
              className={`min-h-[44px] min-w-[44px] rounded-md border px-2.5 text-xs font-medium transition ${FOCUS} ${
                demo
                  ? 'border-amber-500/50 bg-amber-500/15 text-amber-200'
                  : 'border-borda bg-white/5 text-suave hover:text-texto'
              }`}
            >
              Demo {demo ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={sair}
              className={`min-h-[44px] px-2 text-xs text-suave hover:text-texto ${FOCUS}`}
            >
              Sair
            </button>
          </div>
        </div>
        {demo && (
          <div className="border-t border-amber-500/30 bg-amber-500/15 px-3 py-2 text-center text-[11px] font-medium leading-snug text-amber-100">
            DEMO — dados fictícios. Nada aqui é Robux real.
          </div>
        )}
      </header>

      <main className="px-4 py-4">
        <Outlet />
      </main>

      {/* Navegação inferior — o Gustavo vai usar isso no celular */}
      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-borda bg-painel/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl">
          {ABAS.map((a) => (
            <NavLink
              key={a.para}
              to={a.para}
              end={a.para === '/'}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-0.5 py-3 text-[10px] leading-tight sm:text-xs ${FOCUS} ${
                  isActive ? 'text-acento' : 'text-suave'
                }`
              }
            >
              <span className="text-base leading-none">{a.icone}</span>
              {a.rotulo}
            </NavLink>
          ))}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  )
}
