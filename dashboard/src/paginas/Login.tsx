import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { Botao, Campo, Erro } from '../componentes/ui'

function traduzirLogin(msg: string) {
  const m = msg.toLowerCase()
  if (m.includes('invalid login credentials') || m.includes('invalid_credentials'))
    return 'E-mail ou senha incorretos.'
  if (m.includes('email not confirmed')) return 'E-mail ainda não confirmado.'
  if (m.includes('too many requests')) return 'Muitas tentativas. Espere um minuto e tente de novo.'
  return msg
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [ocupado, setOcupado] = useState(false)

  async function entrar(e: FormEvent) {
    e.preventDefault()
    setOcupado(true)
    setErro(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) setErro(traduzirLogin(error.message))
    setOcupado(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      <form onSubmit={entrar} className="w-full max-w-sm space-y-4">
        <div className="mb-8 text-center">
          <div className="text-xl font-semibold tracking-wide">GTL GAMER</div>
          <div className="mt-1 text-sm text-suave">Painel interno</div>
        </div>

        <Campo
          rotulo="E-mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Campo
          rotulo="Senha"
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        {erro && <Erro>{erro}</Erro>}

        <Botao type="submit" disabled={ocupado} className="w-full">
          {ocupado ? 'Entrando…' : 'Entrar'}
        </Botao>

        <p className="text-center text-xs text-suave">
          Acesso restrito aos sócios. Contas são criadas no Supabase.
        </p>
      </form>
    </div>
  )
}
