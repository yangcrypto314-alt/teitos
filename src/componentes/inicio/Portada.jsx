import { Link, useNavigate } from 'react-router';
import styles from './Portada.module.css';

// Portada con la ilustración y el buscador rápido.
// El formulario lleva sus valores a la URL del buscador: /viviendas?provincia=…
function Portada({ provincias = [] }) {
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
            <p className={styles.eyebrow}>Queisiños · Vivienda con raíces</p>
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
            <circle cx="426" cy="68" r="36" fill="#F3C969" />
            <path d="M0 258Q102 191 199 251T390 231T520 230V360H0Z" fill="#2A3858" />
            <path d="M0 300Q105 231 202 292T398 270T520 272V360H0Z" fill="#1F2A44" />
            <g fill="#F7F1E8">
              <path d="M85 173 169 111l84 62v139H85z" />
              <path d="m238 162 89-66 89 66v150H238z" fill="#F1E6D6" />
              <path d="m390 188 63-47 63 47v124H390z" fill="#FBF6EE" />
            </g>
            {/* Tejados de teja */}
            <g fill="#C0582C">
              <path d="M73 180 169 106l96 74h-14l-82-61-82 61z" />
              <path d="m226 169 101-77 101 77h-14l-87-65-87 65z" />
              <path d="m380 195 73-56 73 56h-12l-61-46-61 46z" />
            </g>
            <g fill="#C9CFDF">
              <path d="M108 184h24v34h-24zm96 0h24v34h-24z" />
              <path d="M263 174h25v35h-25zm102 0h25v35h-25z" />
              <path d="M455 199h21v31h-21z" />
            </g>
            {/* Ventanas encendidas */}
            <g fill="#F3C969">
              <path d="M156 184h24v34h-24z" />
              <path d="M314 174h25v35h-25z" />
              <path d="M412 199h21v31h-21z" />
            </g>
            <g fill="#A84A22">
              <path d="M151 257h25v55h-25z" />
              <path d="M302 256h28v56h-28z" />
              <path d="M427 265h23v47h-23z" />
            </g>
            <path d="M58 313q20-22 40 0m368-3q20-22 40 0" fill="none" stroke="#5A6684" strokeLinecap="round" strokeWidth="5" />
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
      <section className={`${styles.confianza} contenedor`} aria-label="Queisiños en cifras">
        <span>Más de 1.200 viviendas</span>
        <span>8 provincias</span>
        <span>Proceso transparente</span>
      </section>
    </>
  );
}

export default Portada;
