import { pedir } from './cliente.js';

export function getConvocatorias() {
  return pedir('/convocatorias');
}

export function getConvocatoria(id) {
  return pedir(`/convocatorias/${encodeURIComponent(id)}`);
}