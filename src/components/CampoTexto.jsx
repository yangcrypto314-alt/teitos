import styles from './CampoTexto.module.css';

export default function CampoTexto({
  id,
  etiqueta,
  valor,
  onCambiar,
  onSalir,
  error,
  ayuda,
  tipo = 'text',
  ...resto
}) {
  const idError = `${id}-error`;
  const idAyuda = `${id}-ayuda`;
  const describedby =
    [ayuda && idAyuda, error && idError].filter(Boolean).join(' ') || undefined;

  return (
    <div className={styles.campo}>
      <label htmlFor={id}>{etiqueta}</label>
      <input
        id={id}
        type={tipo}
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        onBlur={onSalir}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={describedby}
        {...resto}
      />
      {ayuda && (
        <p id={idAyuda} className={styles.ayuda}>
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} className={styles.error} role="alert">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}