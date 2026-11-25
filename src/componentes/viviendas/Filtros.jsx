import styles from './Filtros.module.css';

const MEDIDAS = [
  { valor: 'adaptada', texto: 'Adaptada' },
  { valor: 'practicable', texto: 'Practicable' },
];

// Panel lateral con los cuatro filtros del portal.
// No guarda estado propio: recibe los filtros y avisa al padre con onCambiar.
export default function Filtros({ filtros, provincias, onCambiar, onLimpiar }) {
  function alternarMedida(valor) {
    const actuales = filtros.accesibilidad;
    const nuevas = actuales.includes(valor)
      ? actuales.filter((m) => m !== valor)
      : [...actuales, valor];
    onCambiar('accesibilidad', nuevas);
  }

  const activos =
    [filtros.provincia, filtros.personas, filtros.ingresos].filter(Boolean).length +
    filtros.accesibilidad.length;

  return (
    <form
      className={styles.panel}
      aria-labelledby="filtros-titulo"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className={styles.cabecera}>
        <h2 id="filtros-titulo">
          Filtros
          {activos > 0 && <span className={styles.contador}>{activos}</span>}
        </h2>
        <button
          type="button"
          className={styles.limpiar}
          onClick={onLimpiar}
          disabled={activos === 0}
        >
          Limpiar
        </button>
      </div>

      <div className={styles.campo}>
        <label htmlFor="provincia">Provincia</label>
        <select
          id="provincia"
          value={filtros.provincia}
          onChange={(e) => onCambiar('provincia', e.target.value)}
        >
          <option value="">Todas</option>
          {provincias.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className={styles.campo}>
        <label htmlFor="personas">Personas en el hogar</label>
        <select
          id="personas"
          value={filtros.personas}
          onChange={(e) => onCambiar('personas', e.target.value)}
        >
          <option value="">Selecciona</option>
          <option value="1">1 persona</option>
          <option value="2">2 personas</option>
          <option value="3">3 personas</option>
          <option value="4">4 personas</option>
          <option value="5">5 personas</option>
          <option value="6">6 o más</option>
        </select>
      </div>

      <div className={styles.campo}>
        <label htmlFor="ingresos">Ingresos netos anuales (€)</label>
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
        <legend>Accesibilidad</legend>
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
    </form>
  );
}
