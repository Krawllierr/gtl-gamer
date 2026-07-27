# CONSTITUIÇÃO DO GTL GAMER

**Arquivo Rei — fonte única da verdade e contrato interno do grupo.**

| Campo | Valor |
|---|---|
| Versão | **1.1** |
| Criado em | 2026-07-27 |
| Atualizado em | 2026-07-27 |
| Sócios | Gabriel · Gustavo |
| Base | Estados Unidos |
| Plataforma inicial | Roblox |
| Público-alvo | Infantil e jovem |
| Estúdio | **GTL Gamer** |
| Dashboard | Supabase — projeto `GTL Gamer` |

> **Regra zero:** se algo neste documento conflitar com uma conversa, um Discord, uma memória ou uma decisão informal — **este documento vence**. Se a realidade provar que o documento está errado, o documento é emendado (§14), não ignorado.

---

## §1 — Tese e critério de sucesso

### 1.1 O que estamos realmente fazendo

Não somos "desenvolvedores de jogos". Somos duas pessoas sem formação técnica construindo uma **máquina de gerar caixa com capital inicial próximo de zero**, usando IA como substituto temporário de habilidade, para depois reinvestir esse caixa em habilidade real.

Roblox é o **veículo**, não o objetivo. Se em 12 meses os dados mostrarem que outro canal converte melhor nosso tempo em dinheiro, trocamos de canal sem drama.

### 1.2 A métrica que manda

> **Dólares gerados por hora investida.**

Não é qualidade artística. Não é orgulho do produto. Não é o que outros devs acham. Quando houver conflito entre "o jogo ficaria mais legal" e "isso não move a métrica", a métrica vence.

### 1.3 O que conta como sucesso em 6 meses

Sucesso **não é** ter renda de sustento em 6 meses. Isso é fantasia e nos faria abandonar por frustração no mês 3.

Sucesso aos 6 meses é:

- [ ] 4+ jogos publicados e avaliados com critério objetivo
- [ ] Pelo menos 1 saque DevEx concluído (o cano inteiro provado)
- [ ] Sabermos ler e agir sobre métricas de retenção e de descoberta
- [ ] Um pipeline de produção que roda sem improviso

Se atingirmos isso com 4 jogos mortos e $300 sacados, **isso é vitória**, não fracasso. O ativo construído é o processo, não o jogo.

### 1.4 Honestidade brutal sobre o teto

Os top 1.000 criadores do Roblox fizeram em média **$1,3M em 2025**. Depois dessa faixa, a curva de ganhos cai de penhasco. A imensa maioria das experiências publicadas ganha praticamente nada.

Renda que sustenta duas pessoas nos EUA vindo de Roblox nos coloca numa faixa muito estreita da plataforma. Este plano só é racional se tratado como **portfólio de apostas baratas com aprendizado composto** — nunca como emprego garantido.

---

## §2 — A realidade econômica e o mercado

*Números verificados em 2026-07-27. Roblox muda regras com frequência — revalidar a cada trimestre (§14.3).*

### 2.1 Taxas DevEx vigentes

| Item | Valor |
|---|---|
| Taxa padrão | **$0,0038 por Robux ganho** |
| Mínimo para saque | **30.000 Robux ganhos** |
| Roblox Premium | **Obrigatório** (~$13,99/mês) |
| Frequência de saque | 1x por mês-calendário |
| Prazo de processamento | 30–45 dias |
| Rail de pagamento | Tipalti / PayPal |

### 2.2 A cadeia de valor real

O jogador paga $9,99 e recebe ~800 Robux. Se ele gasta esses 800 Robux no nosso jogo:

```
Jogador paga            $9,99
  → 800 Robux
  → Roblox retém 30%    (taxa de marketplace)
  → Nós recebemos       560 Robux ganhos
  → × $0,0038 DevEx
  → NOSSO BRUTO         ≈ $2,13
  → menos imposto US    (§5.4)
```

**Ficamos com aproximadamente 21–25% do que o jogador gastou.** Todo cálculo de meta parte disso.

### 2.3 Metas escalonadas

| Marco | Robux ganhos/mês | Gasto real dos jogadores/mês | Significado |
|---|---|---|---|
| **M0 — Primeiro saque** | 30.000 (acumulado) ≈ **$114** | ~$430 | O cano funciona ponta a ponta |
| **M1 — Prova de repetição** | ~130.000/mês ≈ **$500/mês** | ~$1.900 | Não foi sorte |
| **M2 — Renda relevante** | ~237.000/mês ≈ **$900/mês** | ~$4.200 | Meio salário real, dividido em dois |
| **M3 — Sustento** | ~790.000/mês ≈ **$3.000/mês** | ~$14.000 | Requer jogo com dezenas de milhares de ativos |

