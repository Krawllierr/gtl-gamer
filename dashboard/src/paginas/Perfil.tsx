import { Link, useSearchParams } from 'react-router-dom'
import { useSessao } from '../hooks/useSessao'
import { useChecklist } from '../hooks/useChecklist'
import type { Papel } from '../lib/tipos'
import {
  PIPELINE,
  PRIMEIROS_PASSOS,
  REGRAS_RAPIDAS,
  SEGURANCA,
  rotuloQuem,
  setupParaPapel,
} from '../playbook/dados'
import { Cartao, Etiqueta, Vazio } from '../componentes/ui'
import { NOME_FASE, TETO_DIAS } from '../lib/formato'

type Aba = 'papel' | 'setup' | 'pipeline' | 'regras'
const ABAS_VALIDAS: Aba[] = ['papel', 'setup', 'pipeline', 'regras']

function abaDeUrl(raw: string | null): Aba {
  if (raw && ABAS_VALIDAS.includes(raw as Aba)) return raw as Aba
  return 'papel'
}

export default function Perfil() {
  const { perfil } = useSessao()
  const [params, setParams] = useSearchParams()
  const aba = abaDeUrl(params.get('aba'))

  if (!perfil) return <Vazio>Perfil não encontrado.</Vazio>

  function setAba(next: Aba) {
    setParams(next === 'papel' ? {} : { aba: next }, { replace: true })
  }

  const abas: [Aba, string][] = [
    ['papel', 'Meu papel'],
    ['setup', 'Setup'],
    ['pipeline', 'Pipeline'],
    ['regras', 'Regras rápidas'],
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold">{perfil.nome}</h1>
        <p className="text-sm text-suave">
          {perfil.titulo} · playbook do seu papel
        </p>
      </div>

      <div className="-mx-4 flex gap-1 overflow-x-auto border-b border-borda px-4 pb-px">
        {abas.map(([k, r]) => (
          <button
            key={k}
            type="button"
            onClick={() => setAba(k)}
            className={`whitespace-nowrap px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acento/50 ${
              aba === k ? 'border-b-2 border-acento text-texto' : 'text-suave'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {aba === 'papel' && <AbaPapel />}
      {aba === 'setup' && <AbaSetup papel={perfil.papel} perfilId={perfil.id} />}
      {aba === 'pipeline' && <AbaPipeline papel={perfil.papel} perfilId={perfil.id} />}
      {aba === 'regras' && <AbaRegras />}
    </div>
  )
}

/* ---------------- MEU PAPEL ---------------- */

function AbaPapel() {
  const { perfil } = useSessao()
  if (!perfil) return null

  return (
    <div className="space-y-3">
      <Cartao>
        <div className="text-sm font-medium">{perfil.titulo}</div>
        {perfil.ritmo && <p className="mt-1 text-xs text-suave">Ritmo: {perfil.ritmo}</p>}
        <p className="mt-2 text-xs text-suave">
          Gustavo nunca está no caminho crítico. Gabriel nunca espera aprovação para continuar. (§3.2)
        </p>
      </Cartao>

      <Cartao>
        <div className="mb-2 text-sm font-medium">Você decide sozinho</div>
        <ul className="space-y-1 text-sm text-suave">
          {perfil.dominios.map((d) => (
            <li key={d}>· {d}</li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-suave">
          O outro pode discordar, mas não pode bloquear. Discordância vira nota no log. (§3.3)
        </p>
      </Cartao>

      <Cartao>
        <div className="mb-2 text-sm font-medium">Suas métricas-chave</div>
        <ul className="space-y-1 text-sm text-suave">
          {perfil.metricas_chave.map((m) => (
            <li key={m}>· {m}</li>
          ))}
        </ul>
      </Cartao>

      <Cartao>
        <div className="mb-2 text-sm font-medium">Cota mínima por ciclo</div>
        <ul className="space-y-1 text-sm text-suave">
          {perfil.cota_ciclo.map((c) => (
            <li key={c}>· {c}</li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-suave">
          Indexado por realizado ÷ declarado — nunca horas absolutas. (§3.4)
        </p>
      </Cartao>

      <p className="text-center text-xs text-suave">
        Contrato completo em{' '}
        <Link to="/constituicao" className="text-acento hover:underline">
          Regras
        </Link>
      </p>
    </div>
  )
}

/* ---------------- SETUP ---------------- */

function AbaSetup({ papel, perfilId }: { papel: Papel; perfilId: string }) {
  const itens = setupParaPapel(papel)
  const { marcado, alternar, quantos } = useChecklist(`setup:${perfilId}`)
  const feitos = quantos(itens.map((i) => i.id))
  const pct = itens.length ? Math.round((feitos / itens.length) * 100) : 0

  return (
    <div className="space-y-3">
      <Cartao>
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium">Checklist de habilitação</span>
          <span className="text-xs text-suave">
            {feitos}/{itens.length} · {pct}%
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-acento transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-suave">
          Habilitação Roblox do seu papel + itens do estúdio (Group, publish, mídia). Marque localmente — só
          neste aparelho. (§5.1)
        </p>
      </Cartao>

      <div className="space-y-2">
        {itens.map((item) => (
          <CheckItem
            key={item.id}
            id={item.id}
            texto={item.texto}
            secao={item.secao}
            checked={marcado(item.id)}
            onToggle={() => alternar(item.id)}
            badge={item.papel === 'ambos' ? 'Estúdio' : 'Você'}
          />
        ))}
      </div>
    </div>
  )
}

/* ---------------- PIPELINE ---------------- */

function AbaPipeline({ papel, perfilId }: { papel: Papel; perfilId: string }) {
  const primeiros = useChecklist(`primeiros:${perfilId}`)
  const pipeline = useChecklist(`pipeline:${perfilId}`)
  const seguranca = useChecklist(`seguranca:${perfilId}`)

  const idsPrimeiros = PRIMEIROS_PASSOS.map((i) => i.id)
  const idsPipeline = PIPELINE.flatMap((f) => f.itens.map((i) => i.id))
  const idsSec = SEGURANCA.map((i) => i.id)

  return (
    <div className="space-y-4">
      <Cartao>
        <div className="text-sm font-medium">Como usar este playbook</div>
        <p className="mt-1 text-xs text-suave">
          Em todo projeto novo: percorra F0→F5 (config Roblox por fase). Itens{' '}
          <strong className="text-texto">Você</strong> são sua responsabilidade.{' '}
          <strong className="text-texto">O outro</strong> é do sócio — não absorva em silêncio (§3.4).{' '}
          <strong className="text-texto">Ambos</strong> exige consenso ou trabalho conjunto.
        </p>
      </Cartao>

      {/* §12 */}
      <section className="space-y-2">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-suave">Primeiros passos · Roblox · §12</h2>
          <span className="text-[11px] text-suave">
            {primeiros.quantos(idsPrimeiros)}/{idsPrimeiros.length}
          </span>
        </div>
        {PRIMEIROS_PASSOS.map((item) => {
          const r = rotuloQuem(item.quem, papel)
          return (
            <CheckItem
              key={item.id}
              id={item.id}
              texto={item.texto}
              secao={item.secao}
              checked={primeiros.marcado(item.id)}
              onToggle={() => primeiros.alternar(item.id)}
              badge={etiqueta(r)}
              destaque={r === 'voce' || r === 'ambos'}
            />
          )
        })}
      </section>

      {/* F0–F5 */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-suave">Pipeline do projeto · §6</h2>
          <span className="text-[11px] text-suave">
            {pipeline.quantos(idsPipeline)}/{idsPipeline.length}
          </span>
        </div>

        {PIPELINE.map((fase) => {
          const teto = TETO_DIAS[fase.fase]
          return (
            <Cartao key={fase.fase}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{NOME_FASE[fase.fase]}</span>
                <Etiqueta>{fase.duracao}</Etiqueta>
                {teto !== undefined && <Etiqueta>≤{teto}d</Etiqueta>}
                <Etiqueta className="border-borda/60 text-[10px]">{fase.secao}</Etiqueta>
              </div>
              <p className="mt-2 text-xs text-amber-200/90">Gate: {fase.gate}</p>
              <div className="mt-3 space-y-2">
                {fase.itens.map((item) => {
                  const r = rotuloQuem(item.quem, papel)
                  return (
                    <CheckItem
                      key={item.id}
                      id={item.id}
                      texto={item.texto}
                      checked={pipeline.marcado(item.id)}
                      onToggle={() => pipeline.alternar(item.id)}
                      badge={etiqueta(r)}
                      destaque={r === 'voce' || r === 'ambos'}
                      compacto
                    />
                  )
                })}
              </div>
            </Cartao>
          )
        })}
      </section>

      {/* §7.3 — só Gabriel */}
      {papel === 'produto_tech' && (
        <section className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium text-suave">Segurança antes de publicar · §7.3</h2>
            <span className="text-[11px] text-suave">
              {seguranca.quantos(idsSec)}/{idsSec.length}
            </span>
          </div>
          <Cartao className="border-red-500/30 bg-red-500/5">
            <p className="mb-3 text-xs text-red-200">
              Checklist incompleta = não publica. Sem exceção. Código de IA confia no cliente por padrão.
            </p>
            <div className="space-y-2">
              {SEGURANCA.map((item) => (
                <CheckItem
                  key={item.id}
                  id={item.id}
                  texto={item.texto}
                  checked={seguranca.marcado(item.id)}
                  onToggle={() => seguranca.alternar(item.id)}
                  badge="Você"
                  destaque
                  compacto
                />
              ))}
            </div>
          </Cartao>
        </section>
      )}
    </div>
  )
}

/* ---------------- REGRAS RÁPIDAS ---------------- */

function AbaRegras() {
  return (
    <div className="space-y-3">
      {REGRAS_RAPIDAS.map((r) => (
        <Cartao key={r.id}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{r.titulo}</span>
            <Etiqueta>{r.secao}</Etiqueta>
          </div>
          <ul className="mt-2 space-y-1 text-sm text-suave">
            {r.bullets.map((b) => (
              <li key={b}>· {b}</li>
            ))}
          </ul>
        </Cartao>
      ))}
      <p className="text-center text-xs text-suave">
        Texto completo em{' '}
        <Link to="/constituicao" className="text-acento hover:underline">
          Regras / Constituição
        </Link>
      </p>
    </div>
  )
}

/* ---------------- UI helpers ---------------- */

function etiqueta(r: 'voce' | 'outro' | 'ambos') {
  if (r === 'voce') return 'Você'
  if (r === 'outro') return 'O outro'
  return 'Ambos'
}

function CheckItem({
  id,
  texto,
  secao,
  checked,
  onToggle,
  badge,
  destaque = false,
  compacto = false,
}: {
  id: string
  texto: string
  secao?: string
  checked: boolean
  onToggle: () => void
  badge?: string
  destaque?: boolean
  compacto?: boolean
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
        destaque
          ? 'border-borda bg-painel'
          : 'border-transparent bg-white/[0.02] opacity-70'
      } ${checked ? 'opacity-60' : ''}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-borda accent-acento"
      />
      <span className="min-w-0 flex-1">
        <span className={`block text-sm leading-snug ${checked ? 'line-through text-suave' : ''}`}>
          {texto}
        </span>
        {(secao || badge) && !compacto && (
          <span className="mt-1 flex flex-wrap items-center gap-1.5">
            {badge && (
              <Etiqueta
                className={
                  badge === 'Você'
                    ? 'border-acento/40 bg-acento/10 text-acento'
                    : badge === 'Ambos'
                      ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                      : undefined
                }
              >
                {badge}
              </Etiqueta>
            )}
            {secao && <span className="text-[10px] text-suave">{secao}</span>}
          </span>
        )}
        {compacto && badge && (
          <span className="mt-1 inline-block">
            <Etiqueta
              className={
                badge === 'Você'
                  ? 'border-acento/40 bg-acento/10 text-acento'
                  : badge === 'Ambos'
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                    : undefined
              }
            >
              {badge}
            </Etiqueta>
          </span>
        )}
      </span>
    </label>
  )
}
