import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'gtl-demo'

type Contexto = {
  ativo: boolean
  ligar: () => void
  desligar: () => void
  alternar: () => void
}

const Ctx = createContext<Contexto>({
  ativo: false,
  ligar: () => {},
  desligar: () => {},
  alternar: () => {},
})

function lerStorage(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function gravarStorage(ativo: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, ativo ? '1' : '0')
  } catch {
    // ignore quota / private mode
  }
}

export function ProvedorDemo({ children }: { children: ReactNode }) {
  const [ativo, setAtivo] = useState(false)

  useEffect(() => {
    setAtivo(lerStorage())
  }, [])

  const ligar = () => {
    setAtivo(true)
    gravarStorage(true)
  }
  const desligar = () => {
    setAtivo(false)
    gravarStorage(false)
  }
  const alternar = () => {
    setAtivo((prev) => {
      const next = !prev
      gravarStorage(next)
      return next
    })
  }

  return <Ctx.Provider value={{ ativo, ligar, desligar, alternar }}>{children}</Ctx.Provider>
}

export const useDemo = () => useContext(Ctx)

export const MSG_DEMO_BLOQUEIO = 'Modo Demo: não grava.'
