import { NavLink } from 'react-router';
import styles from './Header.module.css';

function Header() {
  return (
    <header className="cabecera">
      <div className="contenedor">
        <h1>Teitos</h1>
        <p>Portal de alquiler público asequible</p>
        <nav className={styles.menu} aria-label="Principal">
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/viviendas">Viviendas</NavLink>
          <NavLink to="/mi-solicitud">Mi solicitud</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header