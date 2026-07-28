import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSessao } from '../hooks/useSessao'
import { useDemo, MSG_DEMO_BLOQUEIO } from '../hooks/useDemo'
import { DEMO_CICLO_ATIVO, DEMO_ESFORCO, DEMO_PERFIS } from '../demo/fixtures'
import type { Ciclo, EsforcoRelativo, Perfil } from '../lib/tipos'
import DicaDemo from '../componentes/DicaDemo'
import { Botao, Campo, Cartao, Carregando, Erro, Etiqueta, Vazio } from '../componentes/ui'
import { data } from '../lib/formato'

export default function CicloAtual() {
  const { perfil } = useSessao()
  const { ativo: demo } = useDemo()
  const [ciclo, setCiclo] = useState<Ciclo | null>(null)
  const [esforco, setEsforco] = useState<EsforcoRelativo[]>([])
  const [perfis, setPerfis] = useState<Perfil[]>([])
  const [carregando, setCarregando] = useState(true)
  const [horasDecl, setHorasDecl] = useState('')
  const [erro, setErro] = useState<string | null>(null)

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
    await supabase
      .from('capacidade_declarada')
      .upsert(
        { ciclo_id: ciclo.id, perfil_id: perfil.id, horas_declaradas: Number(horasDecl) },
        { onConflict: 'ciclo_id,perfil_id' }
      )
    setHorasDecl('')
    carregar()
  }

  if (carregando) return <Carregando />
  if (!ciclo) return <Vazio>Nenhum ciclo ativo.</Vazio>

  const meuPerfil =
    perfis.find((p) => p.id === perfil?.id) ??
    (demo ? DEMO_PERFIS.find((p) => p.nome === perfil?.nome) : undefined)

  return (
    <div className="space-y-4">
      <DicaDemo id="ciclo" />

      <Cartao>
        <div className="flex items-center justify-between">
          <span className="font-medium">Ciclo {ciclo.numero}</span>
          <Etiqueta>
            {data(ciclo.inicio)} → {data(ciclo.fim)}
          </Etiqueta>
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
        <div className="mt-3 flex items-end gap-2">
          <div className="flex-1">
            <Campo
              rotulo="Horas disponíveis"
              type="number"
              min={1}
              step={1}
              inputMode="numeric"
              value={horasDecl}
              onChange={(e) => setHorasDecl(e.target.value)}
              disabled={demo}
            />
          </div>
          <Botao disabled={!horasDecl || demo} onClick={declarar}>
            Declarar
          </Botao>
        </div>
        {erro && (
          <div className="mt-2">
            <Erro>{erro}</Erro>
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
