import { Link } from 'react-router';
import styles from './DwellingCard.module.css';
import { formatearRenta, textoAccesibilidad } from '../utils/formato.js';

export default function DwellingCard({ vivienda }) {
  const {
    id, referencia, municipio, provincia, tipologia,
    superficie, renta, planta, ascensor, accesibilidad,
  } = vivienda;

  return (
    <article className={styles.tarjeta}>
      <h3 className={styles.referencia}>{referencia}</h3>
      <p className={styles.lugar}>{municipio} ({provincia})</p>
      <dl className={styles.datos}>
        <div><dt>Tipología</dt><dd>{tipologia}</dd></div>
        <div><dt>Superficie</dt><dd>{superficie} m²</dd></div>
        <div><dt>Renta</dt><dd>{formatearRenta(renta)}</dd></div>
        <div>
          <dt>Planta</dt>
          <dd>{planta} · {ascensor ? 'con ascensor' : 'sin ascensor'}</dd>
        </div>
        <div><dt>Accesibilidad</dt><dd>{textoAccesibilidad(accesibilidad)}</dd></div>
      </dl>
      <Link className={styles.enlace} to={`/viviendas/${id}`}>
        Ver vivienda {referencia}
      </Link>
    </article>
  );
}