import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useDemo } from '../hooks/useDemo'
import { DEMO_PORTFOLIO, DEMO_STATUS } from '../demo/fixtures'
import type { Portfolio as TPortfolio, ProjetoStatus } from '../lib/tipos'
import DicaDemo from '../componentes/DicaDemo'
import { Cartao, Carregando, Etiqueta, Vazio } from '../componentes/ui'
import { NOME_FASE, NOME_STATUS, ROBUX_M0, data, usd } from '../lib/formato'

export default function Portfolio() {
  const nav = useNavigate()
  const { ativo: demo } = useDemo()
  const [resumo, setResumo] = useState<TPortfolio | null>(null)
  const [projetos, setProjetos] = useState<ProjetoStatus[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    ;(async () => {
      if (demo) {
        setResumo(DEMO_PORTFOLIO)
        setProjetos(DEMO_STATUS)
        setCarregando(false)
        return
      }
      const [r, p] = await Promise.all([
        supabase.from('v_portfolio').select('*').maybeSingle(),
        supabase.from('v_projetos_status').select('*').order('codigo'),
      ])
      setResumo(r.data as TPortfolio | null)
      setProjetos((p.data ?? []) as ProjetoStatus[])
      setCarregando(false)
    })()
  }, [demo])

  if (carregando) return <Carregando />

  const pctM0 = resumo ? Math.min(100, (resumo.robux_acumulado / ROBUX_M0) * 100) : 0
  const alertas = projetos.filter((p) => p.estourou_build || p.parado_demais || p.observacao_encerrada)

  return (
    <div className="space-y-4">
      <DicaDemo id="portfolio" />

      {/* Progresso até o primeiro saque — Constituição §2.3 */}
      <Cartao>
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-suave">M0 · Primeiro saque</span>
          <span className="text-sm font-semibold">
            {(resumo?.robux_acumulado ?? 0).toLocaleString('en-US')} / {ROBUX_M0.toLocaleString('en-US')} Robux
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-acento transition-all" style={{ width: `${pctM0}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-suave">
          <span>≈ {usd(resumo?.robux_acumulado ?? 0)} em DevEx</span>
          <span>faltam {(resumo?.robux_faltando_m0 ?? ROBUX_M0).toLocaleString('en-US')}</span>
        </div>
      </Cartao>

      {/* Alertas automáticos — a Constituição empurrando as regras (§4.3) */}
      {alertas.length > 0 && (
        <div className="space-y-2">
          {alertas.map((p) => (
            <div
              key={p.id}
              onClick={() => nav(`/projeto/${p.id}`)}
              className="cursor-pointer rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200"
            >
              <strong>{p.codigo}</strong>{' '}
              {p.estourou_build
                ? `estourou o teto de 3 semanas de build (${p.dias_na_fase} dias). §6.1 diz: mata ou lança incompleto.`
                : p.observacao_encerrada
                  ? 'encerrou a janela de 14 dias. Hora do veredito (Fase 5).'
                  : `está parado há ${p.dias_parado} dias.`}
            </div>
          ))}
        </div>
      )}

      {/* Contadores */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          ['Em projeto', resumo?.em_projeto ?? 0],
          ['Em build', resumo?.em_build ?? 0],
          ['Lucrando', resumo?.lucrando ?? 0],
          ['Observação', resumo?.em_observacao ?? 0],
          ['Flopando', resumo?.flopando ?? 0],
          ['Arquivados', resumo?.arquivados ?? 0],
        ].map(([rotulo, n]) => (
          <div key={rotulo as string} className="rounded-lg border border-borda bg-painel p-2">
            <div className="text-lg font-semibold">{n as number}</div>
            <div className="text-[11px] text-suave">{rotulo as string}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <h2 className="text-sm font-medium text-suave">Projetos</h2>
        <button onClick={() => nav('/projeto/novo')} className="text-xs text-acento">
          + novo projeto
        </button>
      </div>

      {projetos.length === 0 ? (
        <Vazio>
          Nenhum projeto ainda. O #01 nasce quando o Gustavo terminar a Fase 0 e vocês fecharem a Fase 1.
        </Vazio>
      ) : (
        <div className="space-y-2">
          {projetos.map((p) => (
            <Cartao key={p.id} onClick={() => nav(`/projeto/${p.id}`)}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{p.semaforo}</span>
                    <span className="truncate font-medium">
                      {p.codigo} · {p.nome}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-suave">
                    {NOME_FASE[p.fase_atual]} · há {p.dias_na_fase ?? 0} dias
                  </div>
                </div>
                <Etiqueta>{NOME_STATUS[p.status] ?? p.status}</Etiqueta>
              </div>

              {p.data_lancamento && (
                <div className="mt-3 grid grid-cols-4 gap-2 border-t border-borda pt-3 text-center text-xs">
                  <Metrica rotulo="Visit." valor={p.visitantes_unicos} />
                  <Metrica rotulo="D1" valor={p.d1_retention} sufixo="%" />
                  <Metrica rotulo="Sessão" valor={p.sessao_media_min} sufixo="min" />
                  <Metrica rotulo="CCU" valor={p.ccu_pico} />
                </div>
              )}

              {p.data_lancamento && (
                <div className="mt-2 text-[11px] text-suave">
                  Lançado {data(p.data_lancamento)} · janela até {data(p.data_fim_observacao)}
                </div>
              )}
            </Cartao>
          ))}
        </div>
      )}
    </div>
  )
}

function Metrica({ rotulo, valor, sufixo = '' }: { rotulo: string; valor: number | null; sufixo?: string }) {
  return (
    <div>
      <div className="font-semibold">
        {valor ?? '—'}
        {valor !== null ? sufixo : ''}
      </div>
      <div className="text-[10px] text-suave">{rotulo}</div>
    </div>
  )
}
