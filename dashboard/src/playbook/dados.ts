import type { Fase, Papel } from '../lib/tipos'

export type Quem = Papel | 'ambos'

export type ItemSetup = {
  id: string
  texto: string
  papel: Quem
  secao: string
}

export type ItemFase = {
  id: string
  texto: string
  quem: Quem
}

export type FasePlaybook = {
  fase: Fase
  quem: Quem
  duracao: string
  itens: ItemFase[]
  gate: string
  secao: string
}

export type ItemPrimeiroPasso = {
  id: string
  texto: string
  quem: Quem
  secao: string
}

export type RegraRapida = {
  id: string
  titulo: string
  secao: string
  bullets: string[]
}

export type ItemSeguranca = {
  id: string
  texto: string
}

/** Contas e ferramentas Roblox — §5.1, §5.5, §3.3, §7.4, §12 */
export const SETUP: ItemSetup[] = [
  // Shared — studio Roblox only
  { id: 'setup-ambos-18', texto: 'Ambos 18+ com documento', papel: 'ambos', secao: '§5.1' },
  {
    id: 'setup-ambos-pc',
    texto: 'PC capaz de rodar Studio, edição de mídia e Ads Manager',
    papel: 'ambos',
    secao: '§5.1',
  },
  {
    id: 'setup-ambos-group',
    texto: 'Roblox Group GTL Gamer criado com ambos membros e roles definidos',
    papel: 'ambos',
    secao: '§4.1 · §5.1',
  },

  // Gabriel — produto_tech
  {
    id: 'setup-gab-studio',
    texto: 'Roblox Studio instalado',
    papel: 'produto_tech',
    secao: '§12',
  },
  {
    id: 'setup-gab-group-pub',
    texto: 'Role no Group: Edit + Publish experiences',
    papel: 'produto_tech',
    secao: '§4.1',
  },
  {
    id: 'setup-gab-2fa',
    texto: '2FA ativo na conta que publica',
    papel: 'produto_tech',
    secao: '§12',
  },
  {
    id: 'setup-gab-eligibility',
    texto: 'Elegibilidade de publish na conta que publica (ID verify / purchase / Eligibility no Hub)',
    papel: 'produto_tech',
    secao: '§12',
  },
  {
    id: 'setup-gab-piso',
    texto: 'Piso técnico §7.4: cliente vs servidor, RemoteEvent, DataStore',
    papel: 'produto_tech',
    secao: '§7.4',
  },
  {
    id: 'setup-gab-monetization',
    texto: 'MarketplaceService no servidor: Game Pass ownership + ProcessReceipt para Dev Products',
    papel: 'produto_tech',
    secao: '§7.3',
  },
  {
    id: 'setup-gab-hub',
    texto: 'Creator Hub: configure place + Monetization da experiência do Group',
    papel: 'produto_tech',
    secao: '§6 Fase 2',
  },
  {
    id: 'setup-gab-ia',
    texto: 'IDE com IA (Cursor/Claude) para vibe coding em Luau',
    papel: 'produto_tech',
    secao: '§7',
  },

  // Gustavo — growth
  {
    id: 'setup-gus-owner',
    texto: 'Conta dona do Group (ou owner com payouts configurados)',
    papel: 'growth',
    secao: '§4.1 · §5.5',
  },
  {
    id: 'setup-gus-id',
    texto: 'Verificação de identidade + 2FA no owner do Group',
    papel: 'growth',
    secao: '§5.1 · §12',
  },
  {
    id: 'setup-gus-allages',
    texto: 'Elegibilidade All Ages do owner: Plus/Premium 2 meses ou fee ~1k Robux + evaluation',
    papel: 'growth',
    secao: '§2 · §12',
  },
  {
    id: 'setup-gus-devex',
    texto: 'Conta Roblox que recebe o DevEx (§5.5 — SSN / work auth)',
    papel: 'growth',
    secao: '§5.5',
  },
  {
    id: 'setup-gus-tipalti',
    texto: 'Tipalti + tax form prontos quando for sacar (≥30k earned) — não bloqueia criar jogo',
    papel: 'growth',
    secao: '§5.1 · §5.5',
  },
  {
    id: 'setup-gus-arte',
    texto: 'Ferramenta de arte: ícone 512×512 + thumbnails 16:9 (~1920×1080, <3MB)',
    papel: 'growth',
    secao: '§3.3',
  },
  {
    id: 'setup-gus-video',
    texto: 'Editor de vídeo (CapCut ou equivalente)',
    papel: 'growth',
    secao: '§3.3',
  },
  {
    id: 'setup-gus-tiktok',
    texto: 'Conta TikTok do estúdio aberta e postando',
    papel: 'growth',
    secao: '§12',
  },
  {
    id: 'setup-gus-yt',
    texto: 'Conta YouTube/Shorts do estúdio aberta',
    papel: 'growth',
    secao: '§12',
  },
  {
    id: 'setup-gus-analytics',
    texto: 'Creator Hub: View analytics + Configure media do Group',
    papel: 'growth',
    secao: '§6 Fase 4',
  },
  {
    id: 'setup-gus-ads',
    texto: 'Ads Manager + orçamento de anúncios ($50/mês)',
    papel: 'growth',
    secao: '§5.2',
  },
]

