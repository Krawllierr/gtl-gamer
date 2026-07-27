// Tipos do banco (GTL Games).
// Versão enxuta e legível. Para regenerar a versão completa a partir do schema real:
//   npm run tipos

export type Fase =
  | 'f0_research'
  | 'f1_definicao'
  | 'f2_build'
  | 'f3_polimento'
  | 'f4_observacao'
  | 'f5_veredito'

export type StatusTarefa = 'pendente' | 'em_andamento' | 'concluida' | 'bloqueada' | 'cancelada'
export type Prioridade = 'baixa' | 'media' | 'alta'
export type StatusCiclo = 'planejado' | 'ativo' | 'fechado'
export type Papel = 'produto_tech' | 'growth'
export type Origem = 'claude' | 'gabriel' | 'gustavo'
export type ResultadoVeredito = 'passou' | 'marginal' | 'problema_descoberta' | 'falhou'

export type Perfil = {
  id: string
  user_id: string | null
  nome: string
  papel: Papel
  titulo: string
  dominios: string[]
  metricas_chave: string[]
  cota_ciclo: string[]
  ritmo: string | null
  ativo: boolean
}

export type Ciclo = {
  id: string
  numero: number
  inicio: string
  fim: string
  objetivo: string
  status: StatusCiclo
  analise_fechamento: string | null
  contestacoes: string | null
}

export type Projeto = {
  id: string
  codigo: string
  nome: string
  genero_base: string | null
  uma_frase: string | null
  core_loop: string[] | null
  alteracao_unica: string | null
  modelo_monetizacao: string | null
  fase_atual: Fase
  data_inicio: string
  data_lancamento: string | null
  data_fim_observacao: string | null
  data_arquivamento: string | null
  roblox_universe_id: string | null
  roblox_url: string | null
  gasto_ads_total: number
  ativo: boolean
}

export type ProjetoStatus = {
  id: string
  codigo: string
  nome: string
  fase_atual: Fase
  data_inicio: string
  data_lancamento: string | null
  data_fim_observacao: string | null
  fase_desde: string | null
  dias_na_fase: number | null
  ultima_atividade: string | null
  dias_parado: number | null
  visitantes_unicos: number | null
  d1_retention: number | null
  sessao_media_min: number | null
  ccu_pico: number | null
  robux_dia: number | null
  estourou_build: boolean | null
  parado_demais: boolean | null
  observacao_encerrada: boolean | null
  status: string
  semaforo: string
}

export type Tarefa = {
  id: string
  ciclo_id: string | null
  projeto_id: string | null
  responsavel_id: string
  titulo: string
  descricao: string | null
  fase_relacionada: Fase | null
  prioridade: Prioridade
  status: StatusTarefa
  prazo: string | null
  resultado: string | null
  notas: string | null
  contestada: boolean
  resposta_claude: string | null
  respondida_em: string | null
  horas_gastas: number | null
  criada_por: Origem
  criado_em: string
  concluida_em: string | null
}

export type Sessao = {
  id: string
  ciclo_id: string | null
  projeto_id: string | null
  perfil_id: string
  data: string
  duracao_min: number
  entrega: string
  bloqueios: string | null
  proxima_acao: string | null
  notas: string | null
  criado_em: string
}

export type Metrica = {
  id: string
  projeto_id: string
  data: string
  visitantes_unicos: number | null
  visitas: number | null
  d1_retention: number | null
  sessao_media_min: number | null
  ccu_pico: number | null
  robux_dia: number | null
  gasto_ads_dia: number | null
  ctr: number | null
  registrado_por: string | null
}

export type Veredito = {
  id: string
  projeto_id: string
  data: string
  visitantes_unicos_janela: number
  gate_amostra: boolean | null
  d1_observado: number | null
  sessao_observada: number | null
  ccu_observado: number | null
  gate_d1: boolean | null
  gate_sessao: boolean | null
  gate_ccu: boolean | null
  resultado: ResultadoVeredito
  post_mortem: string
}

export type FaseLog = {
  id: string
  projeto_id: string
  fase: Fase
  entrou_em: string
  saiu_em: string | null
  justificativa: string | null
  movido_por: string | null
}

export type Portfolio = {
  em_projeto: number
  em_build: number
  em_observacao: number
  lucrando: number
  flopando: number
  problema_descoberta: number
  arquivados: number
  alertas: number
  total: number
  robux_acumulado: number
  usd_estimado: number
  robux_faltando_m0: number
}

export type EsforcoRelativo = {
  ciclo: number
  inicio: string
  fim: string
  ciclo_status: StatusCiclo
  nome: string
  titulo: string
  horas_declaradas: number | null
  horas_realizadas: number
  pct_realizado: number | null
  sessoes: number
  tarefas_concluidas: number
  tarefas_atribuidas: number
}
