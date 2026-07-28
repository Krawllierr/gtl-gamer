// Sugestão de campos da Fase 1 via OpenRouter.
//
// Por que uma Edge Function e não uma chamada direta do navegador (§4.4):
// a chave do OpenRouter é secreta. No frontend ela iria embutida no bundle e
// qualquer visitante gastaria nossos créditos. Ela vive só aqui.
//
// Esta função NÃO grava nada. Ela devolve sugestões para os dois analisarem e
// confirmarem — a Fase 1 é consenso obrigatório (§3.3), e a IA nunca decide
// escopo sozinha (§7.2).

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Trocável pelo secret OPENROUTER_MODEL, sem mexer no código.
const MODELO = Deno.env.get('OPENROUTER_MODEL') ?? 'openai/gpt-4o'

// As regras da Constituição que a sugestão precisa respeitar. Se este texto
// divergir da CONSTITUICAO.md, a Constituição vence (Regra zero) — atualizar aqui.
const SISTEMA = `Você ajuda um estúdio de dois irmãos (GTL Gamer) a preencher a definição da Fase 1 de um jogo Roblox.

Contexto obrigatório — são regras do contrato interno deles, não preferências:

1. O público-alvo é INFANTIL E JOVEM. Nada de conteúdo, tema ou linguagem inadequada para criança. A moderação da Roblox é severa: uma violação derruba o jogo e a conta que recebe o dinheiro.
2. O core loop tem NO MÁXIMO 3 PASSOS. O banco de dados recusa mais que isso. Se a ideia não cabe em 3 passos, ela é complexa demais para a Fase 1.
3. Existe UMA e apenas UMA alteração em relação ao jogo base que está sendo clonado. Não duas, não "e também". Uma.
4. A monetização é definida ANTES do código. Ela deve ser kid-safe: sem mecânica de pressão de compra, sem urgência artificial, sem loot box. Padrões aceitáveis: gamepasses de conveniência ou cosmético, produtos de desenvolvedor para cosméticos.
5. A estética alvo é low-poly / estilizado — é o que roda em celular fraco, e grande parte da base é mobile.
6. O jogo é construído por uma pessoa em no máximo 3 semanas, com ajuda de IA. Sugestão que exige equipe ou meses de trabalho é inútil.

Responda SOMENTE com JSON válido, sem markdown, neste formato exato:
{
  "uma_frase": "uma frase curta descrevendo o jogo",
  "core_loop": ["passo 1", "passo 2", "passo 3"],
  "alteracao_unica": "a única mudança em relação ao clone base",
  "modelo_monetizacao": "como o jogo ganha dinheiro"
}

core_loop deve ter entre 1 e 3 itens. Escreva tudo em português do Brasil, direto e curto.`

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  const json = (corpo: unknown, status = 200) =>
    new Response(JSON.stringify(corpo), {
      status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })

  try {
    const chave = Deno.env.get('OPENROUTER_API_KEY')
    if (!chave) {
      return json(
        { erro: 'OPENROUTER_API_KEY não configurada nos secrets do projeto Supabase.' },
        500
      )
    }

    // Só sócio usa. Mesma fronteira do RLS (eh_socio): consultamos `perfis` com o
    // JWT de quem chamou — quem não tem perfil vinculado não enxerga linha nenhuma.
    const auth = req.headers.get('Authorization') ?? ''
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: auth } } }
    )
    const { data: perfil } = await sb.from('perfis').select('id').limit(1).maybeSingle()
    if (!perfil) return json({ erro: 'Sua conta não está vinculada a um perfil de sócio.' }, 403)

    const { nome, genero } = await req.json()
    if (!nome?.trim() || !genero?.trim()) {
      return json({ erro: 'Informe o nome e o gênero base antes de pedir sugestão.' }, 400)
    }

    const resposta = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${chave}`,
        'Content-Type': 'application/json',
        'X-Title': 'GTL Gamer Dashboard',
      },
      body: JSON.stringify({
        model: MODELO,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SISTEMA },
          {
            role: 'user',
            content: `Nome do jogo: ${nome.trim()}\nGênero base (o jogo em alta que estamos clonando): ${genero.trim()}`,
          },
        ],
      }),
    })

    if (!resposta.ok) {
      const detalhe = await resposta.text()
      return json({ erro: `OpenRouter respondeu ${resposta.status}: ${detalhe.slice(0, 300)}` }, 502)
    }

    const bruto = await resposta.json()
    const conteudo = bruto?.choices?.[0]?.message?.content
    if (!conteudo) return json({ erro: 'OpenRouter devolveu resposta vazia.' }, 502)

    let sugestao: Record<string, unknown>
    try {
      // Alguns modelos embrulham o JSON em ```json apesar do response_format.
      sugestao = JSON.parse(conteudo.replace(/^```(?:json)?\s*|\s*```$/g, '').trim())
    } catch {
      return json({ erro: 'A resposta do modelo não era JSON válido. Tente de novo.' }, 502)
    }

    // Trava do §6 Fase 1: o banco recusaria mais de 3 passos com o constraint
    // core_loop_max_3. Cortar aqui evita o usuário levar erro do banco por culpa da IA.
    const loop = Array.isArray(sugestao.core_loop)
      ? sugestao.core_loop.map(String).filter(Boolean).slice(0, 3)
      : []

    return json({
      uma_frase: String(sugestao.uma_frase ?? ''),
      core_loop: loop,
      alteracao_unica: String(sugestao.alteracao_unica ?? ''),
      modelo_monetizacao: String(sugestao.modelo_monetizacao ?? ''),
      modelo_usado: MODELO,
    })
  } catch (e) {
    return json({ erro: e instanceof Error ? e.message : 'Falha inesperada.' }, 500)
  }
})
