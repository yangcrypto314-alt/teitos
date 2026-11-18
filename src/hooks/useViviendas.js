import { useCallback, useEffect, useState } from 'react';
import { getViviendas } from '../api/viviendas.js';

// Pide todas las viviendas y devuelve solo las libres, con sus tres estados
export default function useViviendas() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  // Cambiar "version" vuelve a lanzar el useEffect (botón «Reintentar»)
  const recargar = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);

    getViviendas()
      .then((lista) => {
        // Las viviendas adjudicadas quedan fuera del listado
        if (activo) setDatos(lista.filter((v) => !v.adjudicada));
      })
      .catch((e) => {
        if (activo) setError(e.message);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    // Si el componente desaparece antes de que llegue la respuesta, se ignora
    return () => {
      activo = false;
    };
  }, [version]);

  const vacio = !cargando && !error && datos.length === 0;

  return { datos, cargando, error, vacio, recargar };
}
