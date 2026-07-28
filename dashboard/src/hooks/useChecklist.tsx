import { useCallback, useEffect, useState } from 'react'

function ler(chave: string): Set<string> {
  try {
    const raw = localStorage.getItem(`gtl-checklist:${chave}`)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as string[]
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

function gravar(chave: string, set: Set<string>) {
  try {
    localStorage.setItem(`gtl-checklist:${chave}`, JSON.stringify([...set]))
  } catch {
    // ignore quota / private mode
  }
}

export function useChecklist(chave: string) {
  const [marcados, setMarcados] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    setMarcados(ler(chave))
  }, [chave])

  const marcado = useCallback((id: string) => marcados.has(id), [marcados])

  const alternar = useCallback(
    (id: string) => {
      setMarcados((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        gravar(chave, next)
        return next
      })
    },
    [chave]
  )

  const pct = useCallback(
    (total: number) => {
      if (total <= 0) return 0
      return Math.round((marcados.size / total) * 100)
    },
    [marcados]
  )

  const quantos = useCallback(
    (ids: string[]) => ids.filter((id) => marcados.has(id)).length,
    [marcados]
  )

  return { marcado, alternar, pct, quantos, totalMarcados: marcados.size }
}