**M0 é a única meta que importa agora.** Tudo depois é escala de um cano já provado. Perseguir M2 antes de bater M0 é fantasiar.

### 2.4 Público-alvo: infantil e jovem — decisão fechada

O público-alvo é **infantil e jovem**, por ser onde está o volume da plataforma.

Consequência direta: **a taxa DevEx majorada de 18+ está fora do escopo.** Ela existe ($0,0054 para jogadores US verificados 18+ em experiências R15), mas atende um nicho pequeno e incompatível com a nossa escolha. Só volta à mesa se o público infantil provar ter teto baixo para nós (§16).

### 2.5 O gargalo real não é código

O produto não é o jogo. O produto é **ser descoberto**.

O algoritmo do Roblox em 2026 prioriza **retenção de longo prazo**, e existe a seção "Standout Games" na home. O funil é:

```
Ícone + Thumbnail + Título  →  CTR
        ↓
   Primeiros 60 segundos     →  não churnar
        ↓
       D1 / D7               →  o algoritmo distribui
        ↓
        Visitas              →  monetização
```

**Consequências que valem como regra:**

1. Se o ícone e a thumbnail não estiverem prontos e testados, **o jogo não lança**
2. **Gabriel constrói o produto; Gustavo determina se alguém joga.** As duas metades têm peso equivalente — a de descoberta possivelmente maior

### 2.6 Conformidade com público infantil

Escolher o público infantil traz obrigações que não são opcionais:

- **COPPA (EUA)** — a Roblox absorve a maior parte dentro da plataforma. Mas se criarmos canal próprio (Discord, newsletter, qualquer coleta de dado) com menores de 13, a responsabilidade passa a ser nossa
- **Moderação da Roblox é severa** com conteúdo voltado a criança. Uma violação pode derrubar o jogo **e** a conta que recebe o dinheiro
- **Design de monetização** — mecânicas de pressão de compra voltadas a criança sofrem escrutínio crescente de plataforma e regulador. Isso não é só ética: é risco de takedown e desconto no valuation num exit

---

## §3 — Papéis, divisão de trabalho e equilíbrio

### 3.1 O que "equilibrado" significa aqui

Equilíbrio **não é** horas iguais nem tarefas iguais. Gabriel tem dias; Gustavo tem noites. Igualar horas destruiria capacidade para produzir simetria estética. Fazer os dois um pouco de tudo criaria dependência mútua e ninguém ficaria bom em nada.

Equilíbrio, neste contrato, significa três coisas:

1. **Alavancagem** — cada um é dono de trabalho que decide o resultado, não de sobras
2. **Esforço relativo** — proporção da capacidade *disponível* de cada um, não horas absolutas
3. **Autonomia** — cada um decide sozinho no seu domínio, ou vira chefe e funcionário

### 3.2 Regra do caminho crítico

> **Gustavo nunca está no caminho crítico. Gabriel nunca espera aprovação para continuar.**

Trabalho do Gustavo é **assíncrono e empacotável** — feito em blocos noturnos, entregue em lote, e sua ausência num dia não trava ninguém.

### 3.3 Divisão de domínios

#### Gabriel — Produto & Tecnologia

| Domínio | Decide |
|---|---|
| Arquitetura e código Luau | Sozinho |
| IA, prompts e pipeline técnico | Sozinho |
| Segurança (§7.3) | Sozinho |
| DataStore e persistência | Sozinho |
| Dashboard e infraestrutura | Sozinho |
| Publicação e monetização técnica | Sozinho |

**Métricas dele:** sistema funcionando · zero brecha de exploit · build dentro do teto de 3 semanas
**Ritmo:** contínuo, blocos longos

#### Gustavo — Growth & Mercado

| Domínio | Decide |
|---|---|
| Ícone, thumbnail, título | Sozinho |
| Descrição e tags | Sozinho |
| Vídeo: roteiro, gravação, edição, postagem (TikTok/Shorts) | Sozinho |
| Pesquisa de gênero e tendência (Fase 0) | Sozinho |
| Playtest e relatório de fricção | Sozinho |
| Comunidade | Sozinho |
| **Orçamento de anúncios ($50/mês)** | Sozinho |

