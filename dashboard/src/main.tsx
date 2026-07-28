import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ProvedorDemo } from './hooks/useDemo'
import { ProvedorSessao } from './hooks/useSessao'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProvedorSessao>
        <ProvedorDemo>
          <App />
        </ProvedorDemo>
      </ProvedorSessao>
    </BrowserRouter>
  </React.StrictMode>
)
