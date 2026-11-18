# Teitos

Portal de alquiler público asequible: convocatorias, buscador de viviendas con filtros y solicitud por pasos. Proyecto de aula de PMDM hecho con React + Vite y una API local con json-server.

- Web publicada: https://yangcrypto314-alt.github.io/teitos/ (sin servidor de datos muestra el estado de error; para ver datos, arráncala en local)
- Memoria: [docs/memoria.pdf](docs/memoria.pdf)
- Figma: https://www.figma.com/design/fAQzOazrPtt3sOzp9CJDiR · prototipo: https://www.figma.com/proto/fAQzOazrPtt3sOzp9CJDiR?node-id=1-1026&starting-point-node-id=1%3A1026 · PDF: [docs/figma/Teitos-diseno-figma.pdf](docs/figma/Teitos-diseno-figma.pdf)

## Arrancar en otra máquina

Necesitas Node.js 20 o superior. En la carpeta del proyecto:

```bash
npm install
```

```bash
npm run reset-datos
```

```bash
npm start
```

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
  api/        Peticiones al servidor (la URL está solo en api/cliente.js)
  hooks/      useViviendas, useConvocatorias, useVivienda, useMiSolicitud, useSolicitud
  components/ Piezas reutilizables (Boton, CallCard, DwellingCard, FilterPanel, Modal…)
  pages/      Una por ruta: Inicio, Viviendas, Detalle, Solicitud, MiSolicitud, NoEncontrada
  context/    Estado global de la solicitud (Context + useReducer + localStorage)
  reglas/     acceso.js: la regla de acceso por ingresos (IPREM)
  utils/      Formatos, normalizar texto y validaciones
  styles/     Variables CSS (mismos nombres que en Figma) y estilos base
docs/         Explicación del código
```

La explicación de cada parte está en [docs/EXPLICACION.md](docs/EXPLICACION.md).