**Métricas dele:** CTR · visitantes únicos · alcance dos vídeos
**Ritmo:** assíncrono, noites, lotes

#### Consenso obrigatório

- Escolha do próximo projeto
- Fase 1 (definição do jogo)
- Veredito da Fase 5
- Emendas a esta Constituição
- Divisão de receita (§4.2)

"Decide sozinho" significa: **o outro pode discordar, mas não pode bloquear.** Discordância vira nota no log, não vira reunião.

### 3.4 Os quatro mecanismos de equilíbrio

**1. Índice de esforço relativo**
No início de cada ciclo, cada um declara sua capacidade real daquela semana. O dashboard mostra **realizado ÷ declarado** — nunca horas absolutas.

> Gustavo declara 10h, entrega 9 → **90%**
> Gabriel declara 30h, entrega 24 → **80%**

Gustavo performou melhor com um terço das horas. **Esta é a comparação honesta**, e é ela que alimenta a conversa de divisão de receita — não a soma bruta de horas.

**2. Cota mínima por ciclo**
Propositalmente modesta. Cota alta gera culpa e abandono.

| Gabriel | Gustavo |
|---|---|
| 1 marco funcional entregue | 3 vídeos postados |
| Checklist §7.3 aplicada ao que construiu | 1 lote de arte (1 ícone ou 3 thumbnails) |
| Métricas atualizadas no dashboard | 1 pesquisa ou relatório de playtest |

**3. Regra de não-invasão**

> **Nenhum dos dois assume o domínio do outro em silêncio, mesmo quando for mais rápido fazer sozinho.**

**Ajuda é permitida quando pedida e registrada.** Quem é dono do domínio pede; o outro ajuda; a ajuda entra no log como sessão naquele projeto. O que está proibido é a absorção silenciosa.

A distinção importa porque *ajudar* e *absorver* começam idênticos. Você faz a thumbnail "só dessa vez" porque é mais rápido, repete três vezes, e em dois meses o dono do domínio virou espectador. Ele não reclama — apenas desaparece aos poucos. O registro é o que separa uma coisa da outra.

O risco do Gabriel não é preguiça — é o oposto: fazer tudo porque é mais rápido que esperar. Vale nos dois sentidos.

**4. Protocolo de desequilíbrio**
Se alguém ficar abaixo da cota por **3 ciclos seguidos**, isso não vira cobrança — vira **redução de escopo** para aquela pessoa. Ajustar carga à realidade é saudável; acumular ressentimento em silêncio quebra sociedades entre irmãos.

**Nota sobre habilidade:** edição de vídeo é uma habilidade, não uma tarefa. Se após 2 ciclos os vídeos não performarem, isso é **dado**, não fracasso pessoal. Opções: aprender, terceirizar barato, ou mudar de canal. Registrado aqui para que não vire assunto delicado depois.

### 3.5 Resolução de impasse

1. Cada um escreve sua posição em 5 linhas no log do projeto
2. Impasse persistindo em 48h → **decide o dono do domínio mais próximo do assunto**
3. Sem dono claro → decide quem tem mais pele em jogo naquele projeto
4. A decisão é registrada com data e quem cedeu

**Nunca deixamos impasse aberto além de 48h.** Impasse aberto é o projeto parado.

### 3.6 Cadência

- **Ciclo = 7 dias.** Começa com declaração de capacidade, termina com fechamento e análise
- **1 sync por semana**, 30 minutos, dia fixo, no fechamento do ciclo
- Entre ciclos, comunicação é assíncrona e registrada no dashboard

---

## §4 — Governança financeira e o Dashboard

### 4.1 Propriedade

Todos os jogos pertencem a um **Roblox Group** (GTL Gamer), nunca a uma conta pessoal.

Razão: DevEx é por conta individual. Group com payouts configurados torna a divisão explícita e auditável dentro da própria plataforma — e é o que um comprador vai querer ver num exit (§11.5).

**Ação obrigatória antes do primeiro jogo publicado:** criar o Group e adicionar ambos.

### 4.2 Divisão de receita — decisão adiada COM TRAVAS

A porcentagem final será definida com dados reais dos primeiros ciclos, usando o **índice de esforço relativo** (§3.4) como base — não a soma bruta de horas.

| Trava | Regra |
|---|---|
| **Default** | Se nada for decidido, vale **50/50**. A ausência de decisão nunca favorece automaticamente ninguém |
| **Prazo** | Definida no **primeiro saque DevEx** ou em **2026-10-25** — o que vier primeiro |
| **Revisão** | Trimestral, com data marcada. Sem convocação, mantém-se a vigente |
| **Retroatividade** | Mudanças valem para frente. Nunca se recalcula dinheiro já dividido |