/** Ciclo 01–02 — habilitação Roblox antes do pipeline por projeto */
export const PRIMEIROS_PASSOS: ItemPrimeiroPasso[] = [
  {
    id: 'pp-1',
    texto: 'Criar o Roblox Group GTL Gamer + roles (Edit/Publish Gabriel; Analytics Gustavo)',
    quem: 'growth',
    secao: '§12 #1',
  },
  {
    id: 'pp-2',
    texto: 'ID verify + 2FA + elegibilidade All Ages do owner do Group',
    quem: 'growth',
    secao: '§12 #2',
  },
  {
    id: 'pp-3',
    texto: 'Studio + jogo trivial owned by Group: publish path + compra real testada',
    quem: 'produto_tech',
    secao: '§12 #3',
  },
  {
    id: 'pp-4',
    texto: 'Estudar §7.4 e aplicar checklist §7.3 no jogo trivial',
    quem: 'produto_tech',
    secao: '§12 · §7.4',
  },
  {
    id: 'pp-5',
    texto: 'Abrir TikTok e YouTube do estúdio e começar a postar mesmo sem jogo',
    quem: 'growth',
    secao: '§12 #5',
  },
  {
    id: 'pp-6',
    texto: 'Fase 0 do projeto #01 — 3 gêneros + 10 referências de thumbnail',
    quem: 'growth',
    secao: '§12 #6',
  },
  {
    id: 'pp-7',
    texto: 'Ciclo 02: Fase 1 do #01 (definição, teto 1 dia) e início da Fase 2',
    quem: 'ambos',
    secao: '§12 Ciclo 02',
  },
]

