import { pedir } from './cliente.js';

export function getViviendas() {
  return pedir('/viviendas');
}