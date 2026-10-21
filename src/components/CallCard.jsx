import styles from './CallCard.module.css';
import { formatearFecha, formatearRenta } from '../utils/formato.js';

const ETIQUETAS = {
  abierta: 'Abierta',
  cerrada: 'Cerrada',
  resuelta: 'Resuelta',
};

export default function CallCard({ convocatoria }) {
  const {
    codigo, provincia, estado, fechaApertura,
    fechaCierre, sorteo, unidades, rentaDesde,
  } = convocatoria;

  return (
    <article className={styles.tarjeta}>
      <header className={styles.cabecera}>
        <h3 className={styles.codigo}>{codigo}</h3>
        <span className={styles.estado}>{ETIQUETAS[estado] ?? estado}</span>
      </header>
      <p className={styles.provincia}>{provincia}</p>
      <dl className={styles.datos}>
        <div>
          <dt>Plazo</dt>
          <dd>{formatearFecha(fechaApertura)} – {formatearFecha(fechaCierre)}</dd>
        </div>
        <div>
          <dt>Sorteo</dt>
          <dd>{sorteo ? formatearFecha(sorteo) : 'Por determinar'}</dd>
        </div>
        <div>
          <dt>Viviendas</dt>
          <dd>{unidades}</dd>
        </div>
        <div>
          <dt>Renta desde</dt>
          <dd>{formatearRenta(rentaDesde)}</dd>
        </div>
      </dl>
    </article>
  );
}