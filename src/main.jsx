import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import './styles/variables.css'
import './styles/base.css'
import App from './App.jsx'
import SolicitudProvider from './context/SolicitudProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <SolicitudProvider>
        <App />
      </SolicitudProvider>
    </BrowserRouter>
  </StrictMode>,
)