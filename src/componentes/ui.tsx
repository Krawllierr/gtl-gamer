import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

export function Cartao({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-borda bg-painel p-4 ${
        onClick ? 'cursor-pointer active:scale-[0.99] transition' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function Etiqueta({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${
        className || 'border-borda bg-white/5 text-suave'
      }`}
    >
      {children}
    </span>
  )
}

export function Botao({
  children,
  variante = 'primario',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: 'primario' | 'secundario' | 'perigo' }) {
  const estilos = {
    primario: 'bg-acento text-black font-semibold hover:brightness-110',
    secundario: 'border border-borda bg-white/5 text-texto hover:bg-white/10',
    perigo: 'border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20',
  }
  return (
    <button
      {...props}
      className={`rounded-lg px-4 py-2.5 text-sm transition disabled:opacity-40 disabled:cursor-not-allowed ${estilos[variante]} ${className}`}
    >
      {children}
    </button>
  )
}

export function Campo({
  rotulo,
  dica,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { rotulo: string; dica?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-suave">{rotulo}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-borda bg-fundo px-3 py-2.5 outline-none focus:border-acento"
      />
      {dica && <span className="mt-1 block text-xs text-suave">{dica}</span>}
    </label>
  )
}

export function Area({
  rotulo,
  dica,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { rotulo: string; dica?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-suave">{rotulo}</span>
      <textarea
        {...props}
        className="w-full rounded-lg border border-borda bg-fundo px-3 py-2.5 outline-none focus:border-acento"
      />
      {dica && <span className="mt-1 block text-xs text-suave">{dica}</span>}
    </label>
  )
}

export function Vazio({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-borda p-8 text-center text-sm text-suave">
      {children}
    </div>
  )
}

export function Carregando() {
  return <div className="p-8 text-center text-sm text-suave">Carregando…</div>
}

export function Erro({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
      {children}
    </div>
  )
}
