import Boton from '../components/Boton.jsx';
import styles from './NoEncontrada.module.css';

// Página 404: cualquier ruta que no exista acaba aquí (path="*")
export default function NoEncontrada() {
  return (
    <section className={styles.pagina} aria-labelledby="titulo-404">
      <svg className={styles.dibujo} viewBox="0 0 200 140" aria-hidden="true">
        <path d="M10 120Q60 92 100 112T190 108V140H10Z" fill="#B9D3B5" />
        <path d="M60 60 100 30l40 30v62H60z" fill="#F6F4EA" stroke="#547567" strokeWidth="3" strokeDasharray="6 6" />
        <text x="100" y="98" textAnchor="middle" fontSize="30" fontWeight="700" fill="#1C7058">?</text>
      </svg>
      <p className={styles.codigo}>Error 404</p>
      <h1 id="titulo-404">Este teito no existe</h1>
      <p>La dirección que has escrito no existe o ha cambiado. Pero hay muchas viviendas esperándote.</p>
      <div className={styles.acciones}>
        <Boton to="/viviendas">Ver viviendas</Boton>
        <Boton to="/" variante="secundario">Volver al inicio</Boton>
      </div>
    </section>
  );
}
