import styles from './FilterPanel.module.css';

const MEDIDAS = [
  { valor: 'adaptada', texto: 'Adaptada' },
  { valor: 'practicable', texto: 'Practicable' },
];

export default function FilterPanel({ filtros, provincias, onCambiar, onLimpiar }) {
  function alternarMedida(valor) {
    const actuales = filtros.accesibilidad;
    const nuevas = actuales.includes(valor)
      ? actuales.filter((m) => m !== valor)
      : [...actuales, valor];
    onCambiar('accesibilidad', nuevas);
  }

  return (
    <form
      className={styles.panel}
      aria-label="Filtros"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className={styles.campo}>
        <label htmlFor="provincia">Provincia</label>
        <select
          id="provincia"
          value={filtros.provincia}
          onChange={(e) => onCambiar('provincia', e.target.value)}
        >
          <option value="">Todas las provincias</option>
          {provincias.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className={styles.campo}>
        <label htmlFor="personas">Personas en la vivienda</label>
        <select
          id="personas"
          value={filtros.personas}
          onChange={(e) => onCambiar('personas', e.target.value)}
        >
          <option value="">Sin indicar</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6 o más</option>
        </select>
      </div>

      <div className={styles.campo}>
        <label htmlFor="ingresos">Ingresos netos anuales del hogar (€)</label>
        <input
          id="ingresos"
          type="number"
          min="0"
          step="100"
          inputMode="numeric"
          value={filtros.ingresos}
          onChange={(e) => onCambiar('ingresos', e.target.value)}
          placeholder="Ej.: 24000"
        />
      </div>

      <fieldset className={styles.medidas}>
        <legend>Medidas de accesibilidad</legend>
        {MEDIDAS.map((m) => (
          <label key={m.valor}>
            <input
              type="checkbox"
              checked={filtros.accesibilidad.includes(m.valor)}
              onChange={() => alternarMedida(m.valor)}
            />
            {m.texto}
          </label>
        ))}
      </fieldset>

      <button type="button" onClick={onLimpiar}>
        Limpiar filtros
      </button>
    </form>
  );
}