import CampoTexto from '../comunes/CampoTexto.jsx';
import MensajeError from '../comunes/MensajeError.jsx';
import styles from '../comunes/CampoTexto.module.css';

export default function PasoHogar({ borrador, errores, tocados, cambiar, tocar }) {
  const err = (campo) => (tocados[campo] ? errores[campo] : undefined);

  return (
    <>
      <div className={styles.campo}>
        <label htmlFor="personas">Personas en la vivienda</label>
        <select
          id="personas"
          value={borrador.personas}
          onChange={(e) => cambiar('personas', e.target.value)}
          onBlur={() => tocar('personas')}
          aria-invalid={err('personas') ? 'true' : 'false'}
          aria-describedby={err('personas') ? 'personas-error' : undefined}
        >
          <option value="">Elige una opción</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6 o más</option>
        </select>
        {err('personas') && (
          <MensajeError id="personas-error">{err('personas')}</MensajeError>
        )}
      </div>

      <CampoTexto
        id="ingresos"
        etiqueta="Ingresos netos anuales del hogar (€)"
        tipo="number"
        valor={borrador.ingresos}
        onCambiar={(v) => cambiar('ingresos', v)}
        onSalir={() => tocar('ingresos')}
        error={err('ingresos')}
        ayuda="Suma de todos los ingresos netos del último año"
        min="0"
        step="100"
        inputMode="numeric"
      />
    </>
  );
}