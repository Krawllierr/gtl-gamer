/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// permite importar a CONSTITUICAO.md como texto
declare module '*.md?raw' {
  const conteudo: string
  export default conteudo
}
