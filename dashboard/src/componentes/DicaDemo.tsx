import { DICAS_DEMO, type DicaId } from '../demo/dicas'
import { useDemo } from '../hooks/useDemo'

export default function DicaDemo({ id }: { id: DicaId }) {
  const { ativo } = useDemo()
  if (!ativo) return null

  return (
    <div className="rounded-lg border border-sky-500/40 bg-sky-500/10 p-3 text-sm text-sky-100">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-sky-300">Demo</div>
      {DICAS_DEMO[id]}
    </div>
  )
}
