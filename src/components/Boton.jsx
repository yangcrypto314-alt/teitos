import { Link } from 'react-router';
import styles from './Boton.module.css';

// Componente «Botón» de Figma. Variantes como props:
//   variante: 'primario' | 'secundario' | 'peligro'
//   error:    true para el estado de error
//   to:       si se pasa, se pinta como enlace (Link) con aspecto de botón
// Los estados hover, foco y desactivado los resuelve el CSS.
export default function Boton({
  variante = 'primario',
  error = false,
  to,
  type = 'button',
  className = '',
  children,
  ...resto
}) {
  const clases = [
    styles.boton,
    styles[variante],
    error ? styles.error : '',
    className,
  ].join(' ');

  if (to) {
    return (
      <Link className={clases} to={to} {...resto}>
        {children}
      </Link>
    );
  }

  return (
    <button className={clases} type={type} {...resto}>
      {children}
    </button>
  );
}
