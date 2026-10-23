import { useCallback, useEffect, useState } from 'react';
import { getSolicitud } from '../api/solicitudes.js';
import { getConvocatoria } from '../api/convocatorias.js';
import { getVivienda } from '../api/viviendas.js';

export default function useMiSolicitud(id) {
  const [datos, setDatos] = useState({
    solicitud: null,
    convocatoria: null,
    viviendas: [],
  });
  const [cargando, setCargando] = useState(Boolean(id));
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    if (!id) return;
    let activo = true;
    setCargando(true);
    setError(null);

    getSolicitud(id)
      .then(async (solicitud) => {
        // La convocatoria y las viviendas son datos extra: si alguna falla, se muestra lo demás
        const [convocatoria, ...viviendas] = await Promise.all([
          getConvocatoria(solicitud.convocatoriaId).catch(() => null),
          ...solicitud.viviendas.map((v) => getVivienda(v).catch(() => null)),
        ]);
        if (activo) setDatos({ solicitud, convocatoria, viviendas });
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
  }, [id, version]);

  return { ...datos, cargando, error, recargar };
}