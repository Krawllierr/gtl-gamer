import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useSessao } from '../hooks/useSessao'
import type { Ciclo, Projeto, Sessao } from '../lib/tipos'
import { Area, Botao, Campo, Cartao, Erro, Etiqueta } from '../componentes/ui'
import { data, horas, hoje } from '../lib/formato'

// Registro manual, não cronômetro.
// Cronômetro é elegante e falha na prática: ninguém lembra de dar check-out
// e você acumula sessões de 14 horas. 30 segundos de digitação é mais honesto.

export default function CheckIn() {
  const { perfil } = useSessao()
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [ciclo, setCiclo] = useState<Ciclo | null>(null)
  const [recentes, setRecentes] = useState<Sessao[]>([])

  const [projetoId, setProjetoId] = useState('')
  const [duracao, setDuracao] = useState('60')
  const [entrega, setEntrega] = useState('')
  const [bloqueios, setBloqueios] = useState('')
  const [proxima, setProxima] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState(false)
  const [ocupado, setOcupado] = useState(false)

  async function carregar() {
    if (!perfil) return
    const [p, c, s] = await Promise.all([
      supabase.from('projetos').select('*').eq('ativo', true).order('codigo'),
      supabase.from('ciclos').select('*').eq('status', 'ativo').maybeSingle(),
      supabase
        .from('sessoes')
        .select('*')
        .eq('perfil_id', perfil.id)
        .order('data', { ascending: false })
        .limit(5),
    ])
    setProjetos((p.data ?? []) as Projeto[])
    setCiclo(c.data as Ciclo | null)
    setRecentes((s.data ?? []) as Sessao[])
  }

  useEffect(() => {
    carregar()
  }, [perfil])

  async function registrar(e: FormEvent) {
    e.preventDefault()
    if (!perfil) return
    setOcupado(true)
    setErro(null)
    setOk(false)

    const { error } = await supabase.from('sessoes').insert({
      perfil_id: perfil.id,
      ciclo_id: ciclo?.id ?? null,
      projeto_id: projetoId || null,
      data: hoje(),
      duracao_min: Number(duracao),
      entrega: entrega.trim(),
      bloqueios: bloqueios.trim() || null,
      proxima_acao: proxima.trim() || null,
    })

    if (error) {
      setErro(
        error.message.includes('entrega_substantiva')
          ? 'O banco recusou: "trabalhei no jogo" não é entrega. Descreva o artefato (mínimo 10 caracteres). §4.3'
          : error.message
      )
    } else {
      setOk(true)
      setEntrega('')
      setBloqueios('')
      setProxima('')
      carregar()
    }
    setOcupado(false)
  }

  return (
    <div className="space-y-4">
      {ciclo && (
        <div className="flex items-center justify-between text-xs text-suave">
          <span>
            Ciclo {ciclo.numero} · {data(ciclo.inicio)} a {data(ciclo.fim)}
          </span>
          <Etiqueta>{ciclo.status}</Etiqueta>
        </div>
      )}

      <form onSubmit={registrar} className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm text-suave">Projeto</span>
          <select
            value={projetoId}
            onChange={(e) => setProjetoId(e.target.value)}
            className="w-full rounded-lg border border-borda bg-fundo px-3 py-2.5 outline-none focus:border-acento"
          >
            <option value="">Sem projeto (trabalho de estúdio)</option>
            {projetos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.codigo} · {p.nome}
              </option>
            ))}
          </select>
        </label>

        <Campo
          rotulo="Duração (minutos)"
          type="number"
          min={1}
          step={5}
          inputMode="numeric"
          value={duracao}
          onChange={(e) => setDuracao(e.target.value)}
          required
        />

        <Area
          rotulo="Entrega"
          dica="Artefato verificável. Ex: '3 thumbnails testadas' · 'sistema de save funcionando'. Não vale 'trabalhei no jogo'."
          rows={3}
          value={entrega}
          onChange={(e) => setEntrega(e.target.value)}
          required
        />

        <Area rotulo="Bloqueios (opcional)" rows={2} value={bloqueios} onChange={(e) => setBloqueios(e.target.value)} />
        <Campo rotulo="Próxima ação (opcional)" value={proxima} onChange={(e) => setProxima(e.target.value)} />

        {erro && <Erro>{erro}</Erro>}
        {ok && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-300">
            Registrado.
          </div>
        )}

        <Botao type="submit" disabled={ocupado || entrega.trim().length < 10} className="w-full">
          {ocupado ? 'Registrando…' : 'Registrar sessão'}
        </Botao>
      </form>

      {recentes.length > 0 && (
        <>
          <h2 className="pt-2 text-sm font-medium text-suave">Últimas sessões</h2>
          <div className="space-y-2">
            {recentes.map((s) => (
              <Cartao key={s.id}>
                <div className="flex justify-between text-xs text-suave">
                  <span>{data(s.data)}</span>
                  <span>{horas(s.duracao_min)}</span>
                </div>
                <div className="mt-1 text-sm">{s.entrega}</div>
              </Cartao>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
