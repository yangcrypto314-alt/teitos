import { useContext } from 'react';
import { SolicitudContext } from '../context/solicitudContext.js';

export default function useSolicitud() {
  const contexto = useContext(SolicitudContext);
  if (!contexto) {
    throw new Error('useSolicitud debe usarse dentro de SolicitudProvider');
  }
  return contexto;
}