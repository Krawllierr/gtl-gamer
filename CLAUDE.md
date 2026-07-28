# GTL Gamer — contexto para IA

**Leia isto antes de responder qualquer coisa neste projeto.**

Este arquivo é o briefing operacional. A fonte da verdade é a [`CONSTITUICAO.md`](./CONSTITUICAO.md) — se algo aqui divergir dela, **a Constituição vence e este arquivo está desatualizado**.

---

## 1. O que é este projeto

Dois irmãos nos EUA — **Gabriel** e **Gustavo** — construindo um estúdio de jogos Roblox **sem formação técnica em desenvolvimento**, usando IA como substituto temporário de habilidade, para gerar caixa e depois reinvestir em habilidade real.

Roblox é o **veículo**, não o objetivo. Público-alvo: **infantil e jovem**.

**A métrica que manda: dólares gerados por hora investida.** Não é qualidade artística, não é orgulho do produto.

**Modelo mental correto:** portfólio de apostas baratas com aprendizado composto. Não é uma empresa, não é um emprego, não é uma startup buscando investimento. São dois irmãos com um SSD, $64/mês de custo fixo e nenhum jogo publicado ainda.

---

## 2. Quem são

| | Gabriel | Gustavo |
|---|---|---|
| Papel | Produto & Tecnologia | Growth & Mercado |
| Decide sozinho | Código Luau, IA, arquitetura, segurança, infra, publicação | Ícone, thumbnail, título, vídeo (TikTok/Shorts), pesquisa de gênero, comunidade, os $50/mês de anúncios |
| Disponibilidade | Mais tempo livre, blocos longos | Algumas noites, assíncrono |
| Nível técnico | Iniciante, aprende via IA | Não técnico — **não sabe usar GitHub** |

**Regra do caminho crítico:** Gustavo nunca bloqueia Gabriel. Gabriel nunca assume o domínio do Gustavo em silêncio.

**Gabriel é quem fala com você na maior parte do tempo.** Ele quer crítica, não concordância — ver §7.

---

## 3. Como um jogo Roblox realmente funciona

Contexto técnico mínimo para ajudar de forma útil.

### Linguagem e ambiente

- **Luau**, um dialeto tipado de Lua 5.1. Não é Lua padrão: tem tipos opcionais, `continue`, e APIs próprias
- **Roblox Studio** é o editor oficial. Para trabalho com IA, é melhor editar arquivos em disco com **Rojo** (sincroniza VS Code ↔ Studio) — permite git, diff e a IA lendo o projeto inteiro. *Recomendação a validar na prática.*

### Onde o código vive (isto determina segurança)

| Container | Roda em | Uso |
|---|---|---|
| `ServerScriptService` | **Servidor** | Toda lógica de economia, progressão, validação |
| `ReplicatedStorage` | Ambos enxergam | Módulos compartilhados e `RemoteEvent`s. **Nada sensível aqui** |
| `StarterPlayerScripts` | **Cliente** | UI, entrada, efeitos. O jogador controla isto |
| `Workspace` | Ambos | O mundo 3D |

### O erro fatal que a IA comete por padrão

Código Luau gerado por IA **confia no cliente**. No Roblox isso destrói o jogo: exploiters executam scripts arbitrários no cliente e podem chamar qualquer `RemoteEvent` com qualquer valor.

```lua
-- ERRADO: o cliente diz quanto ganhou
RemoteMoedas.OnServerEvent:Connect(function(player, quantidade)
    dados[player].moedas += quantidade   -- exploiter envia 999999999
end)

-- CERTO: o cliente só pede; o servidor decide e valida
RemoteColetar.OnServerEvent:Connect(function(player, idMoeda)
    local moeda = moedasAtivas[idMoeda]
    if not moeda then return end
    if (player.Character.HumanoidRootPart.Position - moeda.Position).Magnitude > 10 then return end
    moedasAtivas[idMoeda] = nil
    dados[player].moedas += moeda.valor  -- valor vem do SERVIDOR
end)
```

**Regra:** o cliente nunca informa quanto ganhou, quanto tem, ou o que comprou. Sempre validar posse, distância, cooldown e estado no servidor. Rate limiting em todo Remote que altera estado.

