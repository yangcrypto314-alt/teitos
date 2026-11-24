import { useCallback, useEffect, useState } from 'react';
import { getConvocatorias } from '../api/convocatorias.js';

// Pide las convocatorias y devuelve los tres estados: cargando, error y vacío
export default function useConvocatorias() {
  const [version, setVersion] = useState(0);
  const [resultado, setResultado] = useState({ version: -1, datos: [], error: null });

  const recargar = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let activo = true;

    getConvocatorias()
      .then((lista) => {
        if (activo) setResultado({ version, datos: lista, error: null });
      })
      .catch((e) => {
        if (activo) setResultado({ version, datos: [], error: e.message });
      });

    return () => {
      activo = false;
    };
  }, [version]);

  const cargando = resultado.version !== version;
  const error = cargando ? null : resultado.error;
  const datos = resultado.datos;
  const vacio = !cargando && !error && datos.length === 0;

  return { datos, cargando, error, vacio, recargar };
}
