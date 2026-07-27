import { Navigate, Route, Routes } from 'react-router-dom'
import { useSessao } from './hooks/useSessao'
import Layout from './componentes/Layout'
import Login from './paginas/Login'
import Portfolio from './paginas/Portfolio'
import Projeto from './paginas/Projeto'
import NovoProjeto from './paginas/NovoProjeto'
import MinhasTarefas from './paginas/MinhasTarefas'
import CheckIn from './paginas/CheckIn'
import CicloAtual from './paginas/CicloAtual'
import Constituicao from './paginas/Constituicao'
import { Botao, Carregando, Erro } from './componentes/ui'

export default function App() {
  const { sessao, perfil, carregando, erroPerfil, sair } = useSessao()

  if (carregando) return <Carregando />
  if (!sessao) return <Login />

  // Logado, mas sem perfil de sócio vinculado: o RLS bloqueia tudo (função eh_socio).
  if (!perfil) {
    return (
      <div className="mx-auto max-w-md space-y-4 p-6">
        <Erro>{erroPerfil ?? 'Perfil não encontrado.'}</Erro>
        <Botao variante="secundario" onClick={sair} className="w-full">
          Sair
        </Botao>
      </div>
    )
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Portfolio />} />
        <Route path="projeto/novo" element={<NovoProjeto />} />
        <Route path="projeto/:id" element={<Projeto />} />
        <Route path="tarefas" element={<MinhasTarefas />} />
        <Route path="checkin" element={<CheckIn />} />
        <Route path="ciclo" element={<CicloAtual />} />
        <Route path="constituicao" element={<Constituicao />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
