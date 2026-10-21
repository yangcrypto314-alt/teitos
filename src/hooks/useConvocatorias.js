import { useEffect, useState } from 'react';
import { getConvocatorias } from '../assets/api/convocatorias.js';

export default function useConvocatorias() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

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
  }, []);

  const vacio = !cargando && !error && datos.length === 0;

  return { datos, cargando, error, vacio };
}