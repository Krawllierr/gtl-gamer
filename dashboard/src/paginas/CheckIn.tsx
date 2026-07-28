import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useSessao } from '../hooks/useSessao'
import { useDemo, MSG_DEMO_BLOQUEIO } from '../hooks/useDemo'
import { DEMO_CICLO_ATIVO, DEMO_PROJETOS, DEMO_SESSOES } from '../demo/fixtures'
import type { Ciclo, Projeto, Sessao } from '../lib/tipos'
import DicaDemo from '../componentes/DicaDemo'
import { Area, Botao, Campo, Cartao, Erro, Etiqueta, Sucesso } from '../componentes/ui'
import { data, horas, hoje } from '../lib/formato'

const CHIPS = [30, 60, 90, 120]

// Registro manual, não cronômetro.
// Cronômetro é elegante e falha na prática: ninguém lembra de dar check-out
// e você acumula sessões de 14 horas. 30 segundos de digitação é mais honesto.

export default function CheckIn() {
  const { perfil } = useSessao()
  const { ativo: demo } = useDemo()
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
    if (demo) {
      setProjetos(DEMO_PROJETOS.filter((p) => p.ativo))
      setCiclo(DEMO_CICLO_ATIVO)
      setRecentes(DEMO_SESSOES)
      return
    }
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
  }, [perfil, demo])

  async function registrar(e: FormEvent) {
    e.preventDefault()
    if (!perfil) return
    if (demo) {
      setErro(MSG_DEMO_BLOQUEIO)
      setOk(false)
      return
    }
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
      <DicaDemo id="checkin" />

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
            disabled={demo}
            className="w-full rounded-lg border border-borda bg-fundo px-3 py-2.5 outline-none focus:border-acento focus-visible:ring-2 focus-visible:ring-acento/50 disabled:opacity-50"
          >
            <option value="">Sem projeto (trabalho de estúdio)</option>
            {projetos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.codigo} · {p.nome}
              </option>
            ))}
          </select>
        </label>

        <div>
          <Campo
            rotulo="Duração (minutos)"
            type="number"
            min={1}
            // step=1: qualquer minutagem é válida. Com step=5 o navegador recusava
            // 30/60/90/120 — os próprios chips abaixo geravam valor inválido.
            step={1}
            inputMode="numeric"
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
            required
            disabled={demo}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {CHIPS.map((m) => (
              <button
                key={m}
                type="button"
                disabled={demo}
                onClick={() => setDuracao(String(m))}
                className={`min-h-[36px] rounded-md border px-3 text-xs transition disabled:opacity-40 ${
                  duracao === String(m)
                    ? 'border-acento/50 bg-acento/15 text-acento'
                    : 'border-borda bg-white/5 text-suave hover:text-texto'
                }`}
              >
                {m} min
              </button>
            ))}
          </div>
        </div>

        <Area
          rotulo="Entrega"
          dica="Artefato verificável. Ex: '3 thumbnails testadas' · 'sistema de save funcionando'. Não vale 'trabalhei no jogo'."
          rows={3}
          value={entrega}
          onChange={(e) => setEntrega(e.target.value)}
          required
          disabled={demo}
        />

        <Area
          rotulo="Bloqueios (opcional)"
          rows={2}
          value={bloqueios}
          onChange={(e) => setBloqueios(e.target.value)}
          disabled={demo}
        />
        <Campo
          rotulo="Próxima ação (opcional)"
          value={proxima}
          onChange={(e) => setProxima(e.target.value)}
          disabled={demo}
        />

        {erro && <Erro>{erro}</Erro>}
        {ok && <Sucesso>Registrado.</Sucesso>}

        <Botao type="submit" disabled={demo || ocupado || entrega.trim().length < 10} className="w-full">
          {demo ? 'Bloqueado no Demo' : ocupado ? 'Registrando…' : 'Registrar sessão'}
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
