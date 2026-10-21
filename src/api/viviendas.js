import { pedir } from './cliente.js';

export function getViviendas() {
  return pedir('/viviendas');
}

export function getVivienda(id) {
  return pedir(`/viviendas/${encodeURIComponent(id)}`);
}