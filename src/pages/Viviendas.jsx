import { useMemo, useState } from 'react';
import DwellingCard from '../components/DwellingCard.jsx';
import Pagination from '../components/Pagination.jsx';
import useViviendas from '../hooks/useViviendas.js';
import { normalizar } from '../utils/texto.js';
import styles from './Viviendas.module.css';

const POR_PAGINA = 12;

const ORDENES = {
  referencia: {
    texto: 'Referencia',
    comparar: (a, b) => a.referencia.localeCompare(b.referencia),
  },
  rentaAsc: {
    texto: 'Renta: de menor a mayor',
    comparar: (a, b) => a.renta - b.renta,
  },
  rentaDesc: {
    texto: 'Renta: de mayor a menor',
    comparar: (a, b) => b.renta - a.renta,
  },
  superficieAsc: {
    texto: 'Superficie: de menor a mayor',
    comparar: (a, b) => a.superficie - b.superficie,
  },
  superficieDesc: {
    texto: 'Superficie: de mayor a menor',
    comparar: (a, b) => b.superficie - a.superficie,
  },
};

export default function Viviendas() {
  const { datos, cargando, error, vacio } = useViviendas();
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('referencia');
  const [pagina, setPagina] = useState(1);

  const resultados = useMemo(() => {
    const q = normalizar(busqueda.trim());
    const filtradas = q
      ? datos.filter((v) =>
          [v.municipio, v.provincia, v.referencia].some((campo) =>
            normalizar(campo).includes(q)
          )
        )
      : datos;
    return [...filtradas].sort(ORDENES[orden].comparar);
  }, [datos, busqueda, orden]);

  if (cargando) return <p role="status">Cargando viviendas…</p>;
  if (error) {
    return <p role="alert">No se han podido cargar las viviendas. ({error})</p>;
  }
  if (vacio) return <p>No hay viviendas disponibles.</p>;

  const totalPaginas = Math.max(1, Math.ceil(resultados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = resultados.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA
  );

  function cambiarBusqueda(e) {
    setBusqueda(e.target.value);
    setPagina(1);
  }

  function cambiarOrden(e) {
    setOrden(e.target.value);
    setPagina(1);
  }

  return (
    <section>
      <h2>Viviendas</h2>

      <form
        className={styles.controles}
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className={styles.campo}>
          <label htmlFor="busqueda">Municipio, provincia o referencia</label>
          <input
            id="busqueda"
            type="search"
            value={busqueda}
            onChange={cambiarBusqueda}
            placeholder="Ej.: Coruña o 26-7-LUG"
          />
        </div>
        <div className={styles.campo}>
          <label htmlFor="orden">Ordenar por</label>
          <select id="orden" value={orden} onChange={cambiarOrden}>
            {Object.entries(ORDENES).map(([clave, o]) => (
              <option key={clave} value={clave}>
                {o.texto}
              </option>
            ))}
          </select>
        </div>
      </form>

      <p role="status">{resultados.length} viviendas libres</p>

      {resultados.length === 0 ? (
        <p>Ninguna vivienda coincide con la búsqueda.</p>
      ) : (
        <>
          <div className={styles.rejilla}>
            {visibles.map((v) => (
              <DwellingCard key={v.id} vivienda={v} />
            ))}
          </div>
          <Pagination
            pagina={paginaActual}
            totalPaginas={totalPaginas}
            onCambiar={setPagina}
          />
        </>
      )}
    </section>
  );
}