import { NavLink } from 'react-router';
import useSolicitud from '../hooks/useSolicitud.js';
import styles from './BarraMovil.module.css';

// Barra inferior que solo aparece en móvil (Figma 06-07): Inicio · Buscar · Mi solicitud
export default function BarraMovil() {
  const { estado } = useSolicitud();
  const elegidas = estado.seleccion.length;

  return (
    <nav className={styles.barra} aria-label="Navegación rápida">
      <NavLink to="/" end>
        <span aria-hidden="true">⌂</span>Inicio
      </NavLink>
      <NavLink to="/viviendas">
        <span aria-hidden="true">⌕</span>Buscar
      </NavLink>
      <NavLink to={elegidas > 0 && !estado.solicitudId ? '/solicitud' : '/mi-solicitud'}>
        <span aria-hidden="true">☰</span>
        Mi solicitud
        {elegidas > 0 && <b className={styles.globo}>{elegidas}</b>}
      </NavLink>
    </nav>
  );
}