/** Pipeline F0–F5 — §6 (config Roblox por fase) */
export const PIPELINE: FasePlaybook[] = [
  {
    fase: 'f0_research',
    quem: 'growth',
    duracao: '2–4 dias',
    secao: '§6 Fase 0',
    gate: 'Os dois concordam com o alvo.',
    itens: [
      { id: 'f0-1', texto: '3 gêneros/mecânicas em alta com sinal de tração recente', quem: 'growth' },
      { id: 'f0-2', texto: 'Para cada: jogadores ativos, há quanto tempo, saturação', quem: 'growth' },
      { id: 'f0-3', texto: 'Por que aquele jogo retém (o que faz o jogador voltar)', quem: 'growth' },
      { id: 'f0-4', texto: '10 referências de ícone/thumbnail do nicho', quem: 'growth' },
    ],
  },
  {
    fase: 'f1_definicao',
    quem: 'ambos',
    duracao: '1 dia · teto rígido',
    secao: '§6 Fase 1',
    gate: 'Passou de 1 dia → ideia complexa demais. Volta pro backlog.',
    itens: [
      { id: 'f1-1', texto: 'Uma frase descrevendo o jogo', quem: 'ambos' },
      { id: 'f1-2', texto: 'Core loop em no máximo 3 passos', quem: 'ambos' },
      { id: 'f1-3', texto: 'Uma alteração em relação ao clone base — só uma', quem: 'ambos' },
      {
        id: 'f1-4',
        texto: 'Monetização definida: Game Pass vs Developer Product (antes do código)',
        quem: 'ambos',
      },
      {
        id: 'f1-5',
        texto: 'Título + rascunho ícone 512×512 + thumbnail 16:9 (~1920×1080) — se não vende na imagem, ideia morta',
        quem: 'growth',
      },
    ],
  },
  {
    fase: 'f2_build',
    quem: 'produto_tech',
    duracao: 'teto de 3 semanas',
    secao: '§6 Fase 2',
    gate: 'Passou de 3 semanas → mata ou lança incompleto. Nunca estende.',
    itens: [
      {
        id: 'f2-1',
        texto: 'Experiência owned by Group; Place privado até a Fase 4',
        quem: 'produto_tech',
      },
      { id: 'f2-2', texto: 'Core loop funcional primeiro. Nada mais', quem: 'produto_tech' },
      {
        id: 'f2-3',
        texto: 'DataStores habilitados e testados contra perda de dados',
        quem: 'produto_tech',
      },
      {
        id: 'f2-4',
        texto: 'Creator Hub: criar Game Pass e/ou Dev Products da experiência',
        quem: 'produto_tech',
      },
      {
        id: 'f2-5',
        texto: 'ProcessReceipt / ownership check no servidor + compra real testada',
        quem: 'produto_tech',
      },
      {
        id: 'f2-6',
        texto: 'Checklist de segurança §7.3 em toda lógica de economia',
        quem: 'produto_tech',
      },
      { id: 'f2-7', texto: 'Nenhuma feature nova depois da semana 2', quem: 'produto_tech' },
    ],
  },
  {
    fase: 'f3_polimento',
    quem: 'growth',
    duracao: '3–5 dias',
    secao: '§6 Fase 3',
    gate: 'Vídeos de lançamento prontos antes do lançamento.',
    itens: [
      {
        id: 'f3-1',
        texto: 'Upload no Creator Hub: ícone 512×512 + ≥2–3 thumbnails 16:9 (<3MB)',
        quem: 'growth',
      },
      { id: 'f3-2', texto: '3 variações de ícone/thumbnail e 2 de título para testes', quem: 'growth' },
      { id: 'f3-3', texto: 'Descrição e tags otimizadas no Hub', quem: 'growth' },
      { id: 'f3-4', texto: 'Primeiros 60 segundos revisados obsessivamente', quem: 'growth' },
      { id: 'f3-5', texto: 'Playtest com 3+ pessoas de fora, relatório escrito', quem: 'growth' },
      { id: 'f3-6', texto: 'Vídeos de lançamento prontos antes do lançamento', quem: 'growth' },
    ],
  },
  {
    fase: 'f4_observacao',
    quem: 'ambos',
    duracao: '14 dias',
    secao: '§6 Fase 4',
    gate: 'Não adicionar features. Só correção de bug crítico.',
    itens: [
      {
        id: 'f4-1',
        texto: 'Publicar Public (+ All Ages se o owner estiver elegível)',
        quem: 'produto_tech',
      },
      {
        id: 'f4-2',
        texto: 'Ads Manager: Sponsored Experiences, creatives 16:9, budget ~$50 controlado',
        quem: 'growth',
      },
      { id: 'f4-3', texto: 'Postar vídeos em TikTok/Shorts durante toda a janela', quem: 'growth' },
      {
        id: 'f4-4',
        texto: 'Medir no Creator Hub: CTR, visitantes únicos, D1, sessão média, CCU pico',
        quem: 'ambos',
      },
      { id: 'f4-5', texto: 'Testar variações de ícone/thumbnail durante a janela', quem: 'growth' },
      { id: 'f4-6', texto: 'Só bug crítico — zero feature nova', quem: 'produto_tech' },
    ],
  },
  {
    fase: 'f5_veredito',
    quem: 'ambos',
    duracao: '1 dia',
    secao: '§6 Fase 5 · §6.1',
    gate: 'Post-mortem obrigatório. Gate de amostra (≥500) antes dos gates de qualidade.',
    itens: [
      {
        id: 'f5-1',
        texto: 'Gate de amostra: visitantes únicos ≥ 500? Se não → problema de descoberta (não mata)',
        quem: 'ambos',
      },
      {
        id: 'f5-2',
        texto: 'Se amostra ok: D1 ≥ 12%, sessão ≥ 6 min, CCU pico ≥ 25 (falhou 2/3 → arquiva)',
        quem: 'ambos',
      },
      {
        id: 'f5-3',
        texto: 'Post-mortem escrito mesmo quando dói',
        quem: 'ambos',
      },
      {
        id: 'f5-4',
        texto: 'Decidir veredito: passou / marginal / problema_descoberta / falhou',
        quem: 'ambos',
      },
    ],
  },
]

