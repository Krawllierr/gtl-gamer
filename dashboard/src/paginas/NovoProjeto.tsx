import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Area, Botao, Campo, Cartao, Erro } from '../componentes/ui'

export default function NovoProjeto() {
  const nav = useNavigate()
  const [codigo, setCodigo] = useState('#0')
  const [nome, setNome] = useState('')
  const [genero, setGenero] = useState('')
  const [frase, setFrase] = useState('')
  const [loop, setLoop] = useState('')
  const [alteracao, setAlteracao] = useState('')
  const [monetizacao, setMonetizacao] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [ocupado, setOcupado] = useState(false)

  const passos = loop
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

  async function criar(e: FormEvent) {
    e.preventDefault()
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

    // Abre o histórico de fases na Fase 0
    await supabase.from('fases_log').insert({ projeto_id: data.id, fase: 'f0_research' })
    nav(`/projeto/${data.id}`)
  }

  return (
    <form onSubmit={criar} className="space-y-3">
      <h2 className="text-sm font-medium text-suave">Novo projeto</h2>

      <div className="grid grid-cols-3 gap-2">
        <Campo rotulo="Código" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
        <div className="col-span-2">
          <Campo rotulo="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
      </div>

      <Campo
        rotulo="Gênero base"
        dica="Qual jogo em alta estamos clonando"
        value={genero}
        onChange={(e) => setGenero(e.target.value)}
      />
      <Area rotulo="Uma frase" rows={2} value={frase} onChange={(e) => setFrase(e.target.value)} />
      <Area
        rotulo="Core loop"
        dica={`Um passo por linha. Máximo 3 — o banco recusa mais. Atual: ${passos.length}`}
        rows={3}
        value={loop}
        onChange={(e) => setLoop(e.target.value)}
      />
      <Area
        rotulo="A alteração única"
        dica="Só UMA mudança em relação ao clone base"
        rows={2}
        value={alteracao}
        onChange={(e) => setAlteracao(e.target.value)}
      />
      <Area
        rotulo="Modelo de monetização"
        dica="Definido ANTES do código (§6, Fase 1)"
        rows={2}
        value={monetizacao}
        onChange={(e) => setMonetizacao(e.target.value)}
      />

      {erro && <Erro>{erro}</Erro>}

      <Cartao className="border-amber-500/30 bg-amber-500/5">
        <p className="text-xs text-amber-200">
          Lembrete do §6, Fase 1: título, ícone e thumbnail devem ser rascunhados agora. Se não dá para fazer uma
          thumbnail atraente para essa ideia, a ideia está morta antes de nascer.
        </p>
      </Cartao>

      <Botao type="submit" disabled={ocupado} className="w-full">
        Criar projeto
      </Botao>
    </form>
  )
}
