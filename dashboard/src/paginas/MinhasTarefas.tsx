import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSessao } from '../hooks/useSessao'
import { useDemo, MSG_DEMO_BLOQUEIO } from '../hooks/useDemo'
import { DEMO_PROJETOS, DEMO_TAREFAS, demoPerfilIdPorNome } from '../demo/fixtures'
import type { Prioridade, StatusTarefa, Tarefa } from '../lib/tipos'
import DicaDemo from '../componentes/DicaDemo'
import { Area, Botao, Cartao, Carregando, Erro, Etiqueta, LinkAcao, Sucesso, Vazio } from '../componentes/ui'
import { COR_PRIORIDADE, NOME_TAREFA, data, hoje } from '../lib/formato'

const ORDEM_PRIO: Record<Prioridade, number> = { alta: 0, media: 1, baixa: 2 }

function ordenarAbertas(lista: Tarefa[]) {
  return [...lista].sort((a, b) => {
    const aAtr = a.prazo && a.prazo < hoje() ? 0 : 1
    const bAtr = b.prazo && b.prazo < hoje() ? 0 : 1
    if (aAtr !== bAtr) return aAtr - bAtr
    if (ORDEM_PRIO[a.prioridade] !== ORDEM_PRIO[b.prioridade])
      return ORDEM_PRIO[a.prioridade] - ORDEM_PRIO[b.prioridade]
    const pa = a.prazo ?? '9999'
    const pb = b.prazo ?? '9999'
    return pa.localeCompare(pb)
  })
}

