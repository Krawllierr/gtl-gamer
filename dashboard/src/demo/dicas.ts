export type DicaId =
  | 'portfolio'
  | 'projeto'
  | 'tarefas'
  | 'checkin'
  | 'ciclo'
  | 'novo-projeto'

export const DICAS_DEMO: Record<DicaId, string> = {
  portfolio:
    'Portfólio Demo: #01 está na janela de 14 dias com só 320 visitantes — abaixo do gate de amostra (500). Isso ainda não mata o jogo; aponta problema de descoberta.',
  projeto:
    'Abra as abas: Definição (escopo curto), Fases (tetos), Métricas (snapshots), Veredito. Em #01 o veredito ainda não existe porque a observação não fechou. Em #00 já há um falhou com post-mortem.',
  tarefas:
    'Tarefa só fecha com resultado escrito — o banco recusa “fiz”. Uma delas está atrasada de propósito, para você ver o sinal vermelho.',
  checkin:
    'Check-in registra artefato verificável (“3 thumbnails”), não tempo vazio. No Demo o botão não grava no banco.',
  ciclo:
    'Índice de esforço = realizado ÷ declarado. Gustavo com 90% de 10h performou melhor que Gabriel com 80% de 30h — essa é a comparação honesta (§3.4).',
  'novo-projeto':
    'Criar projeto está bloqueado no Demo. Na vida real, core loop ≤ 3 passos e monetização entram antes do código.',
}
