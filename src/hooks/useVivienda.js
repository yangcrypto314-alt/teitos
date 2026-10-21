import { useEffect, useState } from 'react';
import { getVivienda } from '../api/viviendas.js';
import { getConvocatoria } from '../api/convocatorias.js';

export default function useVivienda(id) {
  const [vivienda, setVivienda] = useState(null);
  const [convocatoria, setConvocatoria] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);

    getVivienda(id)
      .then(async (v) => {
        // La convocatoria es un dato extra: si falla, se muestra la vivienda igualmente
        const c = await getConvocatoria(v.convocatoriaId).catch(() => null);
        if (activo) {
          setVivienda(v);
          setConvocatoria(c);
        }
      })
      .catch((e) => {
        if (activo) setError(e);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [id]);

  return { vivienda, convocatoria, cargando, error };
}