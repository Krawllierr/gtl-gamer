import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // permite abrir pelo IP na rede local (útil para testar no celular)
    fs: {
      // a CONSTITUICAO.md fica na raiz do repositório, um nível acima do app
      allow: ['..'],
    },
  },
})
