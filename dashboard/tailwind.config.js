import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        fundo: '#0b0d10',
        painel: '#14181d',
        borda: '#232a32',
        texto: '#e6eaef',
        suave: '#8b95a3',
        acento: '#5b9cff',
      },
    },
  },
  plugins: [typography],
}
