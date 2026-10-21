export function formatearFecha(iso) {
  if (!iso) return 'Sin fecha';
  const [anio, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${anio}`;
}

export function formatearRenta(renta) {
  if (renta === null || renta === undefined) return 'Sin dato';
  return `${renta} €/mes`;
}