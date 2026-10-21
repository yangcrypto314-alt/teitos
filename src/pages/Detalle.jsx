import { Link, useParams } from 'react-router';
import useVivienda from '../hooks/useVivienda.js';
import useSolicitud from '../hooks/useSolicitud.js';
import { motivoRechazo } from '../context/solicitudReducer.js';
import { formatearRenta, textoAccesibilidad } from '../utils/formato.js';
import styles from './Detalle.module.css';

export default function Detalle() {
  const { id } = useParams();
  const { vivienda, convocatoria, cargando, error } = useVivienda(id);
  const { estado, dispatch } = useSolicitud();

  if (cargando) return <p role="status">Cargando vivienda…</p>;

  if (error) {
    const noExiste = error.estado === 404;
    return (
      <section>
        <p role="alert">
          {noExiste
            ? `La vivienda ${id} no existe.`
            : `No se ha podido cargar la vivienda. (${error.message})`}
        </p>
        <Link to="/viviendas">Volver al listado</Link>
      </section>
    );
  }

  const solicitable =
    !vivienda.adjudicada && convocatoria?.estado === 'abierta';

  const resumen = {
    id: vivienda.id,
    referencia: vivienda.referencia,
    municipio: vivienda.municipio,
    provincia: vivienda.provincia,
    renta: vivienda.renta,
    convocatoriaId: vivienda.convocatoriaId,
  };
  const yaAnadida = estado.seleccion.some((s) => s.id === vivienda.id);
  const motivo = yaAnadida ? null : motivoRechazo(estado, resumen);

  return (
    <section className={styles.ficha}>
      <h2 className={styles.titulo}>{vivienda.referencia}</h2>
      <p className={styles.lugar}>
        {vivienda.municipio} ({vivienda.provincia}) · CP {vivienda.codigoPostal}
      </p>

      {vivienda.adjudicada && (
        <p className={styles.aviso} role="status">
          Esta vivienda ya está adjudicada.
        </p>
      )}

      <dl className={styles.datos}>
        <div><dt>Tipología</dt><dd>{vivienda.tipologia}</dd></div>
        <div><dt>Dormitorios</dt><dd>{vivienda.dormitorios}</dd></div>
        <div><dt>Superficie</dt><dd>{vivienda.superficie} m²</dd></div>
        <div><dt>Renta</dt><dd>{formatearRenta(vivienda.renta)}</dd></div>
        <div>
          <dt>Planta</dt>
          <dd>
            {vivienda.planta} · {vivienda.ascensor ? 'con ascensor' : 'sin ascensor'}
          </dd>
        </div>
        <div>
          <dt>Accesibilidad</dt>
          <dd>{textoAccesibilidad(vivienda.accesibilidad)}</dd>
        </div>
        <div>
          <dt>Eficiencia energética</dt>
          <dd>{vivienda.eficiencia}</dd>
        </div>
        <div>
          <dt>Convocatoria</dt>
          <dd>
            {convocatoria
              ? `${convocatoria.codigo} (${convocatoria.estado})`
              : 'Sin dato'}
          </dd>
        </div>
      </dl>

      <p>{vivienda.descripcion}</p>

      <div className={styles.acciones}>
        {!solicitable ? (
          <span>
            No se puede solicitar: la vivienda está adjudicada o su convocatoria no está abierta.
          </span>
        ) : yaAnadida ? (
          <>
            <span role="status">Añadida a tu solicitud.</span>
            <Link to="/solicitud">Ver mi solicitud</Link>
            <button
              type="button"
              onClick={() => dispatch({ tipo: 'quitar', id: vivienda.id })}
            >
              Quitar de mi solicitud
            </button>
          </>
        ) : motivo ? (
          <span role="status">{motivo}</span>
        ) : (
          <button
            type="button"
            onClick={() => dispatch({ tipo: 'anadir', vivienda: resumen })}
          >
            Añadir a mi solicitud
          </button>
        )}
        <Link to="/viviendas">Volver al listado</Link>
      </div>
    </section>
  );
}