### 4.3 O Dashboard

**Stack:** Supabase (banco) + web app. Projeto `GTL Gamer`.

**Princípio de design:**

> **O dashboard não é registro passivo. É a Constituição executável.**

Se ele só guardar o que digitamos, é uma planilha cara. O valor está em **empurrar as regras**: avisar quando o teto de 3 semanas está estourando, fechar a janela de observação, calcular o veredito pelos gates, e exigir justificativa para avançar de fase com checklist incompleta.

**O loop de operação:**

```
   Claude → cria as tarefas do ciclo (via conector Supabase)
        ↓
   Dashboard → cada um vê as suas
        ↓
   Gabriel e Gustavo → executam, marcam, escrevem o RESULTADO
        ↓
   Claude → lê o ciclo, analisa, gera o próximo
```

**Regras de disciplina, aplicadas pelo banco:**

- Tarefa só fecha com o campo `resultado` preenchido
- Sessão de trabalho só é registrada com `entrega` descrita
- "Trabalhei no jogo" não é entrega. Entrega é artefato verificável

**Perfis:** cada sócio tem perfil com seus domínios, métricas-chave e cotas visíveis.

**Fora do v1** (Camada A): módulo de cálculo de pagamento por pessoa, analytics avançado, ingestão automática via Roblox Open Cloud, módulo de exit. Todos no §16.

### 4.4 Segurança do dashboard — INEGOCIÁVEL

**As duas classes de chave:**

| Chave | Onde pode estar | Poder |
|---|---|---|
| `sb_publishable_...` | Frontend, web app, código público | Baixo — respeita RLS |
| `sb_secret_...` | **Apenas servidor / Edge Function** | Total — ignora RLS |
| `anon` / `service_role` *(legacy)* | Desativadas | Versões antigas das duas acima |

**Regras:**

- A chave secreta **NUNCA entra no web app**. Se estiver no JavaScript, qualquer visitante lê e apaga o banco inteiro
- O frontend usa **somente a publishable key** + políticas RLS
- As novas chaves **não são JWT**: vão no header `apikey`, nunca em `Authorization: Bearer`
- Nenhuma chave é colada em chat, commit, print ou mensagem
- RLS habilitado em todas as tabelas, restrita a contas vinculadas a um perfil

**Se uma chave vazar:** legacy keys (`anon`/`service_role`) **não podem mais ser rotacionadas** — a rotação delas dependia do JWT secret, hoje descontinuada. O caminho é **substituir**: criar novas chaves em *Settings → API Keys → Publishable and secret API keys*, trocar nos consumidores, e desativar as legacy na aba *Legacy anon, service_role API keys*. Desativar é reversível. Legacy funcionam até o fim de 2026.

### 4.5 Fluxo do dinheiro

1. Robux acumula no Group
2. Ao atingir 30.000+ Robux ganhos → solicitar DevEx (1x/mês)
3. Recebimento via Tipalti/PayPal em 30–45 dias
4. **Separar imediatamente ~30% para imposto** (§5.4)
5. Do restante: **50% reinveste**, **50% divide** conforme §4.2
6. Registrar tudo. Nenhum saque sem registro

---

## §5 — Estrutura operacional e legal

### 5.1 Checklist de habilitação

- [x] Ambos 18+ com documento
- [x] Capacidade de pagar Roblox Premium ($13,99/mês)
- [x] PC capaz de rodar Studio + ferramentas de IA
- [x] Nome do estúdio: **GTL Gamer**
- [x] Projeto Supabase criado
- [ ] Roblox Group criado
- [ ] Premium ativo na conta DevEx
- [ ] Verificação de identidade concluída
- [ ] Método de pagamento configurado

### 5.2 Custos fixos mensais

| Item | Custo |
|---|---|
| Roblox Premium | $13,99 |
| **Anúncios** | **$50 (mínimo definido)** |
| Supabase | $0 (tier gratuito) |
| Ferramentas de IA | *a definir (§13 P4)* |
| **Total base** | **~$64/mês** |

O orçamento de anúncios é gerido pelo Gustavo e existe porque **sem distribuição os gates do §6.1 não têm significado** — todo projeto falharia por falta de tráfego, não por falta de qualidade.

### 5.3 Não é aconselhamento jurídico

