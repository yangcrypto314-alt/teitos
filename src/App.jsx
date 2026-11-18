import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import './App.css'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import BarraMovil from './components/BarraMovil.jsx'
import Inicio from './pages/Inicio.jsx'
import Viviendas from './pages/Viviendas.jsx'
import Detalle from './pages/Detalle.jsx'
import Solicitud from './pages/Solicitud.jsx'
import MiSolicitud from './pages/MiSolicitud.jsx'
import NoEncontrada from './pages/NoEncontrada.jsx'

// Al cambiar de página se sube arriba; si la URL lleva #ancla, se baja hasta ella
function useScrollAlNavegar() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Espera un poco: la sección puede tardar en pintarse
      const t = setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
}

function App() {
  useScrollAlNavegar()

  return (
    <>
      <a className="saltar" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="contenedor" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/viviendas" element={<Viviendas />} />
          <Route path="/viviendas/:id" element={<Detalle />} />
          <Route path="/solicitud" element={<Solicitud />} />
          <Route path="/mi-solicitud" element={<MiSolicitud />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <Footer />
      <BarraMovil />
    </>
  )
}

export default App
