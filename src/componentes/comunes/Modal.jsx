import { useEffect, useId, useRef } from 'react';
import styles from './Modal.module.css';

export default function Modal({ abierto, titulo, onCerrar, acciones, children }) {
  const ref = useRef(null);
  const idTitulo = useId();

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) dialogo.showModal();
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      className={styles.modal}
      aria-labelledby={idTitulo}
      onClose={onCerrar}
      onClick={(e) => {
        // Un clic en el fondo oscuro cierra la ventana
        if (e.target === ref.current) onCerrar();
      }}
    >
      <div className={styles.contenido}>
        <h2 id={idTitulo}>{titulo}</h2>
        {children}
        <div className={styles.acciones}>{acciones}</div>
      </div>
    </dialog>
  );
}