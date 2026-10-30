import { Routes, Route } from 'react-router'
import './App.css'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Footer from './components/Footer.jsx'
import Inicio from './pages/Inicio.jsx'
import Viviendas from './pages/Viviendas.jsx'
import Detalle from './pages/Detalle.jsx'
import Solicitud from './pages/Solicitud.jsx'
import MiSolicitud from './pages/MiSolicitud.jsx'
import NoEncontrada from './pages/NoEncontrada.jsx'

function App() {
  return (
    <>
      <a className="saltar" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="contenedor" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<><Hero /><Inicio /></>} />
          <Route path="/viviendas" element={<Viviendas />} />
          <Route path="/viviendas/:id" element={<Detalle />} />
          <Route path="/solicitud" element={<Solicitud />} />
          <Route path="/mi-solicitud" element={<MiSolicitud />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App