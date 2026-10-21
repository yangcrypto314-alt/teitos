// Quita tildes y eñes y pasa a minúsculas, para buscar sin distinguirlas
export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}