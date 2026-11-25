import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './estilos/global.css'
import './estilos/variables.css'
import './estilos/base.css'
import App from './App.jsx'
import SolicitudProvider from './estado/SolicitudProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <SolicitudProvider>
        <App />
      </SolicitudProvider>
    </BrowserRouter>
  </StrictMode>,
)