import styles from './MensajeError.module.css';

// Componente «Mensaje de error» de Figma.
// Lleva icono + texto: el error no depende solo del color.
export default function MensajeError({ id, children }) {
  return (
    <p id={id} className={styles.mensaje} role="alert">
      <span className={styles.icono} aria-hidden="true">!</span>
      <span>{children}</span>
    </p>
  );
}
