import { useCallback, useEffect, useState } from 'react';
import { getConvocatorias } from '../api/convocatorias.js';

// Pide las convocatorias y devuelve los tres estados: cargando, error y vacío
export default function useConvocatorias() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);

    getConvocatorias()
      .then((lista) => {
        if (activo) setDatos(lista);
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
  }, [version]);

  const vacio = !cargando && !error && datos.length === 0;

  return { datos, cargando, error, vacio, recargar };
}
