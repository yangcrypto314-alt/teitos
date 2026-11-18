import styles from './Pagination.module.css';

// Devuelve las páginas a mostrar, con «…» en los huecos.
// Ejemplo con 54 páginas y la 5 activa: 1 … 4 5 6 … 54
function paginasVisibles(pagina, total) {
  const lista = [];
  for (let n = 1; n <= total; n++) {
    const extremo = n === 1 || n === total;
    const cerca = Math.abs(n - pagina) <= 1;
    if (extremo || cerca) {
      lista.push(n);
    } else if (lista[lista.length - 1] !== '…') {
      lista.push('…');
    }
  }
  return lista;
}

// Componente «Paginación» de Figma: ‹ 1 2 3 … 8 ›
export default function Pagination({ pagina, totalPaginas, onCambiar }) {
  if (totalPaginas <= 1) return null;

  return (
    <nav className={styles.paginacion} aria-label="Paginación">
      <button
        type="button"
        className={styles.flecha}
        onClick={() => onCambiar(pagina - 1)}
        disabled={pagina === 1}
        aria-label="Página anterior"
      >
        ‹
      </button>

      <ol>
        {paginasVisibles(pagina, totalPaginas).map((n, i) =>
          n === '…' ? (
            <li key={`hueco-${i}`} className={styles.hueco} aria-hidden="true">…</li>
          ) : (
            <li key={n}>
              <button
                type="button"
                className={styles.numero}
                onClick={() => onCambiar(n)}
                aria-label={`Página ${n}`}
                aria-current={n === pagina ? 'page' : undefined}
              >
                {n}
              </button>
            </li>
          )
        )}
      </ol>

      <button
        type="button"
        className={styles.flecha}
        onClick={() => onCambiar(pagina + 1)}
        disabled={pagina === totalPaginas}
        aria-label="Página siguiente"
      >
        ›
      </button>
    </nav>
  );
}
