import CampoTexto from '../comunes/CampoTexto.jsx';

export default function PasoDatos({ borrador, errores, tocados, cambiar, tocar }) {
  const err = (campo) => (tocados[campo] ? errores[campo] : undefined);

  return (
    <>
      <CampoTexto
        id="nombre"
        etiqueta="Nombre"
        valor={borrador.nombre}
        onCambiar={(v) => cambiar('nombre', v)}
        onSalir={() => tocar('nombre')}
        error={err('nombre')}
        autoComplete="given-name"
      />
      <CampoTexto
        id="apellidos"
        etiqueta="Apellidos"
        valor={borrador.apellidos}
        onCambiar={(v) => cambiar('apellidos', v)}
        onSalir={() => tocar('apellidos')}
        error={err('apellidos')}
        autoComplete="family-name"
      />
      <CampoTexto
        id="documento"
        etiqueta="DNI o NIE"
        valor={borrador.documento}
        onCambiar={(v) => cambiar('documento', v)}
        onSalir={() => tocar('documento')}
        error={err('documento')}
        ayuda="Ejemplo: 12345678Z"
      />
      <CampoTexto
        id="email"
        etiqueta="Correo electrónico"
        tipo="email"
        valor={borrador.email}
        onCambiar={(v) => cambiar('email', v)}
        onSalir={() => tocar('email')}
        error={err('email')}
        autoComplete="email"
      />
      <CampoTexto
        id="telefono"
        etiqueta="Teléfono"
        tipo="tel"
        valor={borrador.telefono}
        onCambiar={(v) => cambiar('telefono', v)}
        onSalir={() => tocar('telefono')}
        error={err('telefono')}
        ayuda="9 cifras, sin prefijo"
        autoComplete="tel"
      />
    </>
  );
}