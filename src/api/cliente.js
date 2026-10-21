// La URL del servidor se escribe SOLO aquí.
export const API_URL = 'http://localhost:3001';

// Todas las peticiones de la aplicación pasan por esta función.
export async function pedir(ruta, opciones) {
  const respuesta = await fetch(`${API_URL}${ruta}`, opciones);

  if (!respuesta.ok) {
    const error = new Error(`Error ${respuesta.status} al pedir ${ruta}`);
    error.estado = respuesta.status;
    throw error;
  }
  if (respuesta.status === 204) {
    return null;
  }
  return respuesta.json();
}