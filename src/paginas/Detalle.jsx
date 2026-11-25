import { Link, useNavigate, useParams } from 'react-router';
import useVivienda from '../hooks/useVivienda.js';
import useSolicitud from '../hooks/useSolicitud.js';
import { MAX_PREFERENCIAS, motivoRechazo } from '../estado/solicitudReducer.js';
import Boton from '../componentes/comunes/Boton.jsx';
import Estado from '../componentes/comunes/Estado.jsx';
import { formatearFecha, formatearPlanta, formatearRenta, textoAccesibilidad } from '../utilidades/formato.js';
import styles from './Detalle.module.css';

export default function Detalle() {
  const { id } = useParams();
  const { vivienda, convocatoria, cargando, error } = useVivienda(id);
  const { estado, dispatch } = useSolicitud();
  const navigate = useNavigate();

  if (cargando) return <Estado tipo="cargando" titulo="Cargando vivienda…" filas={1} />;

  if (error) {
    // 404 = la vivienda no existe; cualquier otro = fallo del servidor
    if (error.estado === 404) {
      return (
        <Estado
          tipo="vacio"
          titulo={`La vivienda ${id} no existe`}
          texto="Puede que la dirección esté mal escrita o que la vivienda se haya retirado."
          accion="Volver al listado"
          onAccion={() => navigate('/viviendas')}
        />
      );
    }
    return (
      <Estado
        tipo="error"
        titulo="No se pudo cargar la vivienda."
        accion="Volver al listado"
        onAccion={() => navigate('/viviendas')}
      />
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
            src={`${import.meta.env.BASE_URL}ilustraciones/${vivienda.id}.svg`}
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
              <dd>{formatearPlanta(vivienda.planta)} · {vivienda.ascensor ? 'con ascensor' : 'sin ascensor'}</dd>
            </div>
            <div><dt>Tipo</dt><dd>{vivienda.tipologia}</dd></div>
          </dl>
          <p className={styles.accesibilidad}>
            {vivienda.accesibilidad == null
              ? 'Dato de accesibilidad no disponible'
              : `Accesibilidad ${textoAccesibilidad(vivienda.accesibilidad).toLowerCase()}`}
          </p>
          {!vivienda.ascensor && vivienda.planta >= 4 && (
            <p className={styles.avisoPlanta}>
              <span aria-hidden="true">▲</span> {formatearPlanta(vivienda.planta)} sin ascensor: tenlo en cuenta si hay personas mayores o con movilidad reducida.
            </p>
          )}
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
          <strong>{convocatoria ? `${convocatoria.codigo} · ${convocatoria.provincia}` : 'Sin dato'}</strong>
          <p>
            {!convocatoria
              ? 'No hay información disponible.'
              : convocatoria.estado === 'abierta'
                ? `Plazo abierto hasta el ${formatearFecha(convocatoria.fechaCierre)}`
                : convocatoria.estado === 'cerrada'
                  ? 'Plazo cerrado · pendiente de sorteo'
                  : 'Plazo cerrado · adjudicación resuelta'}
          </p>
        </aside>
      </div>

      <div className={styles.acciones}>
        {!solicitable ? (
          <p>
            {vivienda.adjudicada
              ? 'No se puede solicitar: esta vivienda ya está adjudicada.'
              : `No se puede solicitar: la convocatoria ${convocatoria?.codigo ?? ''} no está abierta.`}
          </p>
        ) : yaAnadida ? (
          <>
            <p role="status">✓ Añadida a tu solicitud ({estado.seleccion.length} de {MAX_PREFERENCIAS}).</p>
            <Boton to="/solicitud">Continuar con la solicitud →</Boton>
            <Boton
              variante="secundario"
              onClick={() => dispatch({ tipo: 'quitar', id: vivienda.id })}
            >
              Quitar
            </Boton>
          </>
        ) : motivo ? (
          <p role="status">{motivo}</p>
        ) : (
          <>
            <p>Puedes elegir hasta {MAX_PREFERENCIAS} viviendas de esta convocatoria.</p>
            <Boton onClick={() => dispatch({ tipo: 'anadir', vivienda: resumen })}>
              {estado.seleccion.length === 0 ? 'Iniciar solicitud' : 'Añadir a mi solicitud'}
            </Boton>
          </>
        )}
      </div>
    </section>
  );
}