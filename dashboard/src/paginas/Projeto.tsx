import { useEffect, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSessao } from '../hooks/useSessao'
import { useDemo, MSG_DEMO_BLOQUEIO } from '../hooks/useDemo'
import {
  DEMO_FASES_LOG,
  DEMO_METRICAS,
  DEMO_SESSOES,
  DEMO_VEREDICTOS,
  demoProjeto,
  demoStatus,
} from '../demo/fixtures'
import type { FaseLog, Metrica, Projeto as TProjeto, ProjetoStatus, Sessao, Veredito } from '../lib/tipos'
import DicaDemo from '../componentes/DicaDemo'
import { Area, Botao, Campo, Cartao, Carregando, Erro, Etiqueta, Vazio } from '../componentes/ui'
import {
  FASES,
  GATE_AMOSTRA,
  GATE_CCU,
  GATE_D1,
  GATE_SESSAO,
  NOME_FASE,
  NOME_STATUS,
  TETO_DIAS,
  data,
  horas,
  hoje,
} from '../lib/formato'

type Aba = 'definicao' | 'fases' | 'log' | 'metricas' | 'veredito'

export default function Projeto() {
  const { id } = useParams<{ id: string }>()
  const { ativo: demo } = useDemo()
  const [aba, setAba] = useState<Aba>('definicao')
  const [proj, setProj] = useState<TProjeto | null>(null)
  const [status, setStatus] = useState<ProjetoStatus | null>(null)
  const [carregando, setCarregando] = useState(true)

  async function carregar() {
    if (!id) return
    if (demo) {
      setProj(demoProjeto(id))
      setStatus(demoStatus(id))
      setCarregando(false)
      return
    }
    const [p, s] = await Promise.all([
      supabase.from('projetos').select('*').eq('id', id).maybeSingle(),
      supabase.from('v_projetos_status').select('*').eq('id', id).maybeSingle(),
    ])
    setProj(p.data as TProjeto | null)
    setStatus(s.data as ProjetoStatus | null)
    setCarregando(false)
  }

  useEffect(() => {
    setCarregando(true)
    carregar()
  }, [id, demo])

  if (carregando) return <Carregando />
  if (!proj) return <Vazio>Projeto não encontrado.</Vazio>

  const abas: [Aba, string][] = [
    ['definicao', 'Definição'],
    ['fases', 'Fases'],
    ['log', 'Log'],
    ['metricas', 'Métricas'],
    ['veredito', 'Veredito'],
  ]

  return (
    <div className="space-y-4">
      <DicaDemo id="projeto" />

      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg">{status?.semaforo}</span>
          <h1 className="text-lg font-semibold">
            {proj.codigo} · {proj.nome}
          </h1>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-suave">
          <Etiqueta>{NOME_STATUS[status?.status ?? ''] ?? status?.status}</Etiqueta>
          <span>
            {NOME_FASE[proj.fase_atual]} · há {status?.dias_na_fase ?? 0} dias
          </span>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-borda pb-px">
        {abas.map(([k, r]) => (
          <button
            key={k}
            onClick={() => setAba(k)}
            className={`whitespace-nowrap px-3 py-2 text-sm ${
              aba === k ? 'border-b-2 border-acento text-texto' : 'text-suave'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {aba === 'definicao' && <Definicao p={proj} />}
      {aba === 'fases' && <Fases p={proj} recarregar={carregar} demo={demo} />}
      {aba === 'log' && <Log projetoId={proj.id} demo={demo} />}
      {aba === 'metricas' && <Metricas projetoId={proj.id} recarregar={carregar} demo={demo} />}
      {aba === 'veredito' && <VeredictoAba p={proj} demo={demo} />}
    </div>
  )
}

/* ---------------- DEFINIÇÃO ---------------- */

function Definicao({ p }: { p: TProjeto }) {
  const linhas: [string, string | null][] = [
    ['Gênero base', p.genero_base],
    ['Uma frase', p.uma_frase],
    ['A alteração única', p.alteracao_unica],
    ['Monetização', p.modelo_monetizacao],
    ['URL no Roblox', p.roblox_url],
    ['Início', data(p.data_inicio)],
    ['Lançamento', p.data_lancamento ? data(p.data_lancamento) : null],
    ['Fim da observação', p.data_fim_observacao ? data(p.data_fim_observacao) : null],
  ]
  return (
    <div className="space-y-3">
      <Cartao>
        <div className="mb-2 text-sm font-medium">Core loop</div>
        {p.core_loop?.length ? (
          <ol className="space-y-1 text-sm text-suave">
            {p.core_loop.map((s, i) => (
              <li key={i}>
                {i + 1}. {s}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-suave">Não definido.</p>
        )}
      </Cartao>
      <Cartao>
        <dl className="space-y-2 text-sm">
          {linhas.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <dt className="shrink-0 text-suave">{k}</dt>
              <dd className="text-right">{v || '—'}</dd>
            </div>
          ))}
        </dl>
      </Cartao>
    </div>
  )
}

/* ---------------- FASES ---------------- */

function Fases({ p, recarregar, demo }: { p: TProjeto; recarregar: () => void; demo: boolean }) {
  const { perfil } = useSessao()
  const [log, setLog] = useState<FaseLog[]>([])
  const [justificativa, setJustificativa] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  async function carregar() {
    if (demo) {
      setLog(DEMO_FASES_LOG[p.id] ?? [])
      return
    }
    const { data } = await supabase
      .from('fases_log')
      .select('*')
      .eq('projeto_id', p.id)
      .order('entrou_em', { ascending: false })
    setLog((data ?? []) as FaseLog[])
  }
  useEffect(() => {
    carregar()
  }, [p.id, demo])

  const idx = FASES.indexOf(p.fase_atual)
  const proxima = FASES[idx + 1]
  const atual = log.find((l) => !l.saiu_em)
  const diasNaFase = atual
    ? Math.floor((Date.now() - new Date(atual.entrou_em).getTime()) / 86400000)
    : 0
  const teto = TETO_DIAS[p.fase_atual]
  const estourou = teto !== undefined && diasNaFase > teto

  async function avancar() {
    if (!proxima) return
    if (demo) {
      setErro(MSG_DEMO_BLOQUEIO)
      return
    }
    setErro(null)
    if (estourou && justificativa.trim().length < 15) {
      setErro(
        `Teto da fase estourado (${diasNaFase} de ${teto} dias). Escreva uma justificativa de pelo menos 15 caracteres para avançar. §4.3`
      )
      return
    }
    await supabase
      .from('fases_log')
      .update({ saiu_em: hoje(), justificativa: justificativa.trim() || null })
      .eq('projeto_id', p.id)
      .is('saiu_em', null)

    await supabase.from('fases_log').insert({
      projeto_id: p.id,
      fase: proxima,
      movido_por: perfil?.id ?? null,
    })

    const campos: Record<string, unknown> = { fase_atual: proxima }
    if (proxima === 'f4_observacao' && !p.data_lancamento) campos.data_lancamento = hoje()
    await supabase.from('projetos').update(campos).eq('id', p.id)

    setJustificativa('')
    carregar()
    recarregar()
  }

  return (
    <div className="space-y-3">
      <Cartao className={estourou ? 'border-amber-500/40 bg-amber-500/5' : ''}>
        <div className="text-sm font-medium">{NOME_FASE[p.fase_atual]}</div>
        <div className="mt-1 text-xs text-suave">
          {diasNaFase} dias nesta fase{teto !== undefined && ` · teto de ${teto}`}
        </div>
        {estourou && (
          <p className="mt-2 text-xs text-amber-200">
            Teto estourado. O §6.1 diz: mata ou lança incompleto — nunca estende em silêncio.
          </p>
        )}

        {proxima ? (
          <div className="mt-4 space-y-2">
            {estourou && (
              <Area
                rotulo="Justificativa (obrigatória)"
                rows={2}
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                placeholder="Por que estamos avançando mesmo com o teto estourado"
                disabled={demo}
              />
            )}
            {erro && <Erro>{erro}</Erro>}
            <Botao onClick={avancar} disabled={demo} className="w-full">
              {demo ? 'Bloqueado no Demo' : `Avançar para ${NOME_FASE[proxima]}`}
            </Botao>
          </div>
        ) : (
          <p className="mt-3 text-xs text-suave">Última fase. Registre o veredito na aba correspondente.</p>
        )}
      </Cartao>

      <div className="space-y-2">
        {log.map((l) => (
          <Cartao key={l.id}>
            <div className="flex justify-between text-sm">
              <span>{NOME_FASE[l.fase]}</span>
              <span className="text-suave">
                {data(l.entrou_em)} {l.saiu_em ? `→ ${data(l.saiu_em)}` : '→ agora'}
              </span>
            </div>
            {l.justificativa && (
              <p className="mt-2 text-xs text-amber-200">Justificativa: {l.justificativa}</p>
            )}
          </Cartao>
        ))}
      </div>
    </div>
  )
}

/* ---------------- LOG ---------------- */

function Log({ projetoId, demo }: { projetoId: string; demo: boolean }) {
  const [sessoes, setSessoes] = useState<Sessao[]>([])
  useEffect(() => {
    if (demo) {
      setSessoes(DEMO_SESSOES.filter((s) => s.projeto_id === projetoId))
      return
    }
    supabase
      .from('sessoes')
      .select('*')
      .eq('projeto_id', projetoId)
      .order('data', { ascending: false })
      .then(({ data }) => setSessoes((data ?? []) as Sessao[]))
  }, [projetoId, demo])

  const total = sessoes.reduce((s, x) => s + x.duracao_min, 0)

  if (!sessoes.length) return <Vazio>Nenhuma sessão registrada neste projeto ainda.</Vazio>

  return (
    <div className="space-y-2">
      <div className="text-xs text-suave">
        {sessoes.length} sessões · {horas(total)} no total
      </div>
      {sessoes.map((s) => (
        <Cartao key={s.id}>
          <div className="flex justify-between text-xs text-suave">
            <span>{data(s.data)}</span>
            <span>{horas(s.duracao_min)}</span>
          </div>
          <div className="mt-1 text-sm">{s.entrega}</div>
          {s.bloqueios && <div className="mt-1 text-xs text-amber-200">Bloqueio: {s.bloqueios}</div>}
          {s.proxima_acao && <div className="mt-1 text-xs text-suave">Próxima: {s.proxima_acao}</div>}
        </Cartao>
      ))}
    </div>
  )
}

/* ---------------- MÉTRICAS ---------------- */

function Metricas({
  projetoId,
  recarregar,
  demo,
}: {
  projetoId: string
  recarregar: () => void
  demo: boolean
}) {
  const { perfil } = useSessao()
  const [lista, setLista] = useState<Metrica[]>([])
  const [form, setForm] = useState({
    data: hoje(),
    visitantes_unicos: '',
    d1_retention: '',
    sessao_media_min: '',
    ccu_pico: '',
    robux_dia: '',
    ctr: '',
  })
  const [erro, setErro] = useState<string | null>(null)

  async function carregar() {
    if (demo) {
      setLista(DEMO_METRICAS[projetoId] ?? [])
      return
    }
    const { data } = await supabase
      .from('metricas')
      .select('*')
      .eq('projeto_id', projetoId)
      .order('data', { ascending: false })
    setLista((data ?? []) as Metrica[])
  }
  useEffect(() => {
    carregar()
  }, [projetoId, demo])

  const num = (v: string) => (v.trim() === '' ? null : Number(v))

  async function salvar(e: FormEvent) {
    e.preventDefault()
    if (demo) {
      setErro(MSG_DEMO_BLOQUEIO)
      return
    }
    setErro(null)
    const { error } = await supabase.from('metricas').upsert(
      {
        projeto_id: projetoId,
        data: form.data,
        visitantes_unicos: num(form.visitantes_unicos),
        d1_retention: num(form.d1_retention),
        sessao_media_min: num(form.sessao_media_min),
        ccu_pico: num(form.ccu_pico),
        robux_dia: num(form.robux_dia),
        ctr: num(form.ctr),
        registrado_por: perfil?.id ?? null,
      },
      { onConflict: 'projeto_id,data' }
    )
    if (error) setErro(error.message)
    else {
      carregar()
      recarregar()
    }
  }

  return (
    <div className="space-y-3">
      <form onSubmit={salvar} className="space-y-3">
        <Cartao>
          <div className="mb-3 text-sm font-medium">Registrar snapshot</div>
          <p className="mb-3 text-xs text-suave">
            A cada 2 dias durante a janela de observação, semanal depois. Fonte: Creator Dashboard do Roblox.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Campo
              rotulo="Data"
              type="date"
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              disabled={demo}
            />
            <Campo
              rotulo={`Visitantes (gate ${GATE_AMOSTRA})`}
              type="number"
              inputMode="numeric"
              value={form.visitantes_unicos}
              onChange={(e) => setForm({ ...form, visitantes_unicos: e.target.value })}
              disabled={demo}
            />
            <Campo
              rotulo={`D1 % (gate ${GATE_D1})`}
              type="number"
              step="0.1"
              inputMode="decimal"
              value={form.d1_retention}
              onChange={(e) => setForm({ ...form, d1_retention: e.target.value })}
              disabled={demo}
            />
            <Campo
              rotulo={`Sessão min (gate ${GATE_SESSAO})`}
              type="number"
              step="0.1"
              inputMode="decimal"
              value={form.sessao_media_min}
              onChange={(e) => setForm({ ...form, sessao_media_min: e.target.value })}
              disabled={demo}
            />
            <Campo
              rotulo={`CCU pico (gate ${GATE_CCU})`}
              type="number"
              inputMode="numeric"
              value={form.ccu_pico}
              onChange={(e) => setForm({ ...form, ccu_pico: e.target.value })}
              disabled={demo}
            />
            <Campo
              rotulo="Robux no dia"
              type="number"
              inputMode="numeric"
              value={form.robux_dia}
              onChange={(e) => setForm({ ...form, robux_dia: e.target.value })}
              disabled={demo}
            />
          </div>
          {erro && (
            <div className="mt-2">
              <Erro>{erro}</Erro>
            </div>
          )}
          <Botao type="submit" disabled={demo} className="mt-3 w-full">
            {demo ? 'Bloqueado no Demo' : 'Salvar snapshot'}
          </Botao>
        </Cartao>
      </form>

      {lista.length === 0 ? (
        <Vazio>Nenhuma métrica registrada.</Vazio>
      ) : (
        <div className="space-y-2">
          {lista.map((m) => (
            <Cartao key={m.id}>
              <div className="text-xs text-suave">{data(m.data)}</div>
              <div className="mt-2 grid grid-cols-5 gap-1 text-center text-xs">
                <Cel r="Visit." v={m.visitantes_unicos} gate={GATE_AMOSTRA} />
                <Cel r="D1" v={m.d1_retention} gate={GATE_D1} sufixo="%" />
                <Cel r="Sessão" v={m.sessao_media_min} gate={GATE_SESSAO} />
                <Cel r="CCU" v={m.ccu_pico} gate={GATE_CCU} />
                <Cel r="Robux" v={m.robux_dia} />
              </div>
            </Cartao>
          ))}
        </div>
      )}
    </div>
  )
}

function Cel({ r, v, gate, sufixo = '' }: { r: string; v: number | null; gate?: number; sufixo?: string }) {
  const cor = gate === undefined || v === null ? '' : v >= gate ? 'text-emerald-300' : 'text-red-300'
  return (
    <div>
      <div className={`font-semibold ${cor}`}>
        {v ?? '—'}
        {v !== null ? sufixo : ''}
      </div>
      <div className="text-[10px] text-suave">{r}</div>
    </div>
  )
}

/* ---------------- VEREDITO ---------------- */

function VeredictoAba({ p, demo }: { p: TProjeto; demo: boolean }) {
  const [v, setV] = useState<Veredito | null>(null)
  const [visit, setVisit] = useState('')
  const [d1, setD1] = useState('')
  const [ses, setSes] = useState('')
  const [ccu, setCcu] = useState('')
  const [pm, setPm] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (demo) {
      setV(DEMO_VEREDICTOS[p.id] ?? null)
      return
    }
    supabase
      .from('veredictos')
      .select('*')
      .eq('projeto_id', p.id)
      .maybeSingle()
      .then(({ data }) => setV(data as Veredito | null))
  }, [p.id, demo])

  if (v) {
    const rot: Record<string, string> = {
      passou: 'Passou',
      marginal: 'Marginal',
      problema_descoberta: 'Problema de descoberta',
      falhou: 'Falhou',
    }
    return (
      <Cartao>
        <div className="flex items-center justify-between">
          <span className="font-medium">{rot[v.resultado]}</span>
          <Etiqueta>{data(v.data)}</Etiqueta>
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm text-suave">{v.post_mortem}</p>
      </Cartao>
    )
  }

  const nVisit = Number(visit || 0)
  const passouAmostra = nVisit >= GATE_AMOSTRA
  const gd1 = Number(d1 || 0) >= GATE_D1
  const gses = Number(ses || 0) >= GATE_SESSAO
  const gccu = Number(ccu || 0) >= GATE_CCU
  const falhas = [gd1, gses, gccu].filter((x) => !x).length

  const resultado = !passouAmostra
    ? 'problema_descoberta'
    : falhas >= 2
      ? 'falhou'
      : falhas === 1
        ? 'marginal'
        : 'passou'

  async function registrar(e: FormEvent) {
    e.preventDefault()
    if (demo) {
      setErro(MSG_DEMO_BLOQUEIO)
      return
    }
    setErro(null)
    const { error } = await supabase.from('veredictos').insert({
      projeto_id: p.id,
      visitantes_unicos_janela: nVisit,
      d1_observado: Number(d1 || 0),
      sessao_observada: Number(ses || 0),
      ccu_observado: Number(ccu || 0),
      gate_d1: gd1,
      gate_sessao: gses,
      gate_ccu: gccu,
      resultado,
      post_mortem: pm.trim(),
    })
    if (error)
      setErro(
        error.message.includes('post_mortem_obrigatorio')
          ? 'Post-mortem obrigatório, mínimo 30 caracteres. Sem ele o portfólio não gera aprendizado composto (§6, Fase 5).'
          : error.message
      )
    else location.reload()
  }

  return (
    <form onSubmit={registrar} className="space-y-3">
      <Cartao>
        <div className="mb-3 text-sm font-medium">Registrar veredito</div>
        <div className="grid grid-cols-2 gap-2">
          <Campo
            rotulo="Visitantes na janela"
            type="number"
            value={visit}
            onChange={(e) => setVisit(e.target.value)}
            required
            disabled={demo}
          />
          <Campo
            rotulo="D1 %"
            type="number"
            step="0.1"
            value={d1}
            onChange={(e) => setD1(e.target.value)}
            disabled={demo}
          />
          <Campo
            rotulo="Sessão média (min)"
            type="number"
            step="0.1"
            value={ses}
            onChange={(e) => setSes(e.target.value)}
            disabled={demo}
          />
          <Campo
            rotulo="CCU pico"
            type="number"
            value={ccu}
            onChange={(e) => setCcu(e.target.value)}
            disabled={demo}
          />
        </div>
      </Cartao>

      {/* O gate de amostra ANTES dos gates de qualidade — §6.1 */}
      <Cartao className={passouAmostra ? '' : 'border-amber-500/40 bg-amber-500/5'}>
        <div className="text-sm font-medium">
          {passouAmostra ? '✓ Amostra suficiente' : '⚠ Amostra insuficiente'}
        </div>
        <p className="mt-2 text-xs text-suave">
          {passouAmostra
            ? `${nVisit} visitantes ≥ ${GATE_AMOSTRA}. Os gates de qualidade valem. Falhas: ${falhas} de 3.`
            : `${nVisit} visitantes < ${GATE_AMOSTRA}. Isso NÃO é veredito sobre o jogo — é problema de descoberta. Não mata o projeto: ataca thumbnail, título, vídeo e tráfego.`}
        </p>
        <div className="mt-3">
          <Etiqueta className="border-acento/40 bg-acento/10 text-acento">
            Veredito automático: {resultado}
          </Etiqueta>
        </div>
      </Cartao>

      <Area
        rotulo="Post-mortem"
        dica="Obrigatório, mínimo 30 caracteres. O que aprendemos — inclusive quando dói."
        rows={5}
        value={pm}
        onChange={(e) => setPm(e.target.value)}
        required
        disabled={demo}
      />

      {erro && <Erro>{erro}</Erro>}

      <Botao type="submit" disabled={demo || pm.trim().length < 30} className="w-full">
        {demo ? 'Bloqueado no Demo' : 'Registrar veredito'}
      </Botao>
    </form>
  )
}
