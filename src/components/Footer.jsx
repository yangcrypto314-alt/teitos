import { Link } from 'react-router';

// Pie de página: marca, enlaces y aviso de que es un ejercicio de clase
function Footer() {
  return (
    <footer className="footer">
      <div className="contenedor footer-interior">
        <div>
          <p className="footer-marca">teitos</p>
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
        Teitos · Proyecto de aula PMDM · <strong>Ejercicio sin validez oficial</strong>
      </p>
    </footer>
  )
}

export default Footer
