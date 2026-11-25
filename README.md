# Queisiños

Portal de alquiler público asequible: convocatorias, buscador de viviendas con filtros y solicitud por pasos. Proyecto de aula de PMDM hecho con React + Vite y una API local con json-server.

- Web publicada: https://yangcrypto314-alt.github.io/teitos/ (sin servidor de datos muestra el estado de error; para ver datos, arráncala en local)
- Memoria: [docs/memoria.pdf](docs/memoria.pdf)
- Figma: https://www.figma.com/design/fAQzOazrPtt3sOzp9CJDiR · prototipo: https://www.figma.com/proto/fAQzOazrPtt3sOzp9CJDiR?node-id=1-1026&starting-point-node-id=1%3A1026 · PDF: [docs/figma/Teitos-diseno-figma.pdf](docs/figma/Teitos-diseno-figma.pdf)

## Arrancar en otra máquina

Necesitas **Node.js 22.12 o superior** (la versión LTS de https://nodejs.org). En la carpeta del proyecto bastan dos comandos:

```bash
npm install
```

```bash
npm start
```

Antes de arrancar, `npm start` ejecuta `preparar.cjs`, que:
- avisa con un mensaje claro si la versión de Node es antigua;
- crea `db.json` a partir de `db.original.json` si no existe o está dañado.

Para dejar los datos como al principio (sin solicitudes): `npm run reset-datos`.

- La web queda en http://localhost:5173/
- La API queda en http://localhost:3001/ (`/convocatorias`, `/viviendas`, `/solicitudes`)

`npm run reset-datos` copia `db.original.json` (que no se toca nunca) sobre `db.json` y deja `solicitudes` vacía.

## Otros comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Solo la web (Vite) |
| `npm run api` | Solo la API (json-server en el puerto 3001) |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run lint` | Revisa el código con oxlint |

## Estructura

```
src/
  api/                    Peticiones al servidor (la URL está solo en api/cliente.js)
  componentes/
    comunes/              Piezas reutilizables: Boton, CampoTexto, Estado, Logo, MensajeError, Modal, Paginacion
    estructura/           Marco de todas las páginas: Cabecera, Pie, BarraMovil
    inicio/               Portada y TarjetaConvocatoria
    viviendas/            TarjetaVivienda y Filtros
    solicitud/            Pasos del formulario y EditarSolicitud
  paginas/                Una por ruta: Inicio, Viviendas, Detalle, Solicitud, MiSolicitud, NoEncontrada
  hooks/                  useViviendas, useConvocatorias, useVivienda, useMiSolicitud, useSolicitud
  estado/                 Estado global de la solicitud (Context + useReducer + localStorage)
  reglas/                 acceso.js: la regla de acceso por ingresos (IPREM)
  utilidades/             Formatos, normalizar texto y validaciones
  estilos/                Variables CSS (mismos nombres que en Figma), base, global y layout
docs/                     Memoria, chuleta, explicación del código y exportación del Figma
```

La explicación de cada parte está en [docs/EXPLICACION.md](docs/EXPLICACION.md).
