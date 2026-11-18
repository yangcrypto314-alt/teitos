# Teitos: qué hace cada cosa (versión corta)

## 1. Cómo viajan los datos

```
db.json → json-server (puerto 3001) → api/ → hooks/ → pages/ → components/
```

1. **json-server** convierte `db.json` en una API REST.
2. **api/cliente.js** tiene la URL **una sola vez** y la función `pedir()`. Todas las peticiones pasan por ella; si `respuesta.ok` es falso, lanza un error.
3. **api/viviendas.js, convocatorias.js, solicitudes.js** son atajos: `getViviendas()`, `crearSolicitud()` (POST), `actualizarSolicitud()` (PUT), `retirarSolicitud()` (DELETE).
4. **hooks/** hacen el `fetch` dentro de un `useEffect` y devuelven los **tres estados**: `cargando`, `error` y `vacio`, más `recargar()` para el botón «Reintentar».
5. **pages/** usan los hooks y pintan los **components/**.

## 2. Hooks (`src/hooks`)

| Hook | Qué hace |
| --- | --- |
| `useViviendas` | Pide las 1.200 viviendas y se queda solo con las **libres** (quita las adjudicadas). |
| `useConvocatorias` | Pide las 16 convocatorias. |
| `useVivienda(id)` | Pide una vivienda y su convocatoria (las une a mano porque `_embed` no funciona). |
| `useMiSolicitud(id)` | Pide la solicitud enviada, su convocatoria y sus viviendas. |
| `useSolicitud` | Lee el Context de la solicitud (selección + borrador). |

**Truco del `activo`**: si el usuario cambia de página antes de que llegue la respuesta, `activo = false` y no se toca el estado de un componente que ya no existe.

**Truco de `version`**: `recargar()` suma 1 a `version`; como `version` está en las dependencias del `useEffect`, la petición se repite.

## 3. Páginas (`src/pages`) y rutas (`App.jsx`)

| Ruta | Página | Qué hace |
| --- | --- | --- |
| `/` | `Inicio` | Hero con buscador rápido, convocatorias (abiertas y luego cerradas/resueltas) y «Cómo funciona». |
| `/viviendas` | `Viviendas` | Buscador: texto, 4 filtros, orden y paginación. **Todo va en la URL**. |
| `/viviendas/:id` | `Detalle` | Ficha de la vivienda y botón para añadirla a la solicitud. |
| `/solicitud` | `Solicitud` | Formulario en 4 pasos + modal de confirmación + POST. |
| `/mi-solicitud` | `MiSolicitud` | Ver, modificar (PUT) o retirar (DELETE) mientras el plazo siga abierto. |
| `*` | `NoEncontrada` | Página 404. |

`App.jsx` además tiene `useScrollAlNavegar`: al cambiar de página sube arriba, y si la URL lleva `#convocatorias` baja hasta esa sección.

### Viviendas: filtros en la URL

`useSearchParams()` lee y escribe la URL. Ejemplo:
`/viviendas?provincia=Pontevedra&personas=2&ingresos=30000&orden=rentaAsc&pagina=2`

- `actualizar({ campo: valor })` cambia un parámetro y vuelve a la página 1.
- `{ replace: true }` evita llenar el historial con cada tecla.
- Así la búsqueda **se puede pegar en un correo** y abre igual.

El filtrado está dentro de un `useMemo` (solo se recalcula si cambian los datos o los filtros):
1. Provincia igual.
2. Accesibilidad dentro de las casillas marcadas.
3. **Personas + ingresos** → no comparan un campo, llaman a `puedeAcceder()` de `reglas/acceso.js`.
4. Texto: `normalizar()` quita tildes/eñes y mayúsculas en los dos lados antes de comparar.
5. Ordenar con la función de `ORDENES`.
6. Paginar con `slice()`, 12 por página.

## 4. La regla de acceso (`src/reglas/acceso.js`)

- IPREM anual = 8.400 €, multiplicado por la ponderación según personas (1 → 1,00 … 6+ → 1,75).
- Los ingresos tienen que estar **entre 2 y 7,5 veces** ese IPREM ponderado (`cumpleIngresos`).
- La renta no puede pasar del **30 % del ingreso mensual** (`rentaMaxima` = ingresos / 12 × 0,3).
- `puedeAcceder(vivienda, ingresos, personas)` junta las dos cosas.

Ejemplo: 2 personas y 30.000 € → rango 19.320 € – 72.450 € ✓ → renta máxima 750 €/mes.

## 5. Estado global (`src/context`)

- `solicitudReducer.js`: un `useReducer` con acciones `anadir`, `quitar`, `mover`, `campo`, `paso`, `enviada`, `vaciar`.
- `motivoRechazo()`: no deja añadir más de 3 viviendas, ni repetidas, ni de convocatorias distintas.
- `SolicitudProvider.jsx`: guarda el estado en `localStorage` cada vez que cambia y lo recupera al recargar → **la selección y el borrador sobreviven a F5**.

## 6. Componentes (`src/components`) = componentes de Figma

| Figma | React | Variantes (props) |
| --- | --- | --- |
| Botón | `Boton` | `variante="primario" / "secundario" / "peligro"`, `error`, `disabled`, `to` (enlace) |
| Campo | `CampoTexto` | `error`, `ayuda`, `tipo` |
| Mensaje de error | `MensajeError` | icono «!» + texto (no depende solo del color) |
| Tarjeta de vivienda | `DwellingCard` | `desactivada` |
| Tarjeta de convocatoria | `CallCard` | según `estado` (abierta/cerrada/resuelta) y `libres` |
| Paginación | `Pagination` | `pagina`, `totalPaginas` → ‹ 1 … 4 5 6 … 54 › |
| Estados del buscador | `Estado` | `tipo="cargando" / "error" / "vacio"` |

Otros: `Header` (menú hamburguesa en móvil), `Footer`, `BarraMovil` (barra inferior en móvil), `Hero` (portada + buscador rápido), `FilterPanel` (filtros), `Modal` (usa `<dialog>` nativo: atrapa el foco y se cierra con Esc), `PasoDatos` / `PasoHogar` / `PasoRevision` (pasos del formulario), `EditarSolicitud`.

## 7. Validación del formulario (`src/utils/validaciones.js`)

- `validarTodo()` devuelve `{ campo: 'mensaje' }` solo con los campos que fallan.
- **Al vuelo**: el error de un campo aparece cuando lo has tocado (`tocados`).
- **Al enviar / al pulsar Siguiente**: se marcan todos los campos del paso como tocados y se ven todos los errores.
- DNI/NIE: comprueba la letra con `número % 23`.

## 8. Estilos y accesibilidad

- **CSS Modules** (`X.module.css`): las clases solo afectan a su componente.
- **variables.css**: los 8 roles de color con los nombres de Figma (`--color-fondo`, `--color-primario`…).
- Foco visible: anillo amarillo (`--color-acento`) con `:focus-visible`.
- Enlace «Saltar al contenido» al principio.
- Nada depende solo del color: estados con icono + texto, página activa subrayada.
- A 390 px no hay scroll horizontal (probado en todas las rutas).

## 9. Casos especiales del enunciado

| Caso | Qué se ve |
| --- | --- |
| Vivienda **773** (municipio largo) | El título se parte en dos líneas sin romper la tarjeta. |
| Vivienda **478** (sin dato de accesibilidad) | «Sin dato» / «Dato de accesibilidad no disponible», **no** «sin adaptar». |
| Vivienda **926** (4.ª planta sin ascensor) | Aviso «▲ 4.ª planta sin ascensor». |
| Convocatoria **26-6-MAD** (todo adjudicado) | Tarjeta «Libres: Todas adjudicadas» y sin botón Consultar. |
| `id` texto vs `convocatoriaId` número | Se compara con `String()` antes. |

## 10. Sin servidor (versión publicada)

Si la web se publica sin json-server, cada petición falla y la app muestra el estado de **error** con «Reintentar» en lugar de quedarse en blanco.
