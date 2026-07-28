# GTL Gamer

Repositório do estúdio. Contém o contrato (`CONSTITUICAO.md`), a fila de ideias (`IDEAS.md`) e o painel interno (`dashboard/`).

```
GTL-Gamer/
├── CONSTITUICAO.md    contrato interno — fonte única da verdade
├── IDEAS.md           fila de ideias originais (§9)
├── Dockerfile         build do dashboard (contexto = raiz)
└── dashboard/         o app
```

## O dashboard

Painel interno do estúdio. Implementa a `CONSTITUICAO.md` — não é registro passivo, é a Constituição executável: o banco recusa tarefa sem resultado, o app avisa quando o teto de build estoura, e o veredito aplica o gate de amostra antes dos gates de qualidade.

**Stack:** Vite + React + TypeScript + Tailwind + Supabase
**Deploy:** Docker (nginx) no Easypanel

---

## 1. Antes de qualquer coisa: as chaves

**Constituição §4.4.** Tudo que começa com `VITE_` é embutido no JavaScript que vai para o navegador. Qualquer visitante lê.

| Chave | Pode ir no frontend? |
|---|---|
| `sb_publishable_...` | ✅ Sim — foi feita para ser pública |
| `sb_secret_...` | ❌ **Nunca** — acesso total ao banco |
| `service_role` (legacy) | ❌ **Nunca** |

O arquivo `src/lib/supabase.ts` tem uma trava: se detectar chave secreta, o app quebra na hora com uma mensagem explícita. Melhor quebrar alto do que vazar em silêncio.

### Criar as chaves novas

O Supabase **não permite mais rotacionar** as legacy (`anon`/`service_role`). O caminho é substituir:

1. Dashboard → **Project Settings → API Keys** → aba **"Publishable and secret API keys"**
2. **Create new API keys**
3. Volte na aba **"Legacy anon, service_role API keys"** e **desative** as duas

---

## 2. Criar as contas e vincular aos perfis

O RLS usa a função `eh_socio()`: só quem tem `perfis.user_id` ligado a uma conta enxerga qualquer coisa. Quem criar conta sem vínculo loga e não vê nada.

1. Supabase → **Authentication → Users → Add user** → criar as contas do Gabriel e do Gustavo (e-mail + senha, marcar como confirmado)
2. Supabase → **Authentication → Sign In / Providers** → **desativar** "Allow new users to sign up"
3. Supabase → **SQL Editor** → vincular:

```sql
update perfis set user_id = 'UUID-DO-GABRIEL' where nome = 'Gabriel';
update perfis set user_id = 'UUID-DO-GUSTAVO' where nome = 'Gustavo';
```

Os UUIDs aparecem na lista de usuários. Se errar, o app mostra o comando exato com o UUID certo ao logar.

---

## 3. Rodar local (desenvolvimento)

```bash
cd dashboard
cp .env.example .env      # preencha a publishable key
npm install
npm run dev
```

Abre em `http://localhost:5173`. Como `host: true` está ligado no Vite, o terminal também mostra um endereço de rede (`http://192.168.x.x:5173`) que funciona no celular na mesma Wi-Fi — útil para testar o layout mobile.

Outros comandos:

```bash
npm run build     # checa tipos e gera dist/
npm run preview   # serve o dist localmente
npm run tipos     # regenera os tipos a partir do schema real
```

---

## 4. Deploy no Easypanel

### 4.1 Subir para o GitHub

O repositório já está iniciado na raiz do `GTL-Gamer`, com dois commits. Falta só apontar para o GitHub:

```bash
cd /Volumes/KrawllierSSD/Dev/00_ACTIVE/GTL-Gamer
git remote add origin git@github.com:SEU-USUARIO/gtl-games.git
git push -u origin main
```

Crie o repositório vazio em github.com/new — **sem** README, `.gitignore` ou licença, senão o primeiro push dá conflito.

Se o SSH falhar, troque para `https://github.com/SEU-USUARIO/gtl-games.git`.

### 4.2 Criar o serviço

1. Easypanel → **Create Service → App**
2. **Source:** GitHub → selecione o repositório e a branch `main`
   - Se o repo for privado, use o Deploy Key SSH que o Easypanel gera e cole em *Settings → Deploy keys* no GitHub
3. **Build:** método **Dockerfile**

**Importante:** deixe o **Build Path** na raiz (`/`), não em `/dashboard`. O `Dockerfile` fica na raiz de propósito — ele precisa enxergar a `CONSTITUICAO.md`, que é embutida no bundle para aparecer na tela "Regras". Se apontar o contexto para `/dashboard`, o build falha ao copiar a Constituição.

### 4.3 Variáveis — o passo que quase todo mundo erra

As variáveis `VITE_` são embutidas **durante o build**, não em tempo de execução. Colocá-las só em "Environment" não basta em algumas configurações — elas precisam chegar ao `docker build` como **build args**.

No Easypanel, em **Environment**, defina:

