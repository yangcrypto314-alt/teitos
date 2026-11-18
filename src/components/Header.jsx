import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import styles from './Header.module.css';

function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className={`${styles.cabecera} cabecera`}>
      <div className="contenedor">
        <Link className={styles.marca} to="/" aria-label="Teitos, inicio">
          <span className={styles.icono} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="m3 11 9-7 9 7M5 10.5V20h14v-9.5M10 20v-6h4v6" />
            </svg>
          </span>
          <span>teitos</span>
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
          <NavLink to="/#convocatorias" onClick={() => setMenuAbierto(false)}>Convocatorias</NavLink>
          <NavLink to="/#como-funciona" onClick={() => setMenuAbierto(false)}>Cómo funciona</NavLink>
          <NavLink to="/mi-solicitud" onClick={() => setMenuAbierto(false)}>Mi solicitud</NavLink>
          <Link className={styles.acceder} to="/mi-solicitud" onClick={() => setMenuAbierto(false)}>
            Acceder
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header