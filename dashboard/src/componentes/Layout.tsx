import { NavLink, Outlet } from 'react-router-dom'
import { useSessao } from '../hooks/useSessao'
import { useDemo } from '../hooks/useDemo'

const ABAS = [
  { para: '/', rotulo: 'Portfólio', icone: '◍' },
  { para: '/tarefas', rotulo: 'Tarefas', icone: '☑' },
  { para: '/checkin', rotulo: 'Check-in', icone: '＋' },
  { para: '/ciclo', rotulo: 'Ciclo', icone: '◷' },
  { para: '/constituicao', rotulo: 'Regras', icone: '§' },
]

export default function Layout() {
  const { perfil, sair } = useSessao()
  const { ativo: demo, alternar } = useDemo()

  return (
    <div className="mx-auto min-h-screen max-w-3xl pb-24">
      <header className="sticky top-0 z-10 border-b border-borda bg-fundo/90 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <div className="text-sm font-semibold tracking-wide">GTL GAMER</div>
            <div className="text-xs text-suave">
              {perfil?.nome} · {perfil?.titulo}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={alternar}
              aria-pressed={demo}
              className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                demo
                  ? 'border-amber-500/50 bg-amber-500/15 text-amber-200'
                  : 'border-borda bg-white/5 text-suave hover:text-texto'
              }`}
            >
              Demo {demo ? 'ON' : 'OFF'}
            </button>
            <button onClick={sair} className="text-xs text-suave hover:text-texto">
              Sair
            </button>
          </div>
        </div>
        {demo && (
          <div className="border-t border-amber-500/30 bg-amber-500/15 px-4 py-2 text-center text-xs font-medium text-amber-100">
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
                `flex flex-1 flex-col items-center gap-0.5 py-3 text-xs ${
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
