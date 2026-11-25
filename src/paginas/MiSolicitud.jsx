import { useState } from 'react';
import { Link } from 'react-router';
import EditarSolicitud from '../componentes/solicitud/EditarSolicitud.jsx';
import Boton from '../componentes/comunes/Boton.jsx';
import Estado from '../componentes/comunes/Estado.jsx';
import Modal from '../componentes/comunes/Modal.jsx';
import PasoRevision from '../componentes/solicitud/PasoRevision.jsx';
import useMiSolicitud from '../hooks/useMiSolicitud.js';
import useSolicitud from '../hooks/useSolicitud.js';
import { retirarSolicitud } from '../api/solicitudes.js';
import { formatearFecha } from '../utilidades/formato.js';
import styles from './Solicitud.module.css';

export default function MiSolicitud() {
  const { estado, dispatch } = useSolicitud();
  const { solicitudId } = estado;
  const { solicitud, convocatoria, viviendas, cargando, error, recargar } =
    useMiSolicitud(solicitudId);

  const [editando, setEditando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [modalRetirar, setModalRetirar] = useState(false);
  const [retirando, setRetirando] = useState(false);
  const [errorRetirar, setErrorRetirar] = useState(null);
  const [retirada, setRetirada] = useState(false);

  if (retirada) {
    return (
      <section className={styles.pagina}>
        <h1>Mi solicitud</h1>
        <p role="status">Tu solicitud ha sido retirada.</p>
        <p>
          <Link to="/viviendas">Buscar viviendas</Link>
        </p>
      </section>
    );
  }

  if (!solicitudId) {
    return (
      <section className={styles.pagina}>
        <header className={styles.intro}>
          <p>Área personal</p>
          <h1>Mi solicitud</h1>
        </header>
        <div className={styles.vacio}>
          <h2>Aún no has enviado ninguna solicitud</h2>
          <p>
            Todavía no has enviado ninguna solicitud. Elige viviendas en el{' '}
            <Link to="/viviendas">listado</Link> y completa la{' '}
            <Link to="/solicitud">solicitud</Link>.
          </p>
        </div>
      </section>
    );
  }

  if (cargando) return <Estado tipo="cargando" titulo="Cargando tu solicitud…" filas={1} />;

  if (error) {
    const noExiste = error.estado === 404;
    return (
      <section className={styles.pagina}>
        <h1>Mi solicitud</h1>
        {noExiste ? (
          <Estado
            tipo="vacio"
            titulo="Tu solicitud ya no existe en el servidor"
            texto="Puede que se hayan restaurado los datos. Puedes preparar una nueva."
            accion="Empezar de nuevo"
            onAccion={() => dispatch({ tipo: 'vaciar' })}
          />
        ) : (
          <Estado tipo="error" titulo="No se pudo cargar tu solicitud." onAccion={recargar} />
        )}
      </section>
    );
  }

  if (!solicitud) return null;

  const abierta = convocatoria?.estado === 'abierta';

  async function confirmarRetirada() {
    setRetirando(true);
    setErrorRetirar(null);
    try {
      await retirarSolicitud(solicitud.id);
      dispatch({ tipo: 'vaciar' });
      setModalRetirar(false);
      setRetirada(true);
    } catch (e) {
      setErrorRetirar(e.message);
    } finally {
      setRetirando(false);
    }
  }

  return (
    <section className={styles.pagina}>
      <header className={styles.intro}>
        <p>Área personal</p>
        <h1>Mi solicitud</h1>
      </header>
      <div className={styles.panelPaso}>
        <p>
          Solicitud nº {solicitud.id} · enviada el {formatearFecha(solicitud.fechaEnvio)}
          {solicitud.fechaModificacion &&
            ` · modificada el ${formatearFecha(solicitud.fechaModificacion)}`}
        </p>
        <p>
          Convocatoria:{' '}
          {convocatoria
            ? `${convocatoria.codigo} (${convocatoria.estado}) · plazo hasta el ${formatearFecha(convocatoria.fechaCierre)}`
            : 'Sin dato'}
        </p>

        {guardado && !editando && (
          <p role="status">Cambios guardados.</p>
        )}

        {!abierta && (
          <p role="status">
            El plazo de esta convocatoria ya no está abierto: la solicitud no se puede
            modificar ni retirar.
          </p>
        )}

        {editando && abierta ? (
          <EditarSolicitud
            solicitud={solicitud}
            viviendas={viviendas}
            onCancelar={() => setEditando(false)}
            onGuardada={() => {
              setEditando(false);
              setGuardado(true);
              recargar();
            }}
          />
        ) : (
          <>
            <div className={styles.revision}>
              <PasoRevision
                seleccion={viviendas.filter(Boolean)}
                borrador={{
                  ...solicitud.solicitante,
                  personas: String(solicitud.hogar.personas),
                  ingresos: String(solicitud.hogar.ingresos),
                }}
                className={styles.resumen}
              />
            </div>

            {abierta && (
              <div className={styles.navegacion}>
                <button
                  type="button"
                  onClick={() => {
                    setGuardado(false);
                    setEditando(true);
                  }}
                >
                  Modificar
                </button>
                <Boton variante="peligro" onClick={() => setModalRetirar(true)}>
                  Retirar solicitud
                </Boton>
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        abierto={modalRetirar}
        titulo="¿Retirar tu solicitud?"
        onCerrar={() => setModalRetirar(false)}
        acciones={
          <>
            <button
              type="button"
              onClick={() => setModalRetirar(false)}
              disabled={retirando}
            >
              Cancelar
            </button>
            <Boton variante="peligro" onClick={confirmarRetirada} disabled={retirando}>
              {retirando ? 'Retirando…' : 'Sí, retirar'}
            </Boton>
          </>
        }
      >
        <p>
          Se eliminará tu solicitud nº {solicitud.id}. Mientras la convocatoria siga
          abierta, podrás hacer otra.
        </p>
        {errorRetirar && (
          <p role="alert">
            ⚠ No se ha podido retirar la solicitud. Inténtalo de nuevo. ({errorRetirar})
          </p>
        )}
      </Modal>
    </section>
  );
}