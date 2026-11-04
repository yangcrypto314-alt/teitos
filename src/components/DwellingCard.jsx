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
      <div className={styles.imagen}>
        <span className={styles.imagenReferencia}>{referencia}</span>
        <img
          src={`/ilustraciones/${id}.svg`}         
          alt={`Ilustración de vivienda ${referencia}`}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className={styles.contenido}>
        <p className={styles.lugar}>{municipio} · {provincia}</p>
        <p className={styles.tipologia}>{tipologia} · {superficie} m²</p>
        <p className={styles.renta}>{formatearRenta(renta)}<span> / mes</span></p>
      <dl className={styles.datos}>
        <div>
          <dt>Planta</dt>
          <dd>{planta} · {ascensor ? 'con ascensor' : 'sin ascensor'}</dd>
        </div>
        <div><dt>Accesibilidad</dt><dd>{textoAccesibilidad(accesibilidad)}</dd></div>
      </dl>
      <Link className={styles.enlace} to={`/viviendas/${id}`}>
        Ver vivienda {referencia}
      </Link>
      </div>
    </article>
  );
}