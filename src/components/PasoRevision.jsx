import { formatearRenta } from '../utils/formato.js';

export default function PasoRevision({ seleccion, borrador, className }) {
  const personas = borrador.personas === '6' ? '6 o más' : borrador.personas;

  return (
    <>
      <h3>Viviendas, por orden de preferencia</h3>
      <ol>
        {seleccion.map((v) => (
          <li key={v.id}>
            {v.referencia} · {v.municipio} ({v.provincia}) · {formatearRenta(v.renta)}
          </li>
        ))}
      </ol>

      <h3>Datos personales</h3>
      <dl className={className}>
        <div><dt>Nombre</dt><dd>{borrador.nombre} {borrador.apellidos}</dd></div>
        <div><dt>DNI o NIE</dt><dd>{borrador.documento.toUpperCase()}</dd></div>
        <div><dt>Correo</dt><dd>{borrador.email}</dd></div>
        <div><dt>Teléfono</dt><dd>{borrador.telefono}</dd></div>
      </dl>

      <h3>Hogar</h3>
      <dl className={className}>
        <div><dt>Personas</dt><dd>{personas}</dd></div>
        <div>
          <dt>Ingresos netos anuales</dt>
          <dd>{Number(borrador.ingresos).toLocaleString('es-ES')} €</dd>
        </div>
      </dl>
    </>
  );
}