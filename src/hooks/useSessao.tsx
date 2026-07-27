import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Perfil } from '../lib/tipos'

type Contexto = {
  sessao: Session | null
  perfil: Perfil | null
  carregando: boolean
  erroPerfil: string | null
  sair: () => Promise<void>
}

const Ctx = createContext<Contexto>({
  sessao: null,
  perfil: null,
  carregando: true,
  erroPerfil: null,
  sair: async () => {},
})

export function ProvedorSessao({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Session | null>(null)
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erroPerfil, setErroPerfil] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session)
      if (!data.session) setCarregando(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSessao(s)
      if (!s) {
        setPerfil(null)
        setCarregando(false)
      }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // Carrega o perfil vinculado ao usuário logado.
  // Se não houver vínculo, o RLS bloqueia tudo (função eh_socio) — então avisamos claramente.
  useEffect(() => {
    if (!sessao) return
    let cancelado = false
    ;(async () => {
      setCarregando(true)
      const { data, error } = await supabase
        .from('perfis')
        .select('*')
        .eq('user_id', sessao.user.id)
        .maybeSingle()

      if (cancelado) return
      if (error) setErroPerfil(error.message)
      else if (!data)
        setErroPerfil(
          'Sua conta ainda não está vinculada a um perfil de sócio. ' +
            'Rode no SQL Editor do Supabase: ' +
            `update perfis set user_id = '${sessao.user.id}' where nome = 'Gabriel';`
        )
      else {
        setPerfil(data as Perfil)
        setErroPerfil(null)
      }
      setCarregando(false)
    })()
    return () => {
      cancelado = true
    }
  }, [sessao])

  const sair = async () => {
    await supabase.auth.signOut()
    setPerfil(null)
  }

  return (
    <Ctx.Provider value={{ sessao, perfil, carregando, erroPerfil, sair }}>{children}</Ctx.Provider>
  )
}

export const useSessao = () => useContext(Ctx)
