import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSessao } from '../hooks/useSessao'
import { useDemo, MSG_DEMO_BLOQUEIO } from '../hooks/useDemo'
import { DEMO_CICLO_ATIVO, DEMO_ESFORCO, DEMO_PERFIS } from '../demo/fixtures'
import type { Ciclo, EsforcoRelativo, Perfil } from '../lib/tipos'
import DicaDemo from '../componentes/DicaDemo'
import { Botao, Campo, Cartao, Carregando, Erro, Etiqueta, Sucesso, Vazio } from '../componentes/ui'
import { data, hoje } from '../lib/formato'

function diasRestantes(fim: string) {
  const hojeMs = new Date(hoje() + 'T12:00:00').getTime()
  const fimMs = new Date(fim.slice(0, 10) + 'T12:00:00').getTime()
  return Math.ceil((fimMs - hojeMs) / 86400000)
}

export default function CicloAtual() {
  const { perfil } = useSessao()
  const { ativo: demo } = useDemo()
  const [ciclo, setCiclo] = useState<Ciclo | null>(null)
  const [esforco, setEsforco] = useState<EsforcoRelativo[]>([])
  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [carregando, setCarregando] = useState(true)
  const [horasDecl, setHorasDecl] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [ok, setOk] = useState(false)

  async function carregar() {
    if (demo) {
      setCiclo(DEMO_CICLO_ATIVO)
      setEsforco(DEMO_ESFORCO)
      setPerfis(DEMO_PERFIS)
      setCarregando(false)
      return
    }
    const { data: c } = await supabase.from('ciclos').select('*').eq('status', 'ativo').maybeSingle()
    setCiclo(c as Ciclo | null)
    if (c) {
      const [e, p] = await Promise.all([
        supabase.from('v_esforco_relativo').select('*').eq('ciclo', (c as Ciclo).numero),
        supabase.from('perfis').select('*').eq('ativo', true),
      ])
      setEsforco((e.data ?? []) as EsforcoRelativo[])
      setPerfis((p.data ?? []) as Perfil[])
    } else {
      setEsforco([])
      setPerfis([])
    }
    setCarregando(false)
  }

  useEffect(() => {
    setCarregando(true)
    carregar()
  }, [demo])

  async function declarar() {
    if (demo) {
      setErro(MSG_DEMO_BLOQUEIO)
      return
    }
    if (!ciclo || !perfil) return
    setErro(null)
    setOk(false)
    const { error } = await supabase
      .from('capacidade_declarada')
      .upsert(
        { ciclo_id: ciclo.id, perfil_id: perfil.id, horas_declaradas: Number(horasDecl) },
        { onConflict: 'ciclo_id,perfil_id' }
      )
    if (error) setErro(error.message)
    else {
      setOk(true)
      setHorasDecl('')
      carregar()
    }
  }

  if (carregando) return <Carregando />
  if (!ciclo) {
    return (
      <Vazio>
        <p>Nenhum ciclo ativo.</p>
        <p className="mt-2 text-xs">
          Peça ao Gabriel para abrir o próximo ciclo no Supabase (tabela <code>ciclos</code>, status{' '}
          <code>ativo</code>).
        </p>
        <div className="mt-3">
          <Link to="/tarefas" className="text-xs text-acento hover:underline">
            Ir para tarefas →
          </Link>
        </div>
      </Vazio>
    )
  }

  const meuPerfil =
    perfis.find((p) => p.id === perfil?.id) ??
    (demo ? DEMO_PERFIS.find((p) => p.nome === perfil?.nome) : undefined)

  const meuEsforco =
    esforco.find((e) => e.nome === perfil?.nome) ??
    (demo ? esforco.find((e) => e.nome === perfil?.nome) : undefined)
  const jaDeclarado = meuEsforco?.horas_declaradas != null
  const restam = diasRestantes(ciclo.fim)

  return (
    <div className="space-y-4">
      <DicaDemo id="ciclo" />

      <Cartao>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium">Ciclo {ciclo.numero}</span>
          <div className="flex flex-wrap items-center gap-2">
            <Etiqueta>
              {data(ciclo.inicio)} → {data(ciclo.fim)}
            </Etiqueta>
            <Etiqueta
              className={
                restam < 0
                  ? 'border-red-500/40 bg-red-500/10 text-red-300'
                  : restam <= 2
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
                    : undefined
              }
            >
              {restam < 0
                ? `encerrou há ${Math.abs(restam)}d`
                : restam === 0
                  ? 'encerra hoje'
                  : `${restam}d restantes`}
            </Etiqueta>
          </div>
        </div>
        <p className="mt-2 text-sm text-suave">{ciclo.objetivo}</p>
      </Cartao>

      {/* Declaração de capacidade — base do índice de esforço (§3.4) */}
      <Cartao>
        <div className="text-sm font-medium">Sua capacidade nesta semana</div>
        <p className="mt-1 text-xs text-suave">
          Declare ANTES de trabalhar. É isso que torna a comparação justa: o índice usa realizado ÷ declarado, nunca
          horas absolutas. Declarar baixo não isenta da cota mínima.
        </p>
        {jaDeclarado && (
          <p className="mt-2 text-sm text-acento">
            Declarado: {meuEsforco?.horas_declaradas}h
            {meuEsforco?.pct_realizado != null && ` · ${meuEsforco.pct_realizado}% realizado`}
          </p>
        )}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Campo
              rotulo={jaDeclarado ? 'Atualizar horas' : 'Horas disponíveis'}
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={horasDecl}
              onChange={(e) => setHorasDecl(e.target.value)}
              disabled={demo}
            />
          </div>
          <Botao disabled={!horasDecl || demo} onClick={declarar} className="w-full sm:w-auto">
            {jaDeclarado ? 'Atualizar' : 'Declarar'}
          </Botao>
        </div>
        {erro && (
          <div className="mt-2">
            <Erro>{erro}</Erro>
          </div>
        )}
        {ok && (
          <div className="mt-2">
            <Sucesso>Capacidade registrada.</Sucesso>
          </div>
        )}
      </Cartao>

      <h2 className="pt-2 text-sm font-medium text-suave">Índice de esforço relativo</h2>
      <div className="space-y-2">
        {esforco.map((e) => (
          <Cartao key={e.nome}>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="font-medium">{e.nome}</div>
                <div className="text-xs text-suave">{e.titulo}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold">{e.pct_realizado ?? '—'}%</div>
                <div className="text-[11px] text-suave">
                  {e.horas_realizadas}h de {e.horas_declaradas ?? '—'}h
                </div>
              </div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-acento"
                style={{ width: `${Math.min(100, e.pct_realizado ?? 0)}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-suave">
              {e.tarefas_concluidas}/{e.tarefas_atribuidas} tarefas · {e.sessoes} sessões
            </div>
          </Cartao>
        ))}
      </div>

      {meuPerfil && (
        <Cartao>
          <div className="text-sm font-medium">Sua cota mínima do ciclo</div>
          <ul className="mt-2 space-y-1 text-sm text-suave">
            {meuPerfil.cota_ciclo.map((c) => (
              <li key={c}>· {c}</li>
            ))}
          </ul>
          <div className="mt-3 border-t border-borda pt-3 text-sm font-medium">Você decide sozinho sobre</div>
          <ul className="mt-2 space-y-1 text-sm text-suave">
            {meuPerfil.dominios.map((d) => (
              <li key={d}>· {d}</li>
            ))}
          </ul>
        </Cartao>
      )}

      {ciclo.contestacoes && (
        <Cartao>
          <div className="text-sm font-medium">Registros do ciclo</div>
          <p className="mt-2 whitespace-pre-wrap text-xs text-suave">{ciclo.contestacoes}</p>
        </Cartao>
      )}
    </div>
  )
}
