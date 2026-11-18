import { Link, useNavigate } from 'react-router';
import styles from './Hero.module.css';

// Portada con la ilustración y el buscador rápido.
// El formulario lleva sus valores a la URL del buscador: /viviendas?provincia=…
function Hero({ provincias = [] }) {
  const navigate = useNavigate();

  function buscar(e) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    for (const [clave, valor] of datos) {
      if (valor) params.set(clave, valor);
    }
    navigate(`/viviendas?${params}`);
  }

  return (
    <>
      <section className={styles.hero} aria-labelledby="portada-titulo">
        <div className={`${styles.interior} contenedor`}>
          <div className={styles.texto}>
            <p className={styles.eyebrow}>Teitos · Vivienda con raíces</p>
            <h1 id="portada-titulo">Un hogar que<br />encaja contigo.</h1>
            <p className={styles.descripcion}>
              Encuentra una vivienda asequible y solicita tu plaza de forma sencilla.
            </p>
            <Link className={styles.boton} to="/viviendas">Ver viviendas</Link>
          </div>
          <svg
            className={styles.ilustracion}
            viewBox="0 0 520 360"
            role="img"
            aria-label="Ilustración de viviendas entre colinas"
          >
            <circle cx="426" cy="68" r="36" fill="#F2C078" />
            <path d="M0 258Q102 191 199 251T390 231T520 230V360H0Z" fill="#347E67" />
            <path d="M0 300Q105 231 202 292T398 270T520 272V360H0Z" fill="#1C7058" />
            <g fill="#F4F1E6">
              <path d="M85 173 169 111l84 62v139H85z" />
              <path d="m238 162 89-66 89 66v150H238z" fill="#EEE8D8" />
              <path d="m390 188 63-47 63 47v124H390z" fill="#F7F4E9" />
            </g>
            <g fill="#92B6A8">
              <path d="M108 184h24v34h-24zm48 0h24v34h-24zm48 0h24v34h-24z" />
              <path d="M263 174h25v35h-25zm51 0h25v35h-25zm51 0h25v35h-25z" />
              <path d="M412 199h21v31h-21zm43 0h21v31h-21z" />
            </g>
            <g fill="#8A9C8F">
              <path d="M151 257h25v55h-25z" />
              <path d="M302 256h28v56h-28z" />
              <path d="M427 265h23v47h-23z" />
            </g>
            <path d="M58 313q20-22 40 0m368-3q20-22 40 0" fill="none" stroke="#D9E9A8" strokeLinecap="round" strokeWidth="5" />
          </svg>
        </div>
        <form
          className={`${styles.busqueda} contenedor`}
          onSubmit={buscar}
          aria-labelledby="busqueda-titulo"
        >
          <h2 id="busqueda-titulo">Encuentra tu vivienda</h2>
          <div className={styles.camposBusqueda}>
            <label>
              Provincia
              <select name="provincia" defaultValue="">
                <option value="">Todas las provincias</option>
                {provincias.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>
            <label>
              Personas en el hogar
              <select name="personas" defaultValue="">
                <option value="">Selecciona</option>
                <option value="1">1 persona</option>
                <option value="2">2 personas</option>
                <option value="3">3 personas</option>
                <option value="4">4 personas</option>
                <option value="5">5 personas</option>
                <option value="6">6 o más</option>
              </select>
            </label>
            <label>
              Ingresos netos anuales (€)
              <input name="ingresos" type="number" min="0" step="100" inputMode="numeric" placeholder="Añade una cantidad" />
            </label>
            <button type="submit">Buscar vivienda</button>
          </div>
        </form>
      </section>
      <section className={`${styles.confianza} contenedor`} aria-label="Teitos en cifras">
        <span>Más de 1.200 viviendas</span>
        <span>8 provincias</span>
        <span>Proceso transparente</span>
      </section>
    </>
  );
}

export default Hero;
