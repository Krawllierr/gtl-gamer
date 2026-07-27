import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const chave = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

if (!url || !chave) {
  throw new Error(
    'Faltam as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY. ' +
      'Copie o .env.example para .env e preencha.'
  )
}

// TRAVA DE SEGURANÇA (Constituição §4.4).
// A chave secreta ignora o RLS e dá acesso total ao banco. Se ela acabar aqui,
// ela vai parar dentro do JavaScript que qualquer visitante consegue ler.
// Melhor quebrar o app agora e alto do que vazar o banco em silêncio.
if (chave.startsWith('sb_secret_') || chave.includes('service_role')) {
  throw new Error(
    'PARE: você colocou uma chave SECRETA no frontend. Use a publishable key (sb_publishable_...). ' +
      'Constituição §4.4.'
  )
}

export const supabase = createClient(url, chave, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
