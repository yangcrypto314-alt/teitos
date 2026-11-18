import Boton from './Boton.jsx';
import styles from './Estado.module.css';

// Los tres estados de cualquier petición (frame 09 de Figma).
//   tipo="cargando" → esqueleto gris animado
//   tipo="error"    → aviso rojo + botón «Reintentar»
//   tipo="vacio"    → mensaje + acción opcional (p. ej. «Limpiar filtros»)
export default function Estado({ tipo, titulo, texto, accion, onAccion, filas = 3 }) {
  if (tipo === 'cargando') {
    return (
      <div className={styles.cargando} role="status" aria-live="polite">
        <span className={styles.oculto}>{titulo ?? 'Cargando…'}</span>
        {Array.from({ length: filas }, (_, i) => (
          <div key={i} className={styles.esqueleto} aria-hidden="true">
            <span className={styles.bloque} />
            <span className={styles.linea} />
            <span className={styles.lineaCorta} />
          </div>
        ))}
      </div>
    );
  }

  if (tipo === 'error') {
    return (
      <div className={`${styles.caja} ${styles.error}`} role="alert">
        <span className={styles.etiquetaError}>Error del servidor</span>
        <h2>{titulo ?? 'No se pudieron cargar los datos.'}</h2>
        <p>{texto ?? 'Comprueba tu conexión e inténtalo de nuevo.'}</p>
        {onAccion && <Boton onClick={onAccion}>{accion ?? 'Reintentar'}</Boton>}
      </div>
    );
  }

  // vacío
  return (
    <div className={styles.caja} role="status">
      <span className={styles.dibujo} aria-hidden="true">⌂</span>
      <h2>{titulo ?? 'No hay resultados'}</h2>
      {texto && <p>{texto}</p>}
      {onAccion && (
        <Boton variante="secundario" onClick={onAccion}>
          {accion}
        </Boton>
      )}
    </div>
  );
}
