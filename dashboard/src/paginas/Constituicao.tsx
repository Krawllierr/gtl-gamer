import { useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
// A Constituição vive na raiz do repositório e é embutida no build.
// Consequência: todo deploy carrega a versão vigente — não existe cópia para
// divergir, e o Gustavo lê no celular sem precisar do GitHub.
import textoConstituicao from '../../../CONSTITUICAO.md?raw'

export default function Constituicao() {
  const [busca, setBusca] = useState('')
  const [mostrarTopo, setMostrarTopo] = useState(false)

  const html = useMemo(() => marked.parse(textoConstituicao) as string, [])

  // Índice das seções, para navegar num documento longo pelo celular
  const secoes = useMemo(() => {
    const achados: { id: string; titulo: string }[] = []
    for (const linha of textoConstituicao.split('\n')) {
      const m = linha.match(/^##\s+(.+)$/)
      if (m) achados.push({ id: slug(m[1]), titulo: m[1] })
    }
    return achados
  }, [])

  useEffect(() => {
    function onScroll() {
      setMostrarTopo(window.scrollY > 400)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const filtradas = secoes.filter((s) => s.titulo.toLowerCase().includes(busca.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-borda bg-painel p-4">
        <div className="text-sm font-medium">Constituição do GTL Gamer</div>
        <p className="mt-1 text-xs text-suave">
          Contrato interno. Se algo aqui conflitar com uma conversa, o documento vence. Discordou de alguma coisa?
          Registre em Tarefas → Contestar. Discordância vira registro, não reunião (§3.3).
        </p>
      </div>

      <input
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar seção…"
        className="w-full rounded-lg border border-borda bg-fundo px-3 py-2.5 outline-none focus:border-acento focus-visible:ring-2 focus-visible:ring-acento/50"
      />

      <div className="rounded-xl border border-borda bg-painel p-4">
        <div className="mb-2 text-xs font-medium text-suave">Seções</div>
        <div className="flex flex-wrap gap-1.5">
          {filtradas.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-md border border-borda bg-white/5 px-2 py-1 text-xs text-suave hover:text-texto"
            >
              {s.titulo}
            </a>
          ))}
        </div>
      </div>

      <article
        className="prose prose-invert prose-sm max-w-none
                   prose-headings:scroll-mt-24
                   prose-a:text-acento
                   prose-table:block prose-table:overflow-x-auto
                   prose-th:whitespace-nowrap
                   prose-code:text-acento prose-code:before:content-none prose-code:after:content-none
                   prose-blockquote:border-acento prose-blockquote:text-texto
                   prose-hr:border-borda"
        dangerouslySetInnerHTML={{ __html: comAncoras(html) }}
      />

      {mostrarTopo && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-4 z-20 min-h-[44px] rounded-full border border-borda bg-painel px-4 text-xs font-medium text-acento shadow-lg backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acento/50"
        >
          ↑ Topo
        </button>
      )}
    </div>
  )
}

function slug(t: string) {
  return t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Adiciona id nos <h2> para o índice funcionar
function comAncoras(html: string) {
  return html.replace(/<h2>(.*?)<\/h2>/g, (_m, titulo: string) => {
    const limpo = titulo.replace(/<[^>]+>/g, '')
    return `<h2 id="${slug(limpo)}">${titulo}</h2>`
  })
}
