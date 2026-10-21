// Regla de acceso del caso (simplificación de la real)
export const IPREM_ANUAL = 8400;
export const VECES_MINIMO = 2;
export const VECES_MAXIMO = 7.5;
export const ESFUERZO_MAXIMO = 0.3;

const PONDERACION = { 1: 1, 2: 1.15, 3: 1.3, 4: 1.45, 5: 1.6 };

export function ponderacion(personas) {
  const n = Number(personas);
  if (n >= 6) return 1.75;
  return PONDERACION[n];
}

function redondear(x) {
  return Math.round(x * 100) / 100;
}

// Ingresos netos anuales mínimos y máximos para un hogar de N personas
export function rangoIngresos(personas) {
  const iprem = IPREM_ANUAL * ponderacion(personas);
  return {
    minimo: redondear(iprem * VECES_MINIMO),
    maximo: redondear(iprem * VECES_MAXIMO),
  };
}

export function cumpleIngresos(ingresos, personas) {
  const { minimo, maximo } = rangoIngresos(personas);
  return ingresos >= minimo && ingresos <= maximo;
}

// Renta mensual máxima que el hogar puede asumir (30 % del ingreso mensual)
export function rentaMaxima(ingresos) {
  return (ingresos / 12) * ESFUERZO_MAXIMO;
}

export function puedeAcceder(vivienda, ingresos, personas) {
  return (
    cumpleIngresos(ingresos, personas) &&
    vivienda.renta <= rentaMaxima(ingresos)
  );
}