Este documento é um **acordo interno entre irmãos**, não instrumento legal. Se a receita passar de alguns milhares de dólares, vale formalizar (LLC ou partnership agreement) com um profissional.

### 5.4 Impostos (EUA)

Renda de DevEx é **self-employment income**. Provável 1099 via Tipalti.

- Separar **~25–30% de cada saque** antes de dividir qualquer coisa
- Registrar todas as despesas dedutíveis (Premium, ferramentas, assets, anúncios, hardware)
- Consultar um CPA antes do primeiro ano fiscal com receita relevante

Isto não é aconselhamento tributário.

### 5.5 Estrutura de recebimento e linha do tempo desacoplada

A conta e o DevEx ficam no nome do **Gustavo**, que possui SSN e autorização de trabalho. A situação documental do **Gabriel** está pendente.

**Linha do tempo desacoplada:**

```
Hoje ──────────► #01 no ar ────────► 30.000 Robux ────────► 1º saque
     3-6 semanas          semanas a meses         30-45 dias
```

- **Linha 1 — construir, aprender, publicar, medir:** começa hoje, sem travas
- **Linha 2 — monetização e divisão:** resolve no primeiro saque, ou quando a documentação do Gabriel sair, ou com orientação profissional — o que vier primeiro

A questão do dinheiro só fica viva no **M0**, que está a vários meses daqui. É plausível que a documentação saia antes disso.

**Pendência P6:** consulta com profissional de imigração antes de qualquer valor ser recebido ou dividido. A estrutura correta depende do status exato e não é decidível sem orientação. **Não recorremos a arranjos informais desenhados para não deixar rastro** — além do risco próprio, isso destrói valor num exit, onde due diligence de propriedade intelectual pergunta quem construiu o quê e sob qual vínculo.

---

## §6 — Pipeline de produção

Todo projeto passa por 6 fases. Nenhuma é pulada.

### Fase 0 — Research *(Gustavo · 2–4 dias)*

- 3 gêneros/mecânicas em alta com sinal de tração recente
- Para cada: jogadores ativos, há quanto tempo, saturação
- **Por que aquele jogo retém** — não o que ele tem, mas o que faz o jogador voltar
- 10 referências de ícone/thumbnail do nicho

**Gate:** os dois concordam com o alvo.

### Fase 1 — Definição *(Ambos · 1 dia · teto rígido)*

- Uma frase descrevendo o jogo
- **Core loop** em no máximo 3 passos
- **Uma** alteração em relação ao clone base — só uma
- Modelo de monetização definido *antes* do código
- **Título, ícone e thumbnail rascunhados AGORA** — se não conseguimos criar uma thumbnail atraente para essa ideia, a ideia está morta antes de nascer

**Gate:** passou de 1 dia → a ideia é complexa demais. Volta pro backlog.

### Fase 2 — Build *(Gabriel · teto de 3 semanas)*

- Core loop funcional primeiro. Nada mais
- Checklist de segurança (§7.3) em toda lógica de economia
- Save/DataStore testado contra perda de dados
- Monetização implementada e testada com compra real
- **Nenhuma feature nova depois da semana 2**

**Gate:** passou de 3 semanas → mata ou lança incompleto. Nunca estende.

### Fase 3 — Polimento de conversão *(Gustavo · 3–5 dias)*

- 3 variações de ícone, 3 de thumbnail, 2 de título
- Descrição e tags otimizadas
- Primeiros 60 segundos revisados obsessivamente — é onde o churn acontece
- Playtest com 3+ pessoas de fora, com relatório escrito
- **Vídeos de lançamento prontos antes do lançamento**

### Fase 4 — Lançamento e observação *(14 dias)*

- Publicar
- Ligar os $50 de tráfego pago de forma controlada
- Postar vídeos em TikTok/Shorts durante toda a janela
- Medir: CTR, visitantes únicos, D1, sessão média, CCU pico
- Testar variações de ícone/thumbnail durante a janela
- **Não adicionar features.** Só correção de bug crítico

### Fase 5 — Veredito *(Ambos · 1 dia)*

Aplicar os gates do §6.1. Post-mortem obrigatório **mesmo quando dói** — sem ele o portfólio não gera aprendizado composto e a estratégia inteira perde o sentido.

### 6.1 Gates e kill criteria

**Passo 1 — Gate de amostra mínima**

```
Visitantes únicos na janela de 14 dias ≥ 500 ?
  ├─ NÃO → veredito = "PROBLEMA DE DESCOBERTA"
  │        NÃO mata o jogo.
  │        Ação: atacar thumbnail, título, vídeo, tráfego
  │
  └─ SIM → aplica os gates de qualidade abaixo
```