### Persistência

`DataStoreService` — assíncrono, com limites de requisição, **falha silenciosamente sob carga**. Sempre com `pcall`, retry e tratamento de falha. **Perda de save mata a retenção mais rápido que qualquer bug.**

### Monetização

| Tipo | O que é |
|---|---|
| **Game Pass** | Compra única, permanente (ex: 2× moedas para sempre) |
| **Developer Product** | Consumível, recompra (ex: pacote de 100 moedas) |

Roblox retém 30% na venda. O que sobra é convertido via DevEx.

### Performance é retenção

Boa parte da base do Roblox é **mobile de baixo desempenho**. Jogo que trava perde o jogador em 30 segundos e mata o D1. Estética alvo: **low-poly / estilizado** — não é limitação, é o que o público espera e o que roda.

---

## 4. A economia (espelho do §2 — a Constituição manda)

- DevEx paga **$0,0038 por Robux ganho**; mínimo de **30.000 Robux** para sacar; Roblox Premium obrigatório
- Da cadeia inteira, sobram **~21–25% do que o jogador gastou**
- **M0 = primeiro saque ≈ $114.** É a única meta que importa agora
- Renda de sustento no Roblox exige estar numa faixa muito estreita da plataforma. Não alimentar fantasia sobre isso

**O gargalo não é código, é descoberta.** Ícone, thumbnail, título e os primeiros 60 segundos determinam mais o resultado do que a qualidade do jogo. Distribuição vem principalmente de vídeo curto (TikTok/Shorts) e de $50/mês de anúncios.

---

## 5. Como um projeto anda

Seis fases, teto de tempo em cada. Resumo — o detalhe está no §6 da Constituição.

```
F0 Research (Gustavo)  → 3 gêneros em alta + POR QUE retêm
F1 Definição (ambos)   → 1 dia. Core loop em ≤3 passos, UMA alteração, monetização
                          definida antes do código, thumbnail rascunhada
F2 Build (Gabriel)     → teto de 3 SEMANAS. Core loop primeiro. Nada de feature nova
                          depois da semana 2
F3 Polimento (Gustavo) → variações de ícone/thumbnail, primeiros 60s, vídeos prontos
F4 Observação          → 14 dias. Mede, não constrói
F5 Veredito (ambos)    → aplica os gates, escreve post-mortem
```

**Gates (§6.1) — o de amostra vem primeiro:**

```
Visitantes únicos na janela ≥ 500?
  NÃO → "PROBLEMA DE DESCOBERTA". Não mata o jogo.
        Ataca thumbnail, título, vídeo, tráfego.
  SIM → aplica D1 ≥ 12% · sessão ≥ 6min · CCU pico ≥ 25
        Falhou em 2 de 3 → arquiva.
```

Essa separação existe porque "ninguém clicou" e "clicaram e não voltaram" pedem ações opostas.

**Estratégia de conteúdo:** clonar gêneros em alta com **uma** alteração. Ideias originais ficam no `IDEAS.md` e só viram projeto depois que um clone passar nos gates (§9).

---

## 6. Estado atual

**Não confie neste bloco para dados que mudam.** O estado real vive no Supabase (projeto Supabase `GTL Games`, ref `aqkuxvfbpubktbyuoydh`): tabelas `projetos`, `ciclos`, `tarefas`, `sessoes`, `metricas`, `veredictos` e as views `v_projetos_status`, `v_esforco_relativo`, `v_portfolio`, `v_contestacoes`. **Consulte lá antes de afirmar qualquer coisa sobre progresso.**

O que é estável:

- Estúdio: **GTL Gamer**. Repositório: `GTL-Gamer` (Constituição, IDEAS, dashboard)
- Dashboard interno construído (Vite + React + TS + Tailwind + Supabase, deploy Docker/nginx no Easypanel)
- **Edge Function `sugerir-projeto`** — chama o OpenRouter para sugerir definição de projeto. A chave do OpenRouter é secret do Supabase, nunca do frontend; o app chama via `supabase.functions.invoke`
- Ciclos de **7 dias**. As tarefas de cada ciclo são criadas pela IA no Supabase; os dois executam e escrevem o `resultado`; a IA lê e monta o próximo ciclo
- **Nenhum jogo publicado ainda.** Nenhum Robux ganho. Nenhum saque feito

