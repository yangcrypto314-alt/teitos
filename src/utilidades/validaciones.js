import { cumpleIngresos, rangoIngresos, rentaMaxima } from '../reglas/acceso.js';

const LETRAS_DNI = 'TRWAGMYFPDXBNJZSQVHLCKE';

const euros = (n) => `${n.toLocaleString('es-ES')} €`;

// Devuelve el texto del error, o null si el DNI/NIE es correcto
export function validarDocumento(valor) {
  const v = valor.trim().toUpperCase();
  if (!v) return 'Escribe tu DNI o NIE.';
  const m = /^([XYZ]|\d)(\d{7})([A-Z])$/.exec(v);
  if (!m) {
    return 'El DNI tiene 8 números y una letra. El NIE empieza por X, Y o Z.';
  }
  const inicial = { X: '0', Y: '1', Z: '2' }[m[1]] ?? m[1];
  const numero = Number(inicial + m[2]);
  if (LETRAS_DNI[numero % 23] !== m[3]) {
    return 'La letra no corresponde a ese número.';
  }
  return null;
}

// Devuelve un objeto { campo: 'mensaje' } solo con los campos que tienen error
export function validarTodo(borrador, seleccion) {
  const e = {};

  if (!borrador.nombre.trim()) e.nombre = 'Escribe tu nombre.';
  if (!borrador.apellidos.trim()) e.apellidos = 'Escribe tus apellidos.';

  const errorDocumento = validarDocumento(borrador.documento);
  if (errorDocumento) e.documento = errorDocumento;

  const email = borrador.email.trim();
  if (!email) {
    e.email = 'Escribe tu correo electrónico.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    e.email = 'El correo no es válido. Ejemplo: nombre@correo.es';
  }

  const telefono = borrador.telefono.replace(/\s/g, '');
  if (!telefono) {
    e.telefono = 'Escribe tu teléfono.';
  } else if (!/^[6-9]\d{8}$/.test(telefono)) {
    e.telefono = 'El teléfono debe tener 9 cifras y empezar por 6, 7, 8 o 9.';
  }

  const personas = Number(borrador.personas);
  if (!borrador.personas) {
    e.personas = 'Elige cuántas personas viven en la vivienda.';
  }

  if (borrador.ingresos === '') {
    e.ingresos = 'Indica los ingresos netos anuales del hogar.';
  } else {
    const ingresos = Number(borrador.ingresos);
    if (Number.isNaN(ingresos) || ingresos <= 0) {
      e.ingresos = 'Los ingresos deben ser un número mayor que 0.';
    } else if (borrador.personas) {
      if (!cumpleIngresos(ingresos, personas)) {
        const { minimo, maximo } = rangoIngresos(personas);
        const cuantas = personas === 6 ? '6 o más' : personas;
        e.ingresos = `Con ${cuantas} ${personas === 1 ? 'persona' : 'personas'}, los ingresos deben estar entre ${euros(minimo)} y ${euros(maximo)}.`;
      } else {
        const limite = rentaMaxima(ingresos);
        const caras = seleccion.filter((v) => v.renta > limite);
        if (caras.length > 0) {
          e.ingresos = `Con esos ingresos la renta máxima es ${euros(Math.floor(limite))} al mes. La superan: ${caras
            .map((v) => v.referencia)
            .join(', ')}. Quítala en el paso 1 o revisa los ingresos.`;
        }
      }
    }
  }

  return e;
}