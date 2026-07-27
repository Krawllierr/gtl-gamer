import { NavLink, Outlet } from 'react-router-dom'
import { useSessao } from '../hooks/useSessao'

const ABAS = [
  { para: '/', rotulo: 'Portfólio', icone: '◍' },
  { para: '/tarefas', rotulo: 'Tarefas', icone: '☑' },
  { para: '/checkin', rotulo: 'Check-in', icone: '＋' },
  { para: '/ciclo', rotulo: 'Ciclo', icone: '◷' },
  { para: '/constituicao', rotulo: 'Regras', icone: '§' },
]

export default function Layout() {
  const { perfil, sair } = useSessao()

  return (
    <div className="mx-auto min-h-screen max-w-3xl pb-24">
      <header className="sticky top-0 z-10 border-b border-borda bg-fundo/90 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <div className="text-sm font-semibold tracking-wide">GTL GAMES</div>
            <div className="text-xs text-suave">
              {perfil?.nome} · {perfil?.titulo}
            </div>
          </div>
          <button onClick={sair} className="text-xs text-suave hover:text-texto">
            Sair
          </button>
        </div>
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
