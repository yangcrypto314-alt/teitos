import { useEffect, useMemo, useReducer } from 'react';
import { SolicitudContext } from './solicitudContext.js';
import { estadoInicial, solicitudReducer } from './solicitudReducer.js';

const CLAVE = 'teitos-solicitud';

// La selección y el borrador sobreviven a recargar la página
function cargarEstado() {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado) return { ...estadoInicial, ...JSON.parse(guardado) };
  } catch {
    // Sin almacenamiento disponible: se empieza de cero
  }
  return estadoInicial;
}

export default function SolicitudProvider({ children }) {
  const [estado, dispatch] = useReducer(solicitudReducer, undefined, cargarEstado);

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(estado));
    } catch {
      // Sin almacenamiento disponible: la app sigue funcionando
    }
  }, [estado]);

  const valor = useMemo(() => ({ estado, dispatch }), [estado]);

  return (
    <SolicitudContext.Provider value={valor}>
      {children}
    </SolicitudContext.Provider>
  );
}