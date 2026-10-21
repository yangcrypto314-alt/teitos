import { Link } from 'react-router';
import useSolicitud from '../hooks/useSolicitud.js';
import { MAX_PREFERENCIAS } from '../context/solicitudReducer.js';
import { formatearRenta } from '../utils/formato.js';
import styles from './Solicitud.module.css';

export default function Solicitud() {
  const { estado, dispatch } = useSolicitud();
  const { seleccion } = estado;

  if (seleccion.length === 0) {
    return (
      <section>
        <h2>Solicitud</h2>
        <p>
          Todavía no has añadido ninguna vivienda. Elígelas en el{' '}
          <Link to="/viviendas">listado</Link>. Solo se pueden pedir viviendas de
          convocatorias abiertas.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2>Solicitud · Paso 1 de 4: orden de preferencia</h2>
      <p>
        La primera vivienda es la que más te interesa. Puedes elegir hasta{' '}
        {MAX_PREFERENCIAS}, todas de la misma convocatoria.
      </p>

      <ol className={styles.lista}>
        {seleccion.map((v, i) => (
          <li key={v.id} className={styles.item}>
            <div>
              <strong>
                {i + 1}. {v.referencia}
              </strong>
              <span>
                {' '}
                {v.municipio} ({v.provincia}) · {formatearRenta(v.renta)}
              </span>
            </div>
            <div className={styles.botones}>
              <button
                type="button"
                disabled={i === 0}
                aria-label={`Subir ${v.referencia}`}
                onClick={() =>
                  dispatch({ tipo: 'mover', id: v.id, desplazamiento: -1 })
                }
              >
                Subir
              </button>
              <button
                type="button"
                disabled={i === seleccion.length - 1}
                aria-label={`Bajar ${v.referencia}`}
                onClick={() =>
                  dispatch({ tipo: 'mover', id: v.id, desplazamiento: 1 })
                }
              >
                Bajar
              </button>
              <button
                type="button"
                aria-label={`Quitar ${v.referencia}`}
                onClick={() => dispatch({ tipo: 'quitar', id: v.id })}
              >
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ol>

      <p>
        <Link to="/viviendas">Añadir más viviendas</Link>
      </p>
    </section>
  );
}