import { useCallback, useEffect, useState } from 'react';
import { getViviendas } from '../api/viviendas.js';

// Pide todas las viviendas y devuelve solo las libres, con sus tres estados
export default function useViviendas() {
  const [version, setVersion] = useState(0);
  // "version" dice a qué petición pertenecen los datos guardados
  const [resultado, setResultado] = useState({ version: -1, datos: [], error: null });

  // Cambiar "version" vuelve a lanzar el useEffect (botón «Reintentar»)
  const recargar = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let activo = true;

    getViviendas()
      .then((lista) => {
        // Las viviendas adjudicadas quedan fuera del listado
        if (activo) setResultado({ version, datos: lista.filter((v) => !v.adjudicada), error: null });
      })
      .catch((e) => {
        if (activo) setResultado({ version, datos: [], error: e.message });
      });

    // Si el componente desaparece antes de que llegue la respuesta, se ignora
    return () => {
      activo = false;
    };
  }, [version]);

  // Cargando = todavía no ha llegado la respuesta de la petición actual
  const cargando = resultado.version !== version;
  const error = cargando ? null : resultado.error;
  const datos = resultado.datos;
  const vacio = !cargando && !error && datos.length === 0;

  return { datos, cargando, error, vacio, recargar };
}
