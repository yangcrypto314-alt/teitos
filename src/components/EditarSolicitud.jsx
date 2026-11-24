import { useState } from 'react';
import PasoDatos from './PasoDatos.jsx';
import PasoHogar from './PasoHogar.jsx';
import { actualizarSolicitud } from '../api/solicitudes.js';
import { validarTodo } from '../utils/validaciones.js';
import { formatearRenta, hoyISO } from '../utils/formato.js';
import styles from '../pages/Solicitud.module.css';

const CAMPOS = [
  'nombre', 'apellidos', 'documento', 'email', 'telefono', 'personas', 'ingresos',
];

export default function EditarSolicitud({ solicitud, viviendas, onGuardada, onCancelar }) {
  const [borrador, setBorrador] = useState({
    ...solicitud.solicitante,
    personas: String(solicitud.hogar.personas),
    ingresos: String(solicitud.hogar.ingresos),
  });
  const [orden, setOrden] = useState(solicitud.viviendas);
  const [tocados, setTocados] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);

  const porId = Object.fromEntries(
    viviendas.filter(Boolean).map((v) => [v.id, v])
  );
  const seleccion = orden.map((id) => porId[id]).filter(Boolean);
  const errores = validarTodo(borrador, seleccion);

  function tocar(campo) {
    setTocados((t) => ({ ...t, [campo]: true }));
  }

  function cambiar(campo, valor) {
    setBorrador((b) => ({ ...b, [campo]: valor }));
    tocar(campo);
  }

  function mover(id, desplazamiento) {
    setOrden((o) => {
      const i = o.indexOf(id);
      const j = i + desplazamiento;
      if (i < 0 || j < 0 || j >= o.length) return o;
      const copia = [...o];
      [copia[i], copia[j]] = [copia[j], copia[i]];
      return copia;
    });
  }

  async function guardar(e) {
    e.preventDefault();
    if (Object.keys(errores).length > 0) {
      setTocados(Object.fromEntries(CAMPOS.map((c) => [c, true])));
      return;
    }
    setGuardando(true);
    setErrorGuardar(null);
    try {
      await actualizarSolicitud(solicitud.id, {
        ...solicitud,
        viviendas: orden,
        solicitante: {
          nombre: borrador.nombre.trim(),
          apellidos: borrador.apellidos.trim(),
          documento: borrador.documento.trim().toUpperCase(),
          email: borrador.email.trim(),
          telefono: borrador.telefono.replace(/\s/g, ''),
        },
        hogar: {
          personas: Number(borrador.personas),
          ingresos: Number(borrador.ingresos),
        },
        fechaModificacion: hoyISO(),
      });
      onGuardada();
    } catch (err) {
      setErrorGuardar(err.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form className={styles.formulario} noValidate onSubmit={guardar}>
      <h3>Orden de preferencia</h3>
      <ol className={styles.lista}>
        {orden.map((id, i) => {
          const v = porId[id];
          const nombre = v ? v.referencia : `Vivienda ${id}`;
          return (
            <li key={id} className={styles.item}>
              <div>
                <strong>
                  {i + 1}. {nombre}
                </strong>
                {v && (
                  <span>
                    {' '}
                    {v.municipio} ({v.provincia}) · {formatearRenta(v.renta)}
                  </span>
                )}
              </div>
              <div className={styles.botones}>
                <button
                  type="button"
                  disabled={i === 0}
                  aria-label={`Subir ${nombre}`}
                  onClick={() => mover(id, -1)}
                >
                  Subir
                </button>
                <button
                  type="button"
                  disabled={i === orden.length - 1}
                  aria-label={`Bajar ${nombre}`}
                  onClick={() => mover(id, 1)}
                >
                  Bajar
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <h3>Datos personales</h3>
      <PasoDatos
        borrador={borrador}
        errores={errores}
        tocados={tocados}
        cambiar={cambiar}
        tocar={tocar}
      />

      <h3>Hogar</h3>
      <PasoHogar
        borrador={borrador}
        errores={errores}
        tocados={tocados}
        cambiar={cambiar}
        tocar={tocar}
      />

      {errorGuardar && (
        <p role="alert">
          ⚠ No se han podido guardar los cambios. ({errorGuardar})
        </p>
      )}

      <div className={styles.navegacion}>
        <button type="button" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );
}