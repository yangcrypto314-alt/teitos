import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import TarjetaVivienda from '../componentes/viviendas/TarjetaVivienda.jsx';
import Estado from '../componentes/comunes/Estado.jsx';
import Filtros from '../componentes/viviendas/Filtros.jsx';
import MensajeError from '../componentes/comunes/MensajeError.jsx';
import Paginacion from '../componentes/comunes/Paginacion.jsx';
import useViviendas from '../hooks/useViviendas.js';
import { normalizar } from '../utilidades/texto.js';
import {
  cumpleIngresos,
  puedeAcceder,
  rangoIngresos,
  rentaMaxima,
} from '../reglas/acceso.js';
import styles from './Viviendas.module.css';

const POR_PAGINA = 12;

const ORDENES = {
  referencia: {
    texto: 'Referencia',
    comparar: (a, b) => a.referencia.localeCompare(b.referencia),
  },
  rentaAsc: {
    texto: 'Menor renta',
    comparar: (a, b) => a.renta - b.renta,
  },
  rentaDesc: {
    texto: 'Mayor renta',
    comparar: (a, b) => b.renta - a.renta,
  },
  superficieAsc: {
    texto: 'Menor superficie',
    comparar: (a, b) => a.superficie - b.superficie,
  },
  superficieDesc: {
    texto: 'Mayor superficie',
    comparar: (a, b) => b.superficie - a.superficie,
  },
};

const euros = (n) => `${n.toLocaleString('es-ES')} €`;

export default function Viviendas() {
  const { datos, cargando, error, recargar } = useViviendas();

  // Todos los filtros viven en la URL: /viviendas?provincia=Lugo&personas=2…
  // Así la búsqueda se puede copiar y pegar en un correo.
  const [params, setParams] = useSearchParams();
  const busqueda = params.get('q') ?? '';
  const orden = ORDENES[params.get('orden')] ? params.get('orden') : 'referencia';
  const pagina = Math.max(1, Number(params.get('pagina')) || 1);
  const filtros = {
    provincia: params.get('provincia') ?? '',
    personas: params.get('personas') ?? '',
    ingresos: params.get('ingresos') ?? '',
    accesibilidad: params.get('acc') ? params.get('acc').split(',') : [],
  };

  // Cambia uno o varios parámetros de la URL y vuelve a la página 1
  function actualizar(cambios, { mantenerPagina = false } = {}) {
    setParams(
      (anteriores) => {
        const nuevos = new URLSearchParams(anteriores);
        for (const [clave, valor] of Object.entries(cambios)) {
          if (valor === '' || valor === null || valor.length === 0) nuevos.delete(clave);
          else nuevos.set(clave, Array.isArray(valor) ? valor.join(',') : valor);
        }
        if (!mantenerPagina) nuevos.delete('pagina');
        return nuevos;
      },
      { replace: true } // no llena el historial con cada tecla
    );
  }

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

  // Filtrar + buscar + ordenar. useMemo: solo se recalcula si cambia algo.
  const acc = filtros.accesibilidad.join(',');
  const resultados = useMemo(() => {
    const q = normalizar(busqueda.trim());
    const medidas = acc ? acc.split(',') : [];
    const filtradas = datos.filter((v) => {
      if (filtros.provincia && v.provincia !== filtros.provincia) return false;
      if (medidas.length > 0 && !medidas.includes(v.accesibilidad)) return false;
      // Personas e ingresos no comparan un campo: aplican la regla de acceso
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
  }, [datos, busqueda, orden, filtros.provincia, acc, reglaActiva, ingresos, personas]);

  const totalPaginas = Math.max(1, Math.ceil(resultados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles = resultados.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA
  );

  function limpiarFiltros() {
    setParams({}, { replace: true });
  }

  function cambiarPagina(n) {
    actualizar({ pagina: String(n) }, { mantenerPagina: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const { minimo, maximo } = reglaActiva ? rangoIngresos(personas) : {};
  const faltaUno = (ingresos !== null) !== (personas !== null);

  // Contenido de la columna de resultados según el estado de la petición
  let contenido;
  if (cargando) {
    contenido = <Estado tipo="cargando" titulo="Cargando viviendas…" filas={6} />;
  } else if (error) {
    contenido = (
      <Estado
        tipo="error"
        titulo="No se pudieron cargar las viviendas."
        onAccion={recargar}
      />
    );
  } else if (resultados.length === 0) {
    contenido = (
      <Estado
        tipo="vacio"
        titulo="No hay resultados"
        texto="Prueba a cambiar los filtros o ampliar tu búsqueda para ver más viviendas."
        accion="Limpiar filtros"
        onAccion={limpiarFiltros}
      />
    );
  } else {
    contenido = (
      <>
        <div className={styles.rejilla}>
          {visibles.map((v) => (
            <TarjetaVivienda key={v.id} vivienda={v} />
          ))}
        </div>
        <Paginacion
          pagina={paginaActual}
          totalPaginas={totalPaginas}
          onCambiar={cambiarPagina}
        />
      </>
    );
  }

  return (
    <section className={styles.pagina}>
      <header className={styles.intro}>
        <p>Encuentra tu próximo hogar</p>
        <h1>Viviendas disponibles</h1>
        <span>Explora las viviendas y encuentra la que mejor se adapta a tu hogar.</span>
      </header>

      <form
        className={styles.buscador}
        role="search"
        onSubmit={(e) => e.preventDefault()}
      >
        <label htmlFor="busqueda" className={styles.oculto}>
          Municipio, provincia o referencia
        </label>
        <span className={styles.lupa} aria-hidden="true">⌕</span>
        <input
          id="busqueda"
          type="search"
          value={busqueda}
          onChange={(e) => actualizar({ q: e.target.value })}
          placeholder="Municipio, provincia o referencia"
        />
      </form>

      <div className={styles.columnas}>
        <Filtros
          filtros={filtros}
          provincias={provincias}
          onCambiar={(campo, valor) =>
            actualizar({ [campo === 'accesibilidad' ? 'acc' : campo]: valor })
          }
          onLimpiar={limpiarFiltros}
        />

        <div className={styles.listado}>
          {faltaUno && (
            <p className={styles.nota} role="status">
              Para aplicar la regla de acceso, indica las personas y los ingresos del hogar.
            </p>
          )}
          {reglaActiva && !hogarCumple && (
            <MensajeError>
              Con {personas === 6 ? '6 o más' : personas}{' '}
              {personas === 1 ? 'persona' : 'personas'}, los ingresos netos anuales del
              hogar deben estar entre {euros(minimo)} y {euros(maximo)} para acceder.
            </MensajeError>
          )}
          {reglaActiva && hogarCumple && (
            <p className={styles.nota} role="status">
              ✓ Tu hogar cumple la regla. Renta máxima asumible:{' '}
              <strong>{euros(Math.floor(rentaMaxima(ingresos)))} al mes</strong> (30 % de
              los ingresos).
            </p>
          )}

          <div className={styles.resultados}>
            <p role="status">
              {!cargando && !error && (
                <>
                  <strong>{resultados.length.toLocaleString('es-ES')}</strong>{' '}
                  {resultados.length === 1 ? 'vivienda disponible' : 'viviendas disponibles'}
                </>
              )}
            </p>
            <label htmlFor="orden">
              Ordenar por
              <select
                id="orden"
                value={orden}
                onChange={(e) => actualizar({ orden: e.target.value })}
              >
                {Object.entries(ORDENES).map(([clave, o]) => (
                  <option key={clave} value={clave}>
                    {o.texto}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {contenido}
        </div>
      </div>
    </section>
  );
}
