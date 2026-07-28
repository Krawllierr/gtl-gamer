import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useDemo, MSG_DEMO_BLOQUEIO } from '../hooks/useDemo'
import { DEMO_PROJETOS } from '../demo/fixtures'
import DicaDemo from '../componentes/DicaDemo'
import { Area, Botao, Campo, Cartao, Erro } from '../componentes/ui'

export default function NovoProjeto() {
  const nav = useNavigate()
  const { ativo: demo } = useDemo()
  const [codigo, setCodigo] = useState('#0')
  const [nome, setNome] = useState('')
  const [genero, setGenero] = useState('')
  const [frase, setFrase] = useState('')
  const [loop, setLoop] = useState('')
  const [alteracao, setAlteracao] = useState('')
  const [monetizacao, setMonetizacao] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [ocupado, setOcupado] = useState(false)
  const [ativos, setAtivos] = useState(0)

  const passos = loop
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
  const loopEstourado = passos.length > 3

  useEffect(() => {
    ;(async () => {
      if (demo) {
        setAtivos(DEMO_PROJETOS.filter((p) => p.ativo).length)
        return
      }
      const { count } = await supabase
        .from('projetos')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true)
      setAtivos(count ?? 0)
    })()
  }, [demo])

  async function criar(e: FormEvent) {
    e.preventDefault()
    if (demo) {
      setErro(MSG_DEMO_BLOQUEIO)
      return
    }
    if (loopEstourado) {
      setErro('O core loop tem no máximo 3 passos (§6, Fase 1).')
      return
    }
    setOcupado(true)
    setErro(null)

    const { data, error } = await supabase
      .from('projetos')
      .insert({
        codigo: codigo.trim(),
        nome: nome.trim(),
        genero_base: genero.trim() || null,
        uma_frase: frase.trim() || null,
        core_loop: passos.length ? passos : null,
        alteracao_unica: alteracao.trim() || null,
        modelo_monetizacao: monetizacao.trim() || null,
      })
      .select()
      .single()

    if (error) {
      setErro(
        error.message.includes('core_loop_max_3')
          ? 'O banco recusou: o core loop tem no máximo 3 passos (§6, Fase 1). Se não cabe em 3, a ideia é complexa demais.'
          : error.message
      )
      setOcupado(false)
      return
    }

    await supabase.from('fases_log').insert({ projeto_id: data.id, fase: 'f0_research' })
    nav(`/projeto/${data.id}`)
  }

  return (
    <form onSubmit={criar} className="space-y-3">
      <DicaDemo id="novo-projeto" />
      <h2 className="text-sm font-medium text-suave">Novo projeto</h2>

      {ativos > 0 && (
        <Cartao className="border-amber-500/30 bg-amber-500/5">
          <p className="text-xs text-amber-200">
            Já existe {ativos === 1 ? '1 projeto ativo' : `${ativos} projetos ativos`}. §10.3: um projeto ativo por
            vez. Só avance se o atual estiver arquivado ou for o teste trivial.
          </p>
        </Cartao>
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Campo
          rotulo="Código"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          required
          disabled={demo}
        />
        <div className="sm:col-span-2">
          <Campo
            rotulo="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            disabled={demo}
          />
        </div>
      </div>

      <Campo
        rotulo="Gênero base"
        dica="Qual jogo em alta estamos clonando"
        value={genero}
        onChange={(e) => setGenero(e.target.value)}
        disabled={demo}
      />
      <Area
        rotulo="Uma frase"
        rows={2}
        value={frase}
        onChange={(e) => setFrase(e.target.value)}
        disabled={demo}
      />
      <Area
        rotulo="Core loop"
        dica={`Um passo por linha. Máximo 3 — o banco recusa mais. Atual: ${passos.length}`}
        rows={3}
        value={loop}
        onChange={(e) => setLoop(e.target.value)}
        disabled={demo}
      />
      {loopEstourado && (
        <p className="text-xs text-red-300">
          {passos.length} passos — acima do teto. Corte para ≤ 3 antes de criar.
        </p>
      )}
      <Area
        rotulo="A alteração única"
        dica="Só UMA mudança em relação ao clone base"
        rows={2}
        value={alteracao}
        onChange={(e) => setAlteracao(e.target.value)}
        disabled={demo}
      />
      <Area
        rotulo="Modelo de monetização"
        dica="Definido ANTES do código (§6, Fase 1)"
        rows={2}
        value={monetizacao}
        onChange={(e) => setMonetizacao(e.target.value)}
        disabled={demo}
      />

      {erro && <Erro>{erro}</Erro>}

      <Cartao className="border-amber-500/30 bg-amber-500/5">
        <p className="text-xs text-amber-200">
          Lembrete do §6, Fase 1: título, ícone e thumbnail devem ser rascunhados agora. Se não dá para fazer uma
          thumbnail atraente para essa ideia, a ideia está morta antes de nascer.
        </p>
      </Cartao>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Botao
          type="button"
          variante="secundario"
          onClick={() => nav('/')}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Botao>
        <Botao type="submit" disabled={ocupado || demo || loopEstourado} className="w-full flex-1">
          {demo ? 'Bloqueado no Demo' : 'Criar projeto'}
        </Botao>
      </div>
    </form>
  )
}
