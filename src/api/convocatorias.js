import { pedir } from './cliente.js';

export function getConvocatorias() {
  return pedir('/convocatorias');
}