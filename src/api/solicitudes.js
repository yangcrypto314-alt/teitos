import { pedir } from './cliente.js';

const CABECERAS = { 'Content-Type': 'application/json' };

export function crearSolicitud(datos) {
  return pedir('/solicitudes', {
    method: 'POST',
    headers: CABECERAS,
    body: JSON.stringify(datos),
  });
}

export function getSolicitud(id) {
  return pedir(`/solicitudes/${encodeURIComponent(id)}`);
}

export function actualizarSolicitud(id, datos) {
  return pedir(`/solicitudes/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: CABECERAS,
    body: JSON.stringify(datos),
  });
}

export function retirarSolicitud(id) {
  return pedir(`/solicitudes/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}