export default function MinhasTarefas() {
  const { perfil } = useSessao()
  const { ativo: demo } = useDemo()
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [mapaProjeto, setMapaProjeto] = useState<Record<string, string>>({})
  const [carregando, setCarregando] = useState(true)
  const [aberta, setAberta] = useState<string | null>(null)
  const [todas, setTodas] = useState(false)
  const [msgOk, setMsgOk] = useState<string | null>(null)

  async function carregar() {
    if (!perfil) return
    if (demo) {
      const meuId = demoPerfilIdPorNome(perfil.nome)
      let lista = DEMO_TAREFAS
      if (!todas) lista = lista.filter((t) => t.responsavel_id === meuId)
      setTarefas(lista)
      const mapa: Record<string, string> = {}
      for (const p of DEMO_PROJETOS) mapa[p.id] = `${p.codigo} · ${p.nome}`
      setMapaProjeto(mapa)
      setCarregando(false)
      return
    }
    let q = supabase.from('tarefas').select('*').order('prazo', { nullsFirst: false })
    if (!todas) q = q.eq('responsavel_id', perfil.id)
    const { data } = await q
    setTarefas((data ?? []) as Tarefa[])
    const ids = [...new Set(((data ?? []) as Tarefa[]).map((t) => t.projeto_id).filter(Boolean))] as string[]
    if (ids.length) {
      const { data: projs } = await supabase.from('projetos').select('id, codigo, nome').in('id', ids)
      const mapa: Record<string, string> = {}
      for (const p of projs ?? []) mapa[p.id] = `${p.codigo} · ${p.nome}`
      setMapaProjeto(mapa)
    } else setMapaProjeto({})
    setCarregando(false)
  }

  useEffect(() => {
    setCarregando(true)
    carregar()
  }, [perfil, todas, demo])

  if (carregando) return <Carregando />

  const abertas = ordenarAbertas(
    tarefas.filter((t) => t.status !== 'concluida' && t.status !== 'cancelada')
  )
  const feitas = tarefas.filter((t) => t.status === 'concluida')

  return (
    <div className="space-y-4">
      <DicaDemo id="tarefas" />

      {msgOk && <Sucesso>{msgOk}</Sucesso>}

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-suave">
          {todas ? 'Todas as tarefas' : 'Minhas tarefas'} · {abertas.length} abertas
        </h2>
        <LinkAcao onClick={() => setTodas(!todas)}>
          {todas ? 'ver só as minhas' : 'ver todas'}
        </LinkAcao>
      </div>

      {abertas.length === 0 ? (
        <Vazio>Nenhuma tarefa aberta. Se isso for verdade, o ciclo está fechado.</Vazio>
      ) : (
        <div className="space-y-2">
          {abertas.map((t) => (
            <CartaoTarefa
              key={t.id}
              t={t}
              aberta={aberta === t.id}
              abrir={() => setAberta(aberta === t.id ? null : t.id)}
              recarregar={carregar}
              demo={demo}
              rotuloProjeto={t.projeto_id ? mapaProjeto[t.projeto_id] : undefined}
              onSucesso={(msg) => {
                setMsgOk(msg)
                setTimeout(() => setMsgOk(null), 3000)
              }}
            />
          ))}
        </div>
      )}

      {feitas.length > 0 && (
        <>
          <h2 className="pt-4 text-sm font-medium text-suave">Concluídas · {feitas.length}</h2>
          <div className="space-y-2 opacity-60">
            {feitas.map((t) => (
              <Cartao key={t.id}>
                <div className="text-sm line-through">{t.titulo}</div>
                {t.resultado && <div className="mt-1 text-xs text-suave">{t.resultado}</div>}
              </Cartao>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function CartaoTarefa({
  t,
  aberta,
  abrir,
  recarregar,
  demo,
  rotuloProjeto,
  onSucesso,
}: {
  t: Tarefa
  aberta: boolean
  abrir: () => void
  recarregar: () => void
  demo: boolean
  rotuloProjeto?: string
  onSucesso: (msg: string) => void
}) {
  const [resultado, setResultado] = useState(t.resultado ?? '')
  const [notas, setNotas] = useState(t.notas ?? '')
  const [erro, setErro] = useState<string | null>(null)
  const [ocupado, setOcupado] = useState(false)

  const atrasada = t.prazo && t.prazo < hoje() && t.status !== 'concluida'

  async function salvar(campos: Partial<Tarefa>, sucessoMsg?: string) {
    if (demo) {
      setErro(MSG_DEMO_BLOQUEIO)
      return
    }
    setOcupado(true)
    setErro(null)
    const { error } = await supabase.from('tarefas').update(campos).eq('id', t.id)
    if (error) setErro(traduzir(error.message))
    else {
      if (sucessoMsg) onSucesso(sucessoMsg)
      recarregar()
    }
    setOcupado(false)
  }

  return (
    <Cartao>
      <div onClick={abrir} className="cursor-pointer">
        <div className="flex items-start justify-between gap-2">
          <span className="font-medium leading-snug">{t.titulo}</span>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <Etiqueta className={COR_PRIORIDADE[t.prioridade]}>{t.prioridade}</Etiqueta>
            {t.status !== 'pendente' && (
              <Etiqueta>{NOME_TAREFA[t.status as StatusTarefa] ?? t.status}</Etiqueta>
            )}
          </div>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-suave">
          {t.prazo && (
            <span className={atrasada ? 'text-red-300' : ''}>
              {atrasada ? 'atrasada · ' : 'até '}
              {data(t.prazo)}
            </span>
          )}
          {t.contestada && (
            <Etiqueta className="border-amber-500/30 bg-amber-500/10 text-amber-300">contestada</Etiqueta>
          )}
          {t.notas && !t.contestada && <span>· tem nota</span>}
        </div>
        {rotuloProjeto && t.projeto_id && (
          <div className="mt-1" onClick={(e) => e.stopPropagation()}>
            <Link to={`/projeto/${t.projeto_id}`} className="text-[11px] text-acento hover:underline">
              → {rotuloProjeto}
            </Link>
          </div>
        )}
      </div>

      {aberta && (
        <div className="mt-4 space-y-3 border-t border-borda pt-4">
          {t.descricao && <p className="whitespace-pre-wrap text-sm text-suave">{t.descricao}</p>}

          {t.resposta_claude && (
            <div className="rounded-lg border border-acento/30 bg-acento/5 p-3 text-sm">
              <div className="mb-1 text-xs font-medium text-acento">Análise</div>
              {t.resposta_claude}
            </div>
          )}

          <Area
            rotulo="Resultado"
            dica="Obrigatório para concluir. Artefato verificável — não vale 'fiz'. Mínimo 10 caracteres."
            rows={3}
            value={resultado}
            onChange={(e) => setResultado(e.target.value)}
            placeholder="O que ficou pronto, com link/prova quando houver"
            disabled={demo}
          />

          <Area
            rotulo="Notas"
            dica="Dúvida, discordância, contexto. Não bloqueia a execução."
            rows={2}
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            disabled={demo}
          />

          {erro && <Erro>{erro}</Erro>}

          <div className="flex flex-wrap gap-2">
            <Botao
              disabled={demo || ocupado || resultado.trim().length < 10}
              onClick={() =>
                salvar(
                  { status: 'concluida', resultado, notas: notas || null },
                  'Tarefa concluída.'
                )
              }
            >
              Concluir
            </Botao>
            <Botao
              variante="secundario"
              disabled={demo || ocupado}
              onClick={() => salvar({ notas: notas || null, resultado: resultado || null }, 'Salvo.')}
            >
              Salvar
            </Botao>
            {t.status === 'pendente' && (
              <Botao
                variante="secundario"
                disabled={demo || ocupado}
                onClick={() => salvar({ status: 'em_andamento' })}
              >
                Começar
              </Botao>
            )}
            <Botao
              variante={t.contestada ? 'secundario' : 'perigo'}
              disabled={demo || ocupado}
              onClick={() => salvar({ contestada: !t.contestada, notas: notas || null })}
            >
              {t.contestada ? 'Retirar contestação' : 'Contestar'}
            </Botao>
          </div>

          <p className="text-[11px] text-suave">
            Contestar não bloqueia nada — registra a discordância para eu analisar no fechamento do ciclo (§3.3).
          </p>
        </div>
      )}
    </Cartao>
  )
}

function traduzir(msg: string) {
  if (msg.includes('concluida_exige_resultado'))
    return 'O banco recusou: tarefa só fecha com o resultado escrito (mínimo 10 caracteres). Constituição §4.3.'
  return msg
}