Sem este passo, todo projeto falharia por falta de tráfego e concluiríamos "não sabemos fazer jogo" quando o problema é "ninguém viu". **"Ninguém clicou" e "clicaram e não voltaram" pedem ações opostas.**

**Passo 2 — Gates de qualidade** *(só se amostra ≥ 500)*

| Métrica | Gate |
|---|---|
| D1 retention | ≥ 12% |
| Sessão média | ≥ 6 min |
| CCU pico | ≥ 25 |

**Falhou em 2 dos 3 → arquiva** (veredito = problema de produto).

**Tetos de tempo**

| Item | Teto |
|---|---|
| Fase 1 | 1 dia |
| Fase 2 (build) | 3 semanas |
| Janela de observação | 14 dias |
| Projeto parado sem atividade | 7 dias → alerta |

> **Proibido mexer nos gates durante a janela de observação de um projeto em avaliação.** Isso é a definição de trapacear consigo mesmo. Recalibração só via §14 e §16.

---

## §7 — Regras de vibe coding

### 7.1 O que a IA faz

Escreve a maior parte do Luau · explica conceitos · gera boilerplate e UI · debuga · revisa código próprio quando pedido.

### 7.2 O que a IA NUNCA decide sozinha

- **Se um jogo vive ou morre** — isso é §6
- **Escopo** — a IA sempre sugere mais features. Sempre. É o vetor #1 de scope creep
- **Arquitetura de segurança** — validar contra §7.3
- **O que é "bom o suficiente"** — a métrica decide

### 7.3 Checklist de segurança — INEGOCIÁVEL

Código Luau gerado por IA **confia no cliente por padrão**. No Roblox isso é fatal: exploiters destroem a economia em dias e não descobrimos até ser tarde.

Antes de qualquer publicação:

- [ ] **Toda** lógica de moeda, economia e progressão roda **no servidor**
- [ ] Nenhum `RemoteEvent` confia em valores do cliente sem validação
- [ ] Cliente nunca informa quanto ganhou, quanto tem, ou o que comprou
- [ ] Servidor valida se o jogador *pode* agir (distância, cooldown, posse, estado)
- [ ] Rate limiting em todo RemoteEvent que altera estado
- [ ] Nada sensível em `ReplicatedStorage`
- [ ] DataStore com retry e tratamento de falha
- [ ] Teste manual: tentar quebrar a própria economia antes de publicar
- [ ] **Nenhuma chave secreta no código do cliente** (§4.4)

**Checklist incompleta = não publica.** Sem exceção, sem "depois eu arrumo".

### 7.4 Piso técnico do Gabriel

Vibe coding funciona, mas exige capacidade de **auditar**. Três conceitos obrigatórios antes da Fase 2 do projeto #01:

1. O que roda no **cliente** vs. no **servidor**, e por que isso importa
2. Como um `RemoteEvent` pode ser explorado
3. Como DataStore falha e perde save

São conceitos, não sintaxe. Algumas horas, não um curso. O resto se aprende conforme o projeto exige.

### 7.5 Higiene de código

- Um sistema por módulo. Arquivos gigantes destroem a capacidade da IA de ajudar
- Comentar **por que**, não o que
- Testar cada sistema isolado antes de integrar
- Nunca colar código de IA sem entender o que ele faz com **dinheiro ou dados salvos**

---

## §8 — Assets, 3D e performance

### 8.1 A verdade sobre 3D gerado por IA

Não é plug-and-play. Modelos gerados costumam ter topologia ruim (não-manifold, faces invertidas), UVs quebradas e polígonos demais. Roblox impõe limites de triângulos por mesh e modera todo upload.

### 8.2 Ordem de preferência

1. **Biblioteca / Toolbox do Roblox** — rápido, otimizado, já moderado
2. **Primitivas do Studio em low-poly** — combina com a estética da plataforma
3. **Assets comprados** — quando houver caixa
4. **Gerado por IA** — só quando 1–3 falharem, com limpeza manual antes do upload

**Estética alvo: low-poly / estilizado.** Não é limitação — é o que o público espera e o que roda em dispositivo fraco.

### 8.3 Performance é retenção

Grande parte da base do Roblox é mobile. Jogo que trava em celular fraco perde o jogador em 30 segundos e mata o D1. **Testar sempre em configuração baixa antes de lançar.**

---

## §9 — Fila de ideias originais

