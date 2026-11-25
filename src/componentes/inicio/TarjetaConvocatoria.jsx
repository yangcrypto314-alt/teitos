import { Link } from 'react-router';
import styles from './TarjetaConvocatoria.module.css';
import { formatearFecha } from '../../utilidades/formato.js';

// Texto e icono de cada estado: así no depende solo del color
const ESTADOS = {
  abierta: { texto: 'Abierta', icono: '●' },
  cerrada: { texto: 'Cerrada', icono: '◐' },
  resuelta: { texto: 'Resuelta', icono: '✓' },
};

// Componente «Tarjeta de convocatoria» de Figma.
// Variante por estado (prop convocatoria.estado) y número de viviendas libres.
export default function TarjetaConvocatoria({ convocatoria, libres }) {
  const {
    codigo, provincia, estado, fechaApertura,
    fechaCierre, sorteo, unidades, rentaDesde,
  } = convocatoria;
  const info = ESTADOS[estado] ?? { texto: estado, icono: '•' };
  const todasAdjudicadas = libres === 0;

  return (
    <article className={`${styles.tarjeta} ${styles[estado] ?? ''}`}>
      <header className={styles.cabecera}>
        <span className={styles.estado}>
          <span aria-hidden="true">{info.icono}</span> {info.texto}
        </span>
        <span className={styles.plazo}>
          {estado === 'abierta' ? 'Cierre' : 'Cerró'} · {formatearFecha(fechaCierre)}
        </span>
      </header>

      <h3 className={styles.codigo}>
        {codigo} <span>· {provincia}</span>
      </h3>
      <p className={styles.resumen}>
        {unidades} viviendas
        {rentaDesde != null && <> · desde <strong>{rentaDesde} €/mes</strong></>}
      </p>

      <dl className={styles.datos}>
        <div>
          <dt>Plazo</dt>
          <dd>{formatearFecha(fechaApertura)} – {formatearFecha(fechaCierre)}</dd>
        </div>
        <div>
          <dt>Sorteo</dt>
          <dd>{sorteo ? formatearFecha(sorteo) : 'Por determinar'}</dd>
        </div>
        {libres !== undefined && (
          <div>
            <dt>Libres</dt>
            <dd>{todasAdjudicadas ? 'Todas adjudicadas' : libres}</dd>
          </div>
        )}
      </dl>

      {todasAdjudicadas ? (
        <p className={styles.sinPlazas}>No quedan viviendas libres en esta convocatoria.</p>
      ) : (
        <Link
          className={styles.enlace}
          to={`/viviendas?provincia=${encodeURIComponent(provincia)}`}
        >
          Consultar <span className={styles.oculto}>viviendas de {codigo}</span>
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </article>
  );
}
