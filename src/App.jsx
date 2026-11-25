import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import './estilos/layout.css'
import Cabecera from './componentes/estructura/Cabecera.jsx'
import Pie from './componentes/estructura/Pie.jsx'
import BarraMovil from './componentes/estructura/BarraMovil.jsx'
import Inicio from './paginas/Inicio.jsx'
import Viviendas from './paginas/Viviendas.jsx'
import Detalle from './paginas/Detalle.jsx'
import Solicitud from './paginas/Solicitud.jsx'
import MiSolicitud from './paginas/MiSolicitud.jsx'
import NoEncontrada from './paginas/NoEncontrada.jsx'

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
      <Cabecera />
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
      <Pie />
      <BarraMovil />
    </>
  )
}

export default App