Ideia original antes do primeiro saque é procrastinação disfarçada de ambição. Sem dados de retenção e sem habilidade técnica, é aposta cega com nosso recurso mais escasso.

**Regra da fila:**

- Toda ideia original vai para `IDEAS.md` — **nada é descartado**
- Uma ideia só vira projeto quando **um clone nosso já passou nos gates do §6.1**
- Cada clone aprovado desbloqueia **um** slot para ideia original

> **A criatividade é recompensa por competência provada, não ponto de partida.**

---

## §10 — Protocolo Anti-Loop ∞

O Loop ∞ é o modo de falha mais provável: analisar, planejar, refinar — sem enviar nada ao mundo.

### 10.1 Sinais de alerta

- Buscar uma terceira opção com duas viáveis na mesa
- Refazer o que já funciona
- Adicionar escopo a projeto ainda não medido
- Discutir o mesmo ponto pela terceira vez sem decidir
- Construir ferramenta interna antes do problema existir
- Aprender tecnologia desnecessária ao projeto atual

### 10.2 Intervenção

Qualquer um pode declarar `∞`. Ao ser declarado:

1. A discussão para
2. Reduz-se a **2 opções**
3. Escolhe-se uma em **até 24h**
4. Define-se a próxima ação de **20 minutos**
5. Registra-se no dashboard

**Declarar `∞` não é ofensa. É favor.**

### 10.3 Regras rígidas

- **Publicar imperfeito vence não publicar.** Jogo medíocre no ar gera dados; jogo perfeito no Studio gera zero
- **Nenhuma ferramenta interna NOVA antes do jogo #3.** *Exceção única e nomeada: o dashboard, Camada A, time-box de 1 semana, no ar antes do projeto #01 entrar em Fase 2. O que não couber vira §16*
- **Nenhum estudo formal antes do primeiro saque** — exceto o piso do §7.4
- **Um projeto ativo por vez.** Sempre

---

## §11 — Portfólio e exit

### 11.1 Log de projetos

Mantido no dashboard (tabela `projetos` + `veredictos`). Nenhum projeto é encerrado sem veredito registrado e post-mortem escrito.

### 11.5 Exit / aquisição

Existe mercado para venda de experiências Roblox — brokers e estúdios compram. Isso é um objetivo declarado do GTL Gamer.

**Pendente de verificação (P7):** o que os ToS atuais da Roblox permitem em transferência de experiência ou de Group. Venda de *conta* é proibida; a linha entre as duas coisas precisa ser confirmada antes de qualquer negociação.

**O que um comprador exige — e por isso o dashboard existe desde o dia 1:**

| Exigência | Onde vive |
|---|---|
| Histórico de receita limpo e verificável | `metricas` + registro de saques |
| Curvas de retenção e engajamento | `metricas` |
| Titularidade de IP sem ambiguidade | Group + §5.5 + §4.2 |
| Histórico de desenvolvimento | `fases_log` + `sessoes` + `tarefas` |

**Due diligence readiness não é feature futura — é consequência de registrar direito desde o começo.**

---

## §12 — Primeiros passos (ordem exata)

### Ciclo 01 — dias 1 a 7

| # | Quem | Ação |
|---|---|---|
| 1 | Gustavo | Criar o Roblox Group **GTL Gamer** com ambos dentro |
| 2 | Gustavo | Ativar Roblox Premium e **iniciar verificação de identidade** (demora — começa já) |
| 3 | Gabriel | Instalar Studio e **publicar um jogo trivial ponta a ponta**, com uma compra real testada |
| 4 | Gabriel | Rotacionar a chave `service_role` do Supabase |
| 5 | Gustavo | Abrir TikTok e YouTube do estúdio e **começar a postar mesmo sem jogo** (conta nova tem alcance ruim; começar cedo é de graça) |
| 6 | Gustavo | **Fase 0** do projeto #01 — 3 gêneros + 10 referências de thumbnail |
| 7 | Gabriel | Estudar os 3 conceitos do §7.4 |
| 8 | Gabriel | Construir o **Dashboard Camada A** (time-box) |

> O item **3** é o mais valioso da lista. Custa uma tarde e converte esta Constituição inteira de teoria em fato. Descobrir travas de moderação, verificação ou publicação num jogo trivial custa horas; descobrir na semana 3 do projeto #01 custa o momentum inteiro.

### Ciclo 02 — dias 8 a 14

Projeto #01 — Fase 1 (definição, teto de 1 dia) e início da Fase 2.

---