```
VITE_SUPABASE_URL=https://aqkuxvfbpubktbyuoydh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

O `Dockerfile` já declara os dois `ARG` correspondentes. Se depois do deploy o app quebrar reclamando de variável faltando, é aqui que está o problema — verifique se os build args estão sendo passados.

### 4.4 Rede e domínio

- **Porta:** `80` (o nginx escuta nela)
- **Domain:** aponte o subdomínio e ative HTTPS (Let's Encrypt)

Deploys seguintes: `git push` e o Easypanel reconstrói. O Gustavo nunca atualiza nada — abre o link e está na versão atual.

---

## 4.5 A sugestão de IA no Novo Projeto

No formulário de novo projeto, depois de preencher **nome** e **gênero base**, o botão "Sugerir com IA" rascunha os outros quatro campos (uma frase, core loop, alteração única, monetização) para os dois analisarem antes de criar. Ela **não grava nada** — só preenche a tela.

A chamada vai para a Edge Function `sugerir-projeto`, que fala com o OpenRouter. **A chave nunca passa pelo navegador** (§4.4): se estivesse no `VITE_`, qualquer visitante leria e gastaria os créditos.

**Configurar a chave** (uma vez, no Supabase Dashboard → Edge Functions → Secrets):

```
OPENROUTER_API_KEY=sk-or-v1-...
```

Pegue em [openrouter.ai/keys](https://openrouter.ai/keys). Sem esse secret a função responde com um erro claro em vez de quebrar.

**Trocar de modelo** sem mexer no código — adicione outro secret:

```
OPENROUTER_MODEL=openai/gpt-4o
```

Esse é o default — custa meio centavo por sugestão ($2,50/M tokens de entrada, $10/M de saída). Se quiser mais barato, `google/gemini-2.5-flash` sai por ~1/8 disso e seguiu as regras igualmente bem no teste. Confira em [openrouter.ai/models](https://openrouter.ai/models) se o slug ainda existe antes de trocar — modelo aposentado devolve `404 No endpoints found`.

Redeploy da função depois de editar `supabase/functions/sugerir-projeto/index.ts`:

```bash
npx supabase functions deploy sugerir-projeto --project-ref aqkuxvfbpubktbyuoydh
```

---

## 5. Estrutura

```
supabase/functions/
└── sugerir-projeto/     IA do formulário — a chave do OpenRouter vive só aqui

dashboard/src/
├── lib/
│   ├── supabase.ts      cliente + trava de chave secreta
│   ├── tipos.ts         tipos do banco
│   └── formato.ts       gates, tetos, formatação de data/hora
├── hooks/
│   └── useSessao.tsx    sessão + perfil do sócio logado
├── componentes/
│   ├── ui.tsx           Cartao, Botao, Campo, Area, Etiqueta
│   └── Layout.tsx       cabeçalho + navegação inferior
└── paginas/
    ├── Login.tsx
    ├── Portfolio.tsx    semáforo, alertas, progresso até o M0
    ├── NovoProjeto.tsx
    ├── Projeto.tsx      Definição · Fases · Log · Métricas · Veredito
    ├── MinhasTarefas.tsx
    ├── CheckIn.tsx
    ├── CicloAtual.tsx   capacidade declarada + índice de esforço
    └── Constituicao.tsx a CONSTITUICAO.md renderizada dentro do app
```

---

## 6. Onde a Constituição vira código

| Regra | Onde é aplicada |
|---|---|
| Tarefa só fecha com resultado (§4.3) | Constraint `concluida_exige_resultado` no banco |
| "Trabalhei no jogo" não é entrega (§4.3) | Constraint `entrega_substantiva` |
| Core loop ≤ 3 passos (§6 Fase 1) | Constraint `core_loop_max_3` |
| Post-mortem obrigatório (§6 Fase 5) | Constraint `post_mortem_obrigatorio` |
| Teto de 3 semanas de build (§6.1) | Alerta no Portfólio + justificativa exigida para avançar |
| Projeto parado > 7 dias (§6.1) | Alerta no Portfólio |
| Gate de amostra ≥ 500 antes dos gates de qualidade (§6.1) | Cálculo do veredito + coluna gerada `gate_amostra` |
| Esforço = realizado ÷ declarado (§3.4) | View `v_esforco_relativo` |
| Discordância vira registro, não reunião (§3.3) | Campos `notas`/`contestada` + view `v_contestacoes` |
| Acesso restrito aos sócios (§4.4) | RLS via função `eh_socio()` |
| Documento não lido é documento morto (§14.3) | Tela "Regras" — a Constituição embutida no build |

O banco recusa antes da interface. Se alguém tentar contornar pelo SQL Editor, as constraints continuam valendo.

---

## 7. Fora do escopo (Camada B — §16)

Gráficos e séries temporais · comparação entre projetos · módulo financeiro · ingestão automática via Roblox Open Cloud · pacote de due diligence para exit.

Motivo: exigem dados históricos que ainda não existem. Revisar após o projeto #01 chegar à Fase 5.
