import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import Modal from '../components/Modal.jsx';
import PasoDatos from '../components/PasoDatos.jsx';
import PasoHogar from '../components/PasoHogar.jsx';
import PasoRevision from '../components/PasoRevision.jsx';
import useSolicitud from '../hooks/useSolicitud.js';
import { crearSolicitud } from '../api/solicitudes.js';
import { MAX_PREFERENCIAS } from '../context/solicitudReducer.js';
import { validarTodo } from '../utils/validaciones.js';
import { formatearRenta } from '../utils/formato.js';
import styles from './Solicitud.module.css';

const PASOS = ['Preferencias', 'Datos personales', 'Hogar', 'Revisión'];

const CAMPOS_POR_PASO = {
  1: [],
  2: ['nombre', 'apellidos', 'documento', 'email', 'telefono'],
  3: ['personas', 'ingresos'],
  4: [],
};

export default function Solicitud() {
  const { estado, dispatch } = useSolicitud();
  const { seleccion, borrador, paso, solicitudId } = estado;
  const [tocados, setTocados] = useState({});
  const [modalAbierto, setModalAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(null);

  const errores = useMemo(
    () => validarTodo(borrador, seleccion),
    [borrador, seleccion]
  );

  // Ya hay una solicitud enviada
  if (solicitudId) {
    return (
      <section className={styles.pagina}>
        <div className={styles.estadoFinal}>
          <span aria-hidden="true">✓</span>
          <h1>Solicitud enviada</h1>
          <p role="status">Tu solicitud nº {solicitudId} está registrada.</p>
        </div>
        <p>
          <Link to="/mi-solicitud">Ver mi solicitud</Link>
        </p>
      </section>
    );
  }

  if (seleccion.length === 0) {
    return (
      <section className={styles.pagina}>
        <header className={styles.intro}>
          <p>Solicitud de vivienda</p>
          <h1>Prepara tu solicitud</h1>
        </header>
        <div className={styles.vacio}>
          <h2>Aún no has elegido una vivienda</h2>
          <p>
            Añade viviendas del <Link to="/viviendas">listado</Link> para empezar.
            Solo se pueden pedir viviendas de convocatorias abiertas.
          </p>
          <Link className={styles.botonEnlace} to="/viviendas">Buscar viviendas</Link>
        </div>
      </section>
    );
  }

  function tocar(campo) {
    setTocados((t) => ({ ...t, [campo]: true }));
  }

  function cambiar(campo, valor) {
    dispatch({ tipo: 'campo', campo, valor });
    tocar(campo);
  }

  function irAPaso(n) {
    dispatch({ tipo: 'paso', paso: n });
  }

  function siguiente() {
    const campos = CAMPOS_POR_PASO[paso];
    if (campos.some((c) => errores[c])) {
      // Al intentar avanzar se muestran todos los errores del paso
      setTocados((t) => ({
        ...t,
        ...Object.fromEntries(campos.map((c) => [c, true])),
      }));
      return;
    }
    irAPaso(paso + 1);
  }

  function abrirModal() {
    setErrorEnvio(null);
    setModalAbierto(true);
  }

  async function confirmarEnvio() {
    setEnviando(true);
    setErrorEnvio(null);
    try {
      const creada = await crearSolicitud({
        convocatoriaId: seleccion[0].convocatoriaId,
        viviendas: seleccion.map((v) => v.id), // en orden de preferencia
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
        fechaEnvio: new Date().toISOString().slice(0, 10),
        estado: 'enviada',
      });
      dispatch({ tipo: 'enviada', id: creada.id });
      setModalAbierto(false);
    } catch (e) {
      setErrorEnvio(e.message);
    } finally {
      setEnviando(false);
    }
  }

  const hayErrores = Object.keys(errores).length > 0;

  return (
    <section className={styles.pagina}>
      <header className={styles.intro}>
        <p>Solicitud de vivienda</p>
        <h1>Completa tu solicitud</h1>
        <span>Completa los pasos para participar en la convocatoria.</span>
      </header>

      <ol className={styles.pasos} aria-label="Pasos de la solicitud">
        {PASOS.map((nombre, i) => (
          <li key={nombre} aria-current={paso === i + 1 ? 'step' : undefined}>
            <span className={styles.numero}>{i + 1}</span>
            <span>{nombre}</span>
          </li>
        ))}
      </ol>

      <div className={styles.panelPaso}>
        {paso === 1 && (
          <>
            <div className={styles.tituloPaso}>
              <h2>Tus viviendas preferidas</h2>
              <p>Ordénalas según tu preferencia. Puedes elegir hasta {MAX_PREFERENCIAS} de una misma convocatoria.</p>
            </div>
          <p>
            La primera vivienda es la que más te interesa.
          </p>
          <ol className={styles.lista}>
            {seleccion.map((v, i) => (
              <li key={v.id} className={styles.item}>
                <div>
                  <strong>
                    {i + 1}. {v.referencia}
                  </strong>
                  <span>
                    {' '}
                    {v.municipio} ({v.provincia}) · {formatearRenta(v.renta)}
                  </span>
                </div>
                <div className={styles.botones}>
                  <button
                    type="button"
                    disabled={i === 0}
                    aria-label={`Subir ${v.referencia}`}
                    onClick={() =>
                      dispatch({ tipo: 'mover', id: v.id, desplazamiento: -1 })
                    }
                  >
                    Subir
                  </button>
                  <button
                    type="button"
                    disabled={i === seleccion.length - 1}
                    aria-label={`Bajar ${v.referencia}`}
                    onClick={() =>
                      dispatch({ tipo: 'mover', id: v.id, desplazamiento: 1 })
                    }
                  >
                    Bajar
                  </button>
                  <button
                    type="button"
                    aria-label={`Quitar ${v.referencia}`}
                    onClick={() => dispatch({ tipo: 'quitar', id: v.id })}
                  >
                    Quitar
                  </button>
                </div>
              </li>
            ))}
          </ol>
          <p>
            <Link to="/viviendas">Añadir más viviendas</Link>
          </p>
          </>
        )}

        {(paso === 2 || paso === 3) && (
          <form
            className={styles.formulario}
            noValidate
            onSubmit={(e) => e.preventDefault()}
          >
            <div className={styles.tituloPaso}>
              <h2>{paso === 2 ? 'Datos de la persona solicitante' : 'Tu hogar'}</h2>
              <p>
                {paso === 2
                  ? 'Usaremos estos datos para gestionar tu solicitud.'
                  : 'Indica el tamaño y los ingresos netos anuales de tu hogar.'}
              </p>
            </div>
            {paso === 2 && (
              <PasoDatos
                borrador={borrador}
                errores={errores}
                tocados={tocados}
                cambiar={cambiar}
                tocar={tocar}
              />
            )}
            {paso === 3 && (
              <PasoHogar
                borrador={borrador}
                errores={errores}
                tocados={tocados}
                cambiar={cambiar}
                tocar={tocar}
              />
            )}
          </form>
        )}

        {paso === 4 && (
          <div className={styles.revision}>
            <div className={styles.tituloPaso}>
              <h2>Revisa tus datos</h2>
              <p>Comprueba que toda la información es correcta antes de enviar.</p>
            </div>
            {hayErrores && (
              <p role="alert">
                ⚠ Hay datos por corregir. Vuelve atrás y revisa los pasos anteriores.
              </p>
            )}
            <PasoRevision
              seleccion={seleccion}
              borrador={borrador}
              className={styles.resumen}
            />
          </div>
        )}
      </div>

      <div className={styles.navegacion}>
        {paso > 1 ? (
          <button type="button" onClick={() => irAPaso(paso - 1)}>
            Atrás
          </button>
        ) : (
          <span />
        )}
        {paso < PASOS.length ? (
          <button type="button" onClick={siguiente}>
            Siguiente
          </button>
        ) : (
          <button type="button" onClick={abrirModal} disabled={hayErrores}>
            Enviar solicitud
          </button>
        )}
      </div>

      <Modal
        abierto={modalAbierto}
        titulo="¿Enviar tu solicitud?"
        onCerrar={() => setModalAbierto(false)}
        acciones={
          <>
            <button
              type="button"
              onClick={() => setModalAbierto(false)}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button type="button" onClick={confirmarEnvio} disabled={enviando}>
              {enviando ? 'Enviando…' : 'Confirmar y enviar'}
            </button>
          </>
        }
      >
        <p>
          Vas a enviar tu solicitud con {seleccion.length}{' '}
          {seleccion.length === 1 ? 'vivienda' : 'viviendas'}, por el orden de
          preferencia que has elegido. Podrás modificarla o retirarla mientras la
          convocatoria siga abierta.
        </p>
        {errorEnvio && (
          <p role="alert">
            ⚠ No se ha podido enviar la solicitud. Inténtalo de nuevo. ({errorEnvio})
          </p>
        )}
      </Modal>
    </section>
  );
}