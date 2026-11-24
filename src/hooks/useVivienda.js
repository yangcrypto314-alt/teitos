import { useEffect, useState } from 'react';
import { getVivienda } from '../api/viviendas.js';
import { getConvocatoria } from '../api/convocatorias.js';

// Pide una vivienda y su convocatoria (se unen a mano: _embed no funciona)
export default function useVivienda(id) {
  // "id" dice de qué vivienda son los datos guardados
  const [resultado, setResultado] = useState({
    id: null, vivienda: null, convocatoria: null, error: null,
  });

  useEffect(() => {
    let activo = true;

    getVivienda(id)
      .then(async (v) => {
        // La convocatoria es un dato extra: si falla, se muestra la vivienda igualmente
        const c = await getConvocatoria(v.convocatoriaId).catch(() => null);
        if (activo) setResultado({ id, vivienda: v, convocatoria: c, error: null });
      })
      .catch((e) => {
        if (activo) setResultado({ id, vivienda: null, convocatoria: null, error: e });
      });

    return () => {
      activo = false;
    };
  }, [id]);

  // Cargando = aún no han llegado los datos de ESTA vivienda
  const cargando = resultado.id !== id;
  if (cargando) return { vivienda: null, convocatoria: null, cargando, error: null };

  const { vivienda, convocatoria, error } = resultado;
  return { vivienda, convocatoria, cargando, error };
}
