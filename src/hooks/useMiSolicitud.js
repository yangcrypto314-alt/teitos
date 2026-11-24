import { useCallback, useEffect, useState } from 'react';
import { getSolicitud } from '../api/solicitudes.js';
import { getConvocatoria } from '../api/convocatorias.js';
import { getVivienda } from '../api/viviendas.js';

const VACIO = { solicitud: null, convocatoria: null, viviendas: [] };

// Pide la solicitud enviada, su convocatoria y sus viviendas
export default function useMiSolicitud(id) {
  const [version, setVersion] = useState(0);
  // "clave" dice de qué petición (id + versión) son los datos guardados
  const [resultado, setResultado] = useState({ clave: null, datos: VACIO, error: null });

  const recargar = useCallback(() => setVersion((v) => v + 1), []);
  const clave = `${id}#${version}`;

  useEffect(() => {
    if (!id) return;
    let activo = true;

    getSolicitud(id)
      .then(async (solicitud) => {
        // La convocatoria y las viviendas son datos extra: si alguna falla, se muestra lo demás
        const [convocatoria, ...viviendas] = await Promise.all([
          getConvocatoria(solicitud.convocatoriaId).catch(() => null),
          ...solicitud.viviendas.map((v) => getVivienda(v).catch(() => null)),
        ]);
        if (activo) setResultado({ clave, datos: { solicitud, convocatoria, viviendas }, error: null });
      })
      .catch((e) => {
        if (activo) setResultado({ clave, datos: VACIO, error: e });
      });

    return () => {
      activo = false;
    };
  }, [id, clave]);

  // Sin id no hay nada que cargar
  const cargando = Boolean(id) && resultado.clave !== clave;
  const datos = id ? resultado.datos : VACIO;
  const error = cargando || !id ? null : resultado.error;

  return { ...datos, cargando, error, recargar };
}
