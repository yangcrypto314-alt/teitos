import { Link } from 'react-router';
import styles from './DwellingCard.module.css';
import { formatearPlanta, textoAccesibilidad } from '../utils/formato.js';

// Componente «Tarjeta de vivienda» de Figma.
// Variante: desactivada (vivienda adjudicada) se pinta atenuada y sin enlace.
export default function DwellingCard({ vivienda, desactivada = false }) {
  const {
    id, referencia, municipio, provincia, tipologia,
    superficie, renta, planta, ascensor, accesibilidad,
  } = vivienda;

  // 4.ª planta o más sin ascensor: se avisa con icono + texto
  const subidaDura = !ascensor && planta >= 4;

  return (
    <article className={`${styles.tarjeta} ${desactivada ? styles.desactivada : ''}`}>
      <div className={styles.imagen}>
        <span className={styles.imagenReferencia}>{referencia}</span>
        <img
          src={`/ilustraciones/${id}.svg`}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className={styles.contenido}>
        <h3 className={styles.lugar}>
          {municipio} <span>· {provincia}</span>
        </h3>
        <p className={styles.tipologia}>{tipologia} · {superficie} m²</p>
        <p className={styles.renta}>
          {renta == null ? 'Renta sin dato' : `${renta.toLocaleString('es-ES')} €`}
          {renta != null && <span> / mes</span>}
        </p>
        <dl className={styles.datos}>
          <div>
            <dt>Planta</dt>
            <dd className={subidaDura ? styles.aviso : ''}>
              {subidaDura && <span aria-hidden="true">▲ </span>}
              {formatearPlanta(planta)} · {ascensor ? 'con ascensor' : 'sin ascensor'}
            </dd>
          </div>
          <div>
            <dt>Accesibilidad</dt>
            <dd>{textoAccesibilidad(accesibilidad)}</dd>
          </div>
        </dl>
        {desactivada ? (
          <p className={styles.adjudicada}>Adjudicada</p>
        ) : (
          <Link className={styles.enlace} to={`/viviendas/${id}`}>
            Ver vivienda <span className={styles.oculto}>{referencia}</span>
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </article>
  );
}
