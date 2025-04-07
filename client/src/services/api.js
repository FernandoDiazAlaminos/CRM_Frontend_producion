import { API_URL } from '../config';
import { store } from '../redux/store';
import { updateTokens } from '../redux/slices/authSlice';

// Variable global para almacenar el modo de desarrollo
// Necesaria para evitar dependencias circulares con el store
let developmentMode = false;

/**
 * Establece el modo de desarrollo
 * @param {boolean} mode - true para modo desarrollo, false para modo producción
 */
export const setDevelopmentMode = (mode) => {
  developmentMode = mode;
  try {
    // Guardar el modo en localStorage para persistencia
    localStorage.setItem('apiMode', mode.toString());
  } catch (error) {
    console.error('Error al guardar el modo de desarrollo en localStorage:', error);
  }
};

/**
 * Función para obtener el estado actual del modo de desarrollo
 * @returns {boolean} - true si estamos en modo desarrollo, false si estamos en modo producción
 */
export const getDevelopmentMode = () => {
  try {
    // Primero intentamos obtener el estado desde el store
    const state = store.getState();
    if (state && state.apiMode && state.apiMode.isDevelopmentMode !== undefined) {
      return state.apiMode.isDevelopmentMode;
    }
    
    // Si no está disponible en el store, usamos el valor de la variable local
    return developmentMode;
  } catch (error) {
    console.error('Error al obtener el modo de desarrollo:', error);
    // Si hay un error, usamos el valor de la variable local
    return developmentMode;
  }
};

/**
 * Realiza una petición fetch con autenticación JWT
 * @param {string} endpoint - La ruta del endpoint (sin el API_URL base)
 * @param {Object} options - Opciones de fetch (method, headers, body, etc.)
 * @returns {Promise} - La respuesta de la petición
 */
export const fetchWithAuth = async (endpoint, options = {}) => {
  // Obtener tokens del estado
  const state = store.getState();
  const { token, tokenRefresh } = state.auth;
  
  // Log para depuración
  console.log(`API: Realizando petición a ${endpoint}`);
  
  // Solo añadir headers de autenticación si hay tokens
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json'
  };
  
  if (token && tokenRefresh) {
    // Eliminar comillas si las hay
    const cleanToken = typeof token === 'string' ? token.replace(/"/g, '') : token;
    const cleanRefreshToken = typeof tokenRefresh === 'string' ? tokenRefresh.replace(/"/g, '') : tokenRefresh;
    
    headers['token'] = cleanToken;
    headers['token-refresh'] = cleanRefreshToken;
    
    // Log para depuración
    console.log(`API: Token usado: ${cleanToken.substring(0, 15)}... (${cleanToken.length} caracteres)`);
  } else {
    console.warn('API: No hay tokens disponibles para la petición');
  }
  
  console.log('API: Headers enviados:', headers);
  
  try {
    // Realizar la petición
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    // Verificar si hay nuevos tokens en los headers
    const newToken = response.headers.get('new-token');
    const newTokenRefresh = response.headers.get('new-token-refresh');
    
    // Log para depuración
    console.log(`API: Respuesta de ${endpoint} - Status:`, response.status);
    
    // Si hay nuevos tokens, actualizarlos en el store
    if (newToken && newTokenRefresh) {
      console.log('API: Recibidos nuevos tokens');
      store.dispatch(updateTokens({ token: newToken, tokenRefresh: newTokenRefresh }));
    }
    
    // Si la respuesta no es ok, lanzar un error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API: Error en ${endpoint} -`, errorData);
      throw new Error(errorData.message || 'Error en la petición');
    }
    
    // Intentar obtener la respuesta como JSON
    const responseData = await response.json();
    console.log(`API: Datos recibidos de ${endpoint}:`, responseData);
    
    // Devolver la respuesta
    return responseData;
  } catch (error) {
    console.error(`API: Error en la petición a ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Realiza una petición GET con autenticación
 * @param {string} endpoint - La ruta del endpoint (sin el API_URL base)
 * @param {Object} options - Opciones adicionales de fetch
 * @returns {Promise} - La respuesta de la petición
 */
export const get = (endpoint, options = {}) => {
  return fetchWithAuth(endpoint, {
    method: 'GET',
    ...options
  });
};

/**
 * Realiza una petición POST con autenticación
 * @param {string} endpoint - La ruta del endpoint (sin el API_URL base)
 * @param {Object} data - Datos a enviar en el body
 * @param {Object} options - Opciones adicionales de fetch
 * @returns {Promise} - La respuesta de la petición
 */
export const post = (endpoint, data, options = {}) => {
  return fetchWithAuth(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  });
};

/**
 * Realiza una petición PUT con autenticación
 * @param {string} endpoint - La ruta del endpoint (sin el API_URL base)
 * @param {Object} data - Datos a enviar en el body
 * @param {Object} options - Opciones adicionales de fetch
 * @returns {Promise} - La respuesta de la petición
 */
export const put = (endpoint, data, options = {}) => {
  return fetchWithAuth(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  });
};

/**
 * Realiza una petición PATCH con autenticación
 * @param {string} endpoint - La ruta del endpoint (sin el API_URL base)
 * @param {Object} data - Datos a enviar en el body
 * @param {Object} options - Opciones adicionales de fetch
 * @returns {Promise} - La respuesta de la petición
 */
export const patch = (endpoint, data, options = {}) => {
  return fetchWithAuth(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
    ...options
  });
};

/**
 * Realiza una petición DELETE con autenticación
 * @param {string} endpoint - La ruta del endpoint (sin el API_URL base)
 * @param {Object} options - Opciones adicionales de fetch
 * @returns {Promise} - La respuesta de la petición
 */
export const del = (endpoint, options = {}) => {
  return fetchWithAuth(endpoint, {
    method: 'DELETE',
    ...options
  });
};

// Inicializar el modo de desarrollo desde localStorage si está disponible
try {
  const storedMode = localStorage.getItem('apiMode');
  if (storedMode !== null) {
    developmentMode = storedMode === 'true';
  }
} catch (error) {
  console.error('Error al obtener el modo de API del localStorage:', error);
}

export default {
  get,
  post,
  put,
  patch,
  delete: del,
  getDevelopmentMode,
  setDevelopmentMode
};