## §13 — Decisões pendentes

| # | Decisão | Prazo | Default |
|---|---|---|---|
| ~~P1~~ | ~~Nome do estúdio~~ | ✅ | **GTL Gamer** |
| ~~P2~~ | ~~Orçamento de anúncios~~ | ✅ | **$50/mês** |
| P3 | **Divisão de receita** | 1º saque ou 2026-10-25 | **50/50** |
| P4 | Ferramentas de IA e custo mensal | Antes da Fase 2 do #01 | Apenas gratuitas |
| P5 | Camada B do dashboard | Após #01 na Fase 5 | Adiado |
| P6 | **Consulta profissional (imigração)** | Antes de qualquer valor recebido | Adiar monetização |
| P7 | ToS da Roblox sobre venda/transferência | Antes de qualquer negociação | Não negociar |

---

## §14 — Emendas e manutenção

### 14.1 Como emendar

1. Quem propõe escreve a mudança e o **porquê**
2. O outro concorda ou aplica §3.5
3. Edita-se o documento e registra-se no changelog
4. Sobe-se a versão

### 14.2 O que NÃO pode ser emendado no calor do momento

- Gates do §6.1 enquanto houver projeto em janela de observação
- Divisão de receita retroativamente
- Checklist de segurança (§7.3)
- Regra da `service_role` (§4.4)

### 14.3 Revisão obrigatória

- **Semanal** — fechamento de ciclo, 30 min, dia fixo
- **Mensal** — leitura completa deste documento pelos dois
- **Trimestral** — revalidar taxas e regras do Roblox (§2), revisar split (§4.2), varrer o §16

Documento não lido é documento morto.

---

## §15 — Changelog

| Versão | Data | Mudança |
|---|---|---|
| 1.0 | 2026-07-27 | Criação. Tese, economia, papéis, governança, pipeline, gates, regras de IA, anti-loop |
| **1.1** | 2026-07-27 | Nome GTL Gamer. Público infantil fechado e alavanca 18+ removida (§2.4). Conformidade infantil (§2.6). **Gate de amostra mínima** (§6.1). Divisão de trabalho equilibrada + 4 mecanismos de justiça (§3). Gustavo promovido a Growth. Orçamento de $50/mês. Dashboard Supabase + loop de operação (§4.3). Segurança de chaves (§4.4). Estrutura de recebimento e linha do tempo desacoplada (§5.5). Piso técnico (§7.4). Exceção do §10.3. Exit (§11.5). Ciclo de 7 dias. **§16 Backlog de Recalibração** |

---

## §16 — Backlog de Recalibração

**Tudo que só pode ser decidido com dados vive aqui, para não ser esquecido.**

| # | O que revisar | Gatilho | Por quê |
|---|---|---|---|
| R1 | Números dos gates (D1 / sessão / CCU) | Após 3 projetos completos | Heurísticas iniciais vindas de fora; precisam virar nossos números |
| R2 | Limiar de 500 visitantes únicos | Após 1º projeto com tráfego real | Chutamos o piso de significância estatística |
| R3 | Cotas mínimas por ciclo (§3.4) | Após 3 ciclos | Calibrar com capacidade real, não estimada |
| R4 | Divisão de receita | 1º saque ou 2026-10-25 | Trava do §4.2 |
| R5 | Dashboard Camada B (analytics, gráficos, financeiro) | Após #01 na Fase 5 | Schema só fica certo depois de um projeto rodar o pipeline inteiro |
| R6 | Ingestão automática via Roblox Open Cloud | Após 1º jogo com tráfego estável | Impossível testar sem jogo publicado |
| R7 | Orçamento de anúncios ($50) | Após ver o alcance orgânico real | Pode subir se converter, ou cair se o orgânico bastar |
| R8 | Taxas e regras do DevEx | Trimestral | Roblox muda com frequência |
| R9 | ToS sobre venda/transferência de experiência | Antes de qualquer negociação | P7 |
| R10 | Público 18+ | Só se o infantil provar teto baixo | §2.4 |
| R11 | Canal de distribuição (TikTok/Shorts) | Após 2 ciclos de vídeo | Se não performar: aprender, terceirizar ou trocar de canal |
| R12 | Módulo de exit / due diligence pack | Ao receber a primeira oferta real | §11.5 |

---

*Este documento existe para nos proteger de nós mesmos: do otimismo que ignora a matemática, do perfeccionismo que impede o lançamento, e do silêncio sobre dinheiro que destrói relações entre irmãos.*
