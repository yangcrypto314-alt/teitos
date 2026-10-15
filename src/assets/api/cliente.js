// La URL del servidor se escribe SOLO aquí.
export const API_URL = 'http://localhost:3001';

// Todas las peticiones de la aplicación pasan por esta función.
export async function pedir(ruta, opciones) {
  const respuesta = await fetch(`${API_URL}${ruta}`, opciones);

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al pedir ${ruta}`);
  }
  if (respuesta.status === 204) {
    return null;
  }
  return respuesta.json();
}