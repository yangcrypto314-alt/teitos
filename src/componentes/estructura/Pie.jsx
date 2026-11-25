import { Link } from 'react-router';
import Logo from '../comunes/Logo.jsx';

// Pie de página: marca, enlaces y aviso de que es un ejercicio de clase
function Pie() {
  return (
    <footer className="footer">
      <div className="contenedor footer-interior">
        <div>
          <Logo tono="oscuro" />
          <p>Vivienda pública asequible, con raíces.</p>
        </div>
        <nav aria-label="Pie de página">
          <Link to="/viviendas">Viviendas</Link>
          <Link to="/#convocatorias">Convocatorias</Link>
          <Link to="/#como-funciona">Cómo funciona</Link>
          <Link to="/mi-solicitud">Mi solicitud</Link>
        </nav>
      </div>
      <p className="footer-aviso">
        Queisiños · Proyecto de aula PMDM · <strong>Ejercicio sin validez oficial</strong>
      </p>
    </footer>
  )
}

export default Pie
