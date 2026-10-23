export const MAX_PREFERENCIAS = 3;

export const estadoInicial = {
  seleccion: [],
  borrador: {
    nombre: '',
    apellidos: '',
    documento: '',
    email: '',
    telefono: '',
    personas: '',
    ingresos: '',
  },
  paso: 1,
  solicitudId: null,
};

// Devuelve el motivo por el que no se puede añadir, o null si se puede
export function motivoRechazo(estado, vivienda) {
  if (estado.seleccion.some((s) => s.id === vivienda.id)) {
    return 'Esta vivienda ya está en tu solicitud.';
  }
  if (estado.seleccion.length >= MAX_PREFERENCIAS) {
    return `Solo puedes elegir hasta ${MAX_PREFERENCIAS} viviendas. Quita alguna para añadir esta.`;
  }
  if (
    estado.seleccion.length > 0 &&
    estado.seleccion[0].convocatoriaId !== vivienda.convocatoriaId
  ) {
    return 'Tu solicitud ya tiene viviendas de otra convocatoria. Solo puedes pedir viviendas de una misma convocatoria.';
  }
  return null;
}

export function solicitudReducer(estado, accion) {
  switch (accion.tipo) {
    case 'anadir':
      if (motivoRechazo(estado, accion.vivienda)) return estado;
      return { ...estado, seleccion: [...estado.seleccion, accion.vivienda] };

    case 'quitar':
      return {
        ...estado,
        seleccion: estado.seleccion.filter((s) => s.id !== accion.id),
      };

    case 'mover': {
      const i = estado.seleccion.findIndex((s) => s.id === accion.id);
      const j = i + accion.desplazamiento;
      if (i < 0 || j < 0 || j >= estado.seleccion.length) return estado;
      const copia = [...estado.seleccion];
      [copia[i], copia[j]] = [copia[j], copia[i]];
      return { ...estado, seleccion: copia };
    }

    case 'campo':
      return {
        ...estado,
        borrador: { ...estado.borrador, [accion.campo]: accion.valor },
      };

    case 'paso':
      return { ...estado, paso: accion.paso };

    case 'enviada':
      return { ...estadoInicial, solicitudId: accion.id };

    case 'vaciar':
      return estadoInicial;

    default:
      return estado;
  }
}