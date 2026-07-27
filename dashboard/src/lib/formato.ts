import type { Fase, Prioridade, StatusTarefa } from './tipos'

export const NOME_FASE: Record<Fase, string> = {
  f0_research: 'Fase 0 · Research',
  f1_definicao: 'Fase 1 · Definição',
  f2_build: 'Fase 2 · Build',
  f3_polimento: 'Fase 3 · Polimento',
  f4_observacao: 'Fase 4 · Observação',
  f5_veredito: 'Fase 5 · Veredito',
}

export const FASES: Fase[] = [
  'f0_research',
  'f1_definicao',
  'f2_build',
  'f3_polimento',
  'f4_observacao',
  'f5_veredito',
]

// Tetos de tempo por fase — Constituição §6.1
export const TETO_DIAS: Partial<Record<Fase, number>> = {
  f1_definicao: 1,
  f2_build: 21,
  f4_observacao: 14,
}

export const NOME_STATUS: Record<string, string> = {
  em_projeto: 'Em projeto',
  em_build: 'Em build',
  em_observacao: 'Em observação',
  lucrando: 'Lucrando',
  flopando: 'Flopando',
  problema_descoberta: 'Problema de descoberta',
  arquivado: 'Arquivado',
  estourado: 'Estourado',
}

export const NOME_TAREFA: Record<StatusTarefa, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
  bloqueada: 'Bloqueada',
  cancelada: 'Cancelada',
}

export const COR_PRIORIDADE: Record<Prioridade, string> = {
  alta: 'text-red-300 bg-red-500/10 border-red-500/30',
  media: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
  baixa: 'text-suave bg-white/5 border-borda',
}

// Gates de qualidade — Constituição §6.1
export const GATE_AMOSTRA = 500
export const GATE_D1 = 12
export const GATE_SESSAO = 6
export const GATE_CCU = 25
export const ROBUX_M0 = 30000
export const TAXA_DEVEX = 0.0038

export function data(iso: string | null | undefined) {
  if (!iso) return '—'
  const [a, m, d] = iso.slice(0, 10).split('-')
  return `${d}/${m}/${a.slice(2)}`
}

export function horas(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m}min`
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, '0')}`
}

export function hoje() {
  return new Date().toISOString().slice(0, 10)
}

export function usd(robux: number) {
  return (robux * TAXA_DEVEX).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
