# GTL Games — Dashboard

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

```bash
cd dashboard
git init
git add .
git commit -m "dashboard v1"
git branch -M main
git remote add origin git@github.com:SEU-USUARIO/gtl-dashboard.git
git push -u origin main
```

O `.gitignore` já exclui `.env` e `node_modules`. **Confira antes do push que o `.env` não está na lista do `git status`.**

### 4.2 Criar o serviço

1. Easypanel → **Create Service → App**
2. **Source:** GitHub → selecione o repositório e a branch `main`
   - Se o repo for privado, use o Deploy Key SSH que o Easypanel gera e cole em *Settings → Deploy keys* no GitHub
   - Se o dashboard estiver numa subpasta do repo, defina **Build Path** como `/dashboard`
3. **Build:** método **Dockerfile** (o `Dockerfile` está na raiz do app)

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

## 5. Estrutura

```
src/
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
    └── CicloAtual.tsx   capacidade declarada + índice de esforço
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

O banco recusa antes da interface. Se alguém tentar contornar pelo SQL Editor, as constraints continuam valendo.

---

## 7. Fora do escopo (Camada B — §16)

Gráficos e séries temporais · comparação entre projetos · módulo financeiro · ingestão automática via Roblox Open Cloud · pacote de due diligence para exit.

Motivo: exigem dados históricos que ainda não existem. Revisar após o projeto #01 chegar à Fase 5.