/** Checklist de segurança — só Gabriel, antes de publicar (§7.3) */
export const SEGURANCA: ItemSeguranca[] = [
  { id: 'sec-1', texto: 'Toda lógica de moeda, economia e progressão roda no servidor' },
  { id: 'sec-2', texto: 'Nenhum RemoteEvent confia em valores do cliente sem validação' },
  { id: 'sec-3', texto: 'Cliente nunca informa quanto ganhou, quanto tem, ou o que comprou' },
  { id: 'sec-4', texto: 'Servidor valida se o jogador pode agir (distância, cooldown, posse, estado)' },
  { id: 'sec-5', texto: 'Rate limiting em todo RemoteEvent que altera estado' },
  { id: 'sec-6', texto: 'Nada sensível em ReplicatedStorage' },
  { id: 'sec-7', texto: 'DataStore com retry e tratamento de falha' },
  {
    id: 'sec-8',
    texto: 'Grant de compra só no servidor (ProcessReceipt / UserOwnsGamePassAsync) — nunca confiar no cliente',
  },
  { id: 'sec-9', texto: 'Teste manual: tentar quebrar a própria economia antes de publicar' },
  {
    id: 'sec-10',
    texto: 'Nenhuma chave, token ou segredo em LocalScripts / ReplicatedStorage',
  },
]

export const REGRAS_RAPIDAS: RegraRapida[] = [
  {
    id: 'reg-consenso',
    titulo: 'Consenso obrigatório',
    secao: '§3.3',
    bullets: [
      'Escolha do próximo projeto',
      'Fase 1 (definição do jogo)',
      'Veredito da Fase 5',
      'Emendas à Constituição',
      'Divisão de receita (§4.2)',
      'Decide sozinho = o outro pode discordar, mas não pode bloquear. Discordância vira nota no log.',
    ],
  },
  {
    id: 'reg-invasao',
    titulo: 'Regra de não-invasão',
    secao: '§3.4',
    bullets: [
      'Ninguém assume o domínio do outro em silêncio, mesmo quando for mais rápido.',
      'Ajuda é permitida quando pedida e registrada no log.',
      'Absorção silenciosa transforma o dono do domínio em espectador.',
    ],
  },
  {
    id: 'reg-impasse',
    titulo: 'Resolução de impasse',
    secao: '§3.5',
    bullets: [
      'Cada um escreve a posição em 5 linhas no log do projeto',
      'Em 48h: decide o dono do domínio mais próximo do assunto',
      'Sem dono claro → quem tem mais pele em jogo',
      'Nunca deixar impasse aberto além de 48h',
    ],
  },
  {
    id: 'reg-cadencia',
    titulo: 'Cadência',
    secao: '§3.6',
    bullets: [
      'Ciclo = 7 dias (declara capacidade → fecha e analisa)',
      '1 sync por semana, 30 minutos, no fechamento',
      'Entre ciclos: assíncrono e registrado no log do ciclo/projeto',
    ],
  },
  {
    id: 'reg-antiloop',
    titulo: 'Anti-Loop ∞',
    secao: '§10',
    bullets: [
      'Sinais: terceira opção, refazer o que funciona, scope creep, discussão sem decisão, ferramenta antes do problema',
      'Declarar ∞: para → 2 opções → escolhe em 24h → próxima ação de 20 min → registra',
      'Publicar imperfeito vence não publicar',
      'Um projeto ativo por vez. Sempre',
      'Nenhuma ferramenta interna nova antes do jogo #3',
    ],
  },
]

export function setupParaPapel(papel: Papel) {
  return SETUP.filter((i) => i.papel === papel || i.papel === 'ambos')
}

export function rotuloQuem(quem: Quem, meuPapel: Papel): 'voce' | 'outro' | 'ambos' {
  if (quem === 'ambos') return 'ambos'
  if (quem === meuPapel) return 'voce'
  return 'outro'
}
