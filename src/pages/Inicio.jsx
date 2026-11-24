import { useMemo } from 'react';
import { Link } from 'react-router';
import CallCard from '../components/CallCard.jsx';
import Estado from '../components/Estado.jsx';
import Hero from '../components/Hero.jsx';
import useConvocatorias from '../hooks/useConvocatorias.js';
import useViviendas from '../hooks/useViviendas.js';
import { MAX_PREFERENCIAS } from '../context/solicitudReducer.js';
import styles from './Inicio.module.css';

const PASOS = [
  { titulo: 'Busca', texto: 'Filtra por provincia, tu hogar y tus ingresos. Solo verás viviendas a tu alcance.' },
  { titulo: 'Elige', texto: `Añade hasta ${MAX_PREFERENCIAS} viviendas de una misma convocatoria y ordénalas por preferencia.` },
  { titulo: 'Solicita', texto: 'Rellena tus datos en 4 pasos. Puedes cambiarla o retirarla mientras el plazo siga abierto.' },
];

export default function Inicio() {
  const { datos, cargando, error, vacio, recargar } = useConvocatorias();
  // Las viviendas libres sirven para contar cuántas quedan en cada convocatoria
  const { datos: libres } = useViviendas();

  const provincias = useMemo(
    () => [...new Set(datos.map((c) => c.provincia))].sort((a, b) => a.localeCompare(b, 'es')),
    [datos]
  );

  // { convocatoriaId: nº de viviendas libres }
  const libresPorConvocatoria = useMemo(() => {
    const cuenta = {};
    for (const v of libres) {
      // convocatoriaId es número y el id de la convocatoria es texto: se compara como texto
      const clave = String(v.convocatoriaId);
      cuenta[clave] = (cuenta[clave] ?? 0) + 1;
    }
    return cuenta;
  }, [libres]);

  const abiertas = datos.filter((c) => c.estado === 'abierta');
  const otras = datos.filter((c) => c.estado !== 'abierta');
  const contar = (c) => (libres.length ? libresPorConvocatoria[String(c.id)] ?? 0 : undefined);

  let contenido;
  if (cargando) {
    contenido = <Estado tipo="cargando" titulo="Cargando convocatorias…" filas={3} />;
  } else if (error) {
    contenido = (
      <Estado tipo="error" titulo="No se pudieron cargar las convocatorias." onAccion={recargar} />
    );
  } else if (vacio) {
    contenido = <Estado tipo="vacio" titulo="No hay convocatorias publicadas." />;
  } else {
    contenido = (
      <>
        <div className={styles.rejilla}>
          {abiertas.map((c) => (
            <CallCard key={c.id} convocatoria={c} libres={contar(c)} />
          ))}
        </div>

        {otras.length > 0 && (
          <>
            <h2 className={styles.subtitulo}>Cerradas y resueltas</h2>
            <div className={styles.rejilla}>
              {otras.map((c) => (
                <CallCard key={c.id} convocatoria={c} libres={contar(c)} />
              ))}
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <Hero provincias={provincias} />

      <section className={styles.seccion} id="convocatorias" aria-labelledby="convocatorias-titulo">
        <div className={styles.titulo}>
          <h2 id="convocatorias-titulo">Convocatorias abiertas</h2>
          <Link to="/viviendas">Ver todas las viviendas <span aria-hidden="true">→</span></Link>
        </div>
        {contenido}
      </section>

      <section className={styles.comoFunciona} id="como-funciona" aria-labelledby="como-titulo">
        <h2 id="como-titulo">Cómo funciona</h2>
        <ol>
          {PASOS.map((p, i) => (
            <li key={p.titulo}>
              <span className={styles.numero} aria-hidden="true">{i + 1}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
