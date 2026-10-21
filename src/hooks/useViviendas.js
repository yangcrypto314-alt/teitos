import { useEffect, useState } from 'react';
import { getViviendas } from '../api/viviendas.js';

export default function useViviendas() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

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

    return () => {
      activo = false;
    };
  }, []);

  const vacio = !cargando && !error && datos.length === 0;

  return { datos, cargando, error, vacio };
}