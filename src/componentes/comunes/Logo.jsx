import styles from './Logo.module.css';

// Logo de Queisiños: dos tejados superpuestos (dos casitas) y el nombre.
// tono="claro" para fondos oscuros (cabecera) y "oscuro" para fondos claros (pie).
function Logo({ tono = 'claro' }) {
  return (
    <span className={`${styles.logo} ${styles[tono]}`}>
      <svg className={styles.marca} viewBox="0 0 44 32" aria-hidden="true">
        <path className={styles.tejadoGrande} d="M3 22 16 9l13 13" />
        <path className={styles.tejadoPequeno} d="M19 25 30 14l11 11" />
        <rect className={styles.ventana} x="13" y="20" width="6" height="6" rx="1" />
      </svg>
      <span className={styles.nombre}>queisiños</span>
    </span>
  );
}

export default Logo;
