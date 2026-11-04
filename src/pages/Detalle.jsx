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
    <section className={styles.pagina}>
      <Link className={styles.volver} to="/viviendas">← Volver a resultados</Link>
      <div className={styles.ficha}>
        <div className={styles.ilustracion}>
          <span className={styles.ilustracionReferencia}>{vivienda.referencia}</span>
          <img
            src={`/ilustraciones/${vivienda.id}.svg`}
            alt={`Ilustración de vivienda ${vivienda.referencia}`}
          />
        </div>
        <div className={styles.resumen}>
          <div className={styles.etiquetas}>
            <span className={styles.estado}>{vivienda.adjudicada ? 'Adjudicada' : 'Disponible'}</span>
            <span>{vivienda.referencia}</span>
          </div>
          <h1 className={styles.titulo}>
            Vivienda en {vivienda.municipio}
          </h1>
          <p className={styles.lugar}>
            {vivienda.provincia} · {vivienda.dormitorios} {vivienda.dormitorios === 1 ? 'dormitorio' : 'dormitorios'}
          </p>
          <p className={styles.renta}>
            {vivienda.renta === null || vivienda.renta === undefined
              ? formatearRenta(vivienda.renta)
              : `${vivienda.renta.toLocaleString('es-ES')} €`}
            {vivienda.renta !== null && vivienda.renta !== undefined && (
              <span> / mes</span>
            )}
          </p>
          <dl className={styles.datos}>
            <div><dt>Superficie</dt><dd>{vivienda.superficie} m²</dd></div>
            <div>
              <dt>Planta</dt>
              <dd>{vivienda.planta} · {vivienda.ascensor ? 'con ascensor' : 'sin ascensor'}</dd>
            </div>
            <div><dt>Tipo</dt><dd>{vivienda.tipologia}</dd></div>
          </dl>
          <p className={styles.accesibilidad}>
            Accesibilidad {textoAccesibilidad(vivienda.accesibilidad).toLowerCase()}
          </p>
        </div>
      </div>

      {vivienda.adjudicada && (
        <p className={styles.aviso} role="status">
          Esta vivienda ya está adjudicada.
        </p>
      )}

      <div className={styles.detalles}>
        <section className={styles.caracteristicas}>
          <h2>Sobre esta vivienda</h2>
          <p>
            {vivienda.descripcion ||
              `Vivienda de ${vivienda.superficie} m² en ${vivienda.municipio}, ${vivienda.provincia}.`}
          </p>
          <dl className={styles.caracteristicasGrid}>
            <div><dt>Dormitorios</dt><dd>{vivienda.dormitorios}</dd></div>
            <div><dt>Accesibilidad</dt><dd>{textoAccesibilidad(vivienda.accesibilidad)}</dd></div>
            <div><dt>Eficiencia energética</dt><dd>{vivienda.eficiencia}</dd></div>
            <div><dt>Código postal</dt><dd>{vivienda.codigoPostal}</dd></div>
          </dl>
        </section>
        <aside className={styles.convocatoria}>
          <h2>Convocatoria</h2>
          <strong>{convocatoria ? convocatoria.codigo : 'Sin dato'}</strong>
          <p>{convocatoria ? `${convocatoria.provincia} · ${convocatoria.estado}` : 'No hay información disponible.'}</p>
        </aside>
      </div>

      <div className={styles.acciones}>
        {!solicitable ? (
          <p>
            No se puede solicitar: la vivienda está adjudicada o su convocatoria no está abierta.
          </p>
        ) : yaAnadida ? (
          <>
            <p role="status">Añadida a tu solicitud.</p>
            <Link to="/solicitud">Ver mi solicitud</Link>
            <button
              type="button"
              onClick={() => dispatch({ tipo: 'quitar', id: vivienda.id })}
            >
              Quitar de mi solicitud
            </button>
          </>
        ) : motivo ? (
          <p role="status">{motivo}</p>
        ) : (
          <button
            type="button"
            onClick={() => dispatch({ tipo: 'anadir', vivienda: resumen })}
          >
            Añadir a mi solicitud
          </button>
        )}
      </div>
    </section>
  );
}