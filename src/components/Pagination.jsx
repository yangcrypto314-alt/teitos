import styles from './Pagination.module.css';

export default function Pagination({ pagina, totalPaginas, onCambiar }) {
  if (totalPaginas <= 1) return null;

  return (
    <nav className={styles.paginacion} aria-label="Paginación">
      <button
        type="button"
        onClick={() => onCambiar(pagina - 1)}
        disabled={pagina === 1}
      >
        Anterior
      </button>
      <span aria-live="polite">
        Página {pagina} de {totalPaginas}
      </span>
      <button
        type="button"
        onClick={() => onCambiar(pagina + 1)}
        disabled={pagina === totalPaginas}
      >
        Siguiente
      </button>
    </nav>
  );
}