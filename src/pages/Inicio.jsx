import CallCard from '../components/CallCard.jsx';
import useConvocatorias from '../hooks/useConvocatorias.js';
import styles from './Inicio.module.css';

export default function Inicio() {
  const { datos, cargando, error, vacio } = useConvocatorias();

  if (cargando) return <p role="status">Cargando convocatorias…</p>;
  if (error) {
    return <p role="alert">No se han podido cargar las convocatorias. ({error})</p>;
  }
  if (vacio) return <p>No hay convocatorias disponibles.</p>;

  const abiertas = datos.filter((c) => c.estado === 'abierta');
  const otras = datos.filter((c) => c.estado !== 'abierta');

  return (
    <section>
      <h2>Convocatorias abiertas</h2>
      <div className={styles.rejilla}>
        {abiertas.map((c) => (
          <CallCard key={c.id} convocatoria={c} />
        ))}
      </div>

      <h2>Cerradas y resueltas</h2>
      <div className={styles.rejilla}>
        {otras.map((c) => (
          <CallCard key={c.id} convocatoria={c} />
        ))}
      </div>
    </section>
  );
}