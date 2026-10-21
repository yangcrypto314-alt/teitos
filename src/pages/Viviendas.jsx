import { useMemo, useState } from 'react';
import DwellingCard from '../components/DwellingCard.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import Pagination from '../components/Pagination.jsx';
import useViviendas from '../hooks/useViviendas.js';
import { normalizar } from '../utils/texto.js';
import {
  cumpleIngresos,
  puedeAcceder,
  rangoIngresos,
  rentaMaxima,
} from '../reglas/acceso.js';
import styles from './Viviendas.module.css';

const POR_PAGINA = 12;

const FILTROS_INICIALES = {
  provincia: '',
  personas: '',
  ingresos: '',
  accesibilidad: [],
};

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

const euros = (n) => `${n.toLocaleString('es-ES')} €`;

export default function Viviendas() {
  const { datos, cargando, error, vacio } = useViviendas();
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('referencia');
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [pagina, setPagina] = useState(1);

  const ingresos = filtros.ingresos === '' ? null : Number(filtros.ingresos);
  const personas = filtros.personas === '' ? null : Number(filtros.personas);
  const reglaActiva = ingresos !== null && personas !== null;
  const hogarCumple = reglaActiva && cumpleIngresos(ingresos, personas);

  const provincias = useMemo(
    () =>
      [...new Set(datos.map((v) => v.provincia))].sort((a, b) =>
        a.localeCompare(b, 'es')
      ),
    [datos]
  );

  const resultados = useMemo(() => {
    const q = normalizar(busqueda.trim());
    const filtradas = datos.filter((v) => {
      if (filtros.provincia && v.provincia !== filtros.provincia) return false;
      if (
        filtros.accesibilidad.length > 0 &&
        !filtros.accesibilidad.includes(v.accesibilidad)
      ) {
        return false;
      }
      if (reglaActiva && !puedeAcceder(v, ingresos, personas)) return false;
      if (q) {
        const coincide = [v.municipio, v.provincia, v.referencia].some((c) =>
          normalizar(c).includes(q)
        );
        if (!coincide) return false;
      }
      return true;
    });
    return [...filtradas].sort(ORDENES[orden].comparar);
  }, [datos, busqueda, orden, filtros, reglaActiva, ingresos, personas]);

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

  function cambiarFiltro(campo, valor) {
    setFiltros((f) => ({ ...f, [campo]: valor }));
    setPagina(1);
  }

  function limpiarFiltros() {
    setFiltros(FILTROS_INICIALES);
    setPagina(1);
  }

  const { minimo, maximo } = reglaActiva ? rangoIngresos(personas) : {};
  const faltaUno = (ingresos !== null) !== (personas !== null);

  return (
    <section>
      <h2>Viviendas</h2>

      <FilterPanel
        filtros={filtros}
        provincias={provincias}
        onCambiar={cambiarFiltro}
        onLimpiar={limpiarFiltros}
      />

      {faltaUno && (
        <p role="status">
          Para aplicar la regla de acceso, indica las personas y los ingresos del hogar.
        </p>
      )}
      {reglaActiva && !hogarCumple && (
        <p role="alert">
          Con {personas === 6 ? '6 o más' : personas}{' '}
          {personas === 1 ? 'persona' : 'personas'}, los ingresos netos anuales del
          hogar deben estar entre {euros(minimo)} y {euros(maximo)} para acceder.
        </p>
      )}
      {reglaActiva && hogarCumple && (
        <p role="status">
          Renta máxima asumible: {euros(Math.floor(rentaMaxima(ingresos)))} al mes (30 % de
          los ingresos).
        </p>
      )}

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
        <p>Ninguna vivienda coincide con la búsqueda y los filtros.</p>
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