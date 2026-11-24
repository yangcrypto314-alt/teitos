export function formatearFecha(iso) {
  if (!iso) return 'Sin fecha';
  const [anio, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${anio}`;
}

export function formatearRenta(renta) {
  if (renta === null || renta === undefined) return 'Sin dato';
  return `${renta} €/mes`;
}

// 0 → «Planta baja», 4 → «4.ª planta»
export function formatearPlanta(planta) {
  if (planta === null || planta === undefined) return 'Planta sin dato';
  if (Number(planta) === 0) return 'Planta baja';
  return `${planta}.ª planta`;
}

const ACCESIBILIDAD = {
  adaptada: 'Adaptada',
  practicable: 'Practicable',
  sin_adaptar: 'Sin adaptar',
};

export function textoAccesibilidad(valor) {
  // Sin dato no es lo mismo que "sin adaptar"
  if (valor === undefined || valor === null) return 'Sin dato';
  return ACCESIBILIDAD[valor] ?? valor;
}
// Fecha de hoy "AAAA-MM-DD" en hora local (toISOString usa UTC y de noche da el día anterior)
export function hoyISO() {
  const d = new Date();
  const dos = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}
