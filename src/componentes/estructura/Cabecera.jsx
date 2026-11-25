import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import Logo from '../comunes/Logo.jsx';
import styles from './Cabecera.module.css';

function Cabecera() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className={`${styles.cabecera} cabecera`}>
      <div className="contenedor">
        <Link className={styles.marca} to="/" aria-label="Queisiños, inicio">
          <Logo tono="claro" />
        </Link>
        <button
          className={styles.alternar}
          type="button"
          aria-expanded={menuAbierto}
          aria-controls="navegacion-principal"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          <span aria-hidden="true">{menuAbierto ? '×' : '☰'}</span>
        </button>
        <nav
          id="navegacion-principal"
          className={`${styles.menu} ${menuAbierto ? styles.abierto : ''}`}
          aria-label="Principal"
        >
          <NavLink to="/viviendas" onClick={() => setMenuAbierto(false)}>Viviendas</NavLink>
          <Link to="/#convocatorias" onClick={() => setMenuAbierto(false)}>Convocatorias</Link>
          <Link to="/#como-funciona" onClick={() => setMenuAbierto(false)}>Cómo funciona</Link>
          <NavLink to="/mi-solicitud" onClick={() => setMenuAbierto(false)}>Mi solicitud</NavLink>
          <Link className={styles.acceder} to="/mi-solicitud" onClick={() => setMenuAbierto(false)}>
            Acceder
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Cabecera