---

## 7. Onde a IA erra neste projeto

Estes são os modos de falha observados. Evite-os ativamente.

**Concordar.** Gabriel pede crítica explicitamente. Aponte pontas soltas, buracos lógicos e riscos antes de elogiar. Concordância fácil produz plano bonito e inexecutável.

**Sugerir escopo.** Você vai querer propor mais features, mais telas, mais ferramentas. É o vetor #1 de scope creep e o principal risco do projeto (§10, Loop ∞). Quando em dúvida, corte.

**Escrever Luau que confia no cliente.** Ver §3. Não é opcional.

**Sugerir chave secreta no frontend.** No dashboard, só a `sb_publishable_`. A `sb_secret_` e a `service_role` jamais — há uma trava no código que quebra o app de propósito. O mesmo vale para **qualquer chave de terceiro** (OpenRouter, etc.): vai em Edge Function ou servidor, nunca em variável `VITE_`.

**Inventar fatos sobre Roblox.** Taxas de DevEx, ToS, limites de API e o painel do Supabase mudam com frequência e já mudaram desde os dados de treino. **Pesquise antes de afirmar.** Errar aqui contamina decisões de negócio.

**Tratar como empresa grande.** Não há equipe, jurídico, orçamento nem usuários. Proponha a solução de dois irmãos, não a corporativa.

**Sugerir ferramentas ou infraestrutura nova.** §10.3 proíbe ferramenta interna nova antes do jogo #3. O dashboard foi a exceção única, já usada.

**Prometer renda.** Não estime ganhos otimistas. A matemática do §4 é dura de propósito.

**Confundir ajudar com absorver.** Se Gabriel pedir para assumir algo do domínio do Gustavo, lembre da regra de não-invasão (§3.4): ajuda é permitida quando pedida e registrada.

---

## 8. Como se comportar

- **Português.** Direto, sem enrolação, sem elogio vazio
- **Pesquise antes de afirmar** qualquer coisa sobre o presente: taxas, ToS, preços, APIs, interfaces
- **Aponte o risco antes da solução** quando houver risco
- **Não crie arquivos sem pedido explícito.** Discuta primeiro
- **Prefira a resposta que faz eles publicarem algo hoje** à resposta que faz eles planejarem melhor
- Quando eles entrarem em loop de análise, **nomeie o Loop ∞** e force 2 opções + 1 ação de 20 minutos

---

## 9. Vocabulário

| Termo | Significado |
|---|---|
| **M0** | Primeiro saque DevEx: 30.000 Robux ≈ $114 |
| **Gate de amostra** | ≥500 visitantes únicos antes de julgar a qualidade do jogo |
| **Problema de descoberta** | Ninguém viu o jogo. Não é veredito sobre o produto |
| **Loop ∞** | Analisar/planejar/refinar sem publicar. O modo de falha mais provável |
| **Ciclo** | 7 dias de trabalho, com capacidade declarada e fechamento |
| **Índice de esforço** | Realizado ÷ capacidade declarada. Nunca horas absolutas |
| **Cota mínima** | Entregas obrigatórias por ciclo, por pessoa |
| **Contestar** | Registrar discordância sem bloquear a execução |
| **Regra zero** | A Constituição vence conversas e decisões informais |

---

## 10. Arquivos

| Arquivo | O que é |
|---|---|
| `CONSTITUICAO.md` | **Fonte da verdade.** Contrato, economia, papéis, pipeline, gates, regras de IA |
| `IDEAS.md` | Fila de ideias originais (§9) |
| `CLAUDE.md` | Este arquivo — briefing de contexto |
| `README.md` | Estrutura do repositório e deploy do dashboard |
| `dashboard/` | Painel interno |

---

*v0.1 — 2026-07-27. Escrito antes do primeiro jogo publicado, portanto parcialmente teórico. Corrigir com a realidade após o projeto #01 chegar à Fase 5 (§16, item R13).*
