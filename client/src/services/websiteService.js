import api, { getDevelopmentMode } from "./api";
import { normalizeWebsite, normalizeWebsites } from "../utils/websiteUtils";

// Datos de ejemplo para modo de desarrollo
const mockWebsites = [
  {
    id: 1,
    id_website: 1,
    name: "DIMAP Marketing",
    url: "https://dimap.es",
    logo: "/images/dimap-logo.png",
    description: "Página web principal de DIMAP Marketing",
    status: "active",
    user_id: 1,
    createdAt: "2023-12-01T10:30:00Z",
    updatedAt: "2023-12-15T10:30:00Z"
  },
  {
    id: 2,
    id_website: 2,
    name: "DIMAP Blog",
    url: "https://blog.dimap.es",
    logo: "/images/dimap-blog-logo.png",
    description: "Blog corporativo de DIMAP con artículos sobre marketing digital",
    status: "active",
    user_id: 1,
    createdAt: "2023-12-02T14:45:00Z",
    updatedAt: "2023-12-10T14:45:00Z"
  },
  {
    id: 3,
    id_website: 3,
    name: "DIMAP Academia",
    url: "https://academia.dimap.es",
    logo: "/images/dimap-academy-logo.png",
    description: "Plataforma de formación online de DIMAP",
    status: "maintenance",
    user_id: 2,
    createdAt: "2023-11-20T09:15:00Z",
    updatedAt: "2023-11-28T09:15:00Z"
  },
  {
    id: 4,
    id_website: 4,
    name: "DIMAP Shop",
    url: "https://shop.dimap.es",
    logo: "/images/dimap-shop-logo.png",
    description: "Tienda online de productos de marketing digital",
    status: "development",
    user_id: 2,
    createdAt: "2023-12-01T16:20:00Z",
    updatedAt: "2023-12-05T16:20:00Z"
  }
];

// Logger específico del servicio de websites
const logService = (action, details) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[WebsiteService] ${action}:`, details);
  }
};

/**
 * Obtener todos los sitios web - Con soporte para administradores
 * @param {number|null} userId - ID del usuario (null para administradores)
 * @returns {Promise<Array>} - Lista de websites
 */
export const fetchWebsites = async (userId = null) => {
  const isDevMode = getDevelopmentMode();
  
  if (isDevMode) {
    logService('Modo desarrollo: Obteniendo webs simuladas', { userId });
    // En modo de desarrollo, simular el comportamiento según userId
    const filteredWebsites = userId
      ? mockWebsites.filter(website => website.user_id === Number(userId))
      : mockWebsites;
    
    return new Promise((resolve) =>
      setTimeout(() => resolve(normalizeWebsites(filteredWebsites)), 500)
    );
  } else {
    try {
      logService('Obteniendo webs de API', { userId });
      // En modo producción, el comportamiento es idéntico pero usando la API real
      const url = userId ? `/websites?user_id=${userId}` : '/websites';
      
      const response = await api.get(url);
      
      // Para el formato {error: false, message: string, data: Array}
      if (response.data && response.data.error === false && Array.isArray(response.data.data)) {
        return normalizeWebsites(response.data.data);
      }
      
      // Formato fallback - intenta manejar otros formatos posibles
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          return normalizeWebsites(response.data);
        }
      }
      
      return [];
    } catch (error) {
      logService('Error al obtener webs', error);
      return [];
    }
  }
};

/**
 * Obtener un sitio web por su ID
 * @param {number|string} id - ID del website
 * @returns {Promise<Object|null>} - Website o null si no se encuentra
 */
export const fetchWebsiteById = async (id) => {
  if (getDevelopmentMode()) {
    logService('Modo desarrollo: Obteniendo web por ID', id);
    const website = mockWebsites.find(website => website.id === Number(id) || website.id_website === Number(id));
    
    if (!website) {
      throw new Error("Sitio web no encontrado");
    }
    
    return new Promise((resolve) =>
      setTimeout(() => resolve(normalizeWebsite(website)), 300)
    );
  } else {
    try {
      logService('Obteniendo web por ID de API', id);
      const response = await api.get(`/websites/${id}`);
      
      // Formato de la API {error: false, message: string, data: {...}}
      if (response.data && response.data.error === false && response.data.data) {
        return normalizeWebsite(response.data.data);
      }
      
      // Fallback
      if (response && response.data) {
        return normalizeWebsite(response.data);
      }
      
      return null;
    } catch (error) {
      logService('Error al obtener web por ID', error);
      throw error;
    }
  }
};

/**
 * Crear un nuevo sitio web
 * @param {Object} data - Datos del nuevo website
 * @returns {Promise<Object>} - Nuevo website creado
 */
export const createWebsite = async (data) => {
  // Verificar que se ha proporcionado un user_id
  if (!data.user_id) {
    logService('Error: No se ha proporcionado user_id al crear sitio web');
    
    // Intentar obtener el ID del usuario del localStorage como último recurso
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user && (user.id || user.id_user)) {
          data.user_id = user.id || user.id_user;
          logService('Recuperado user_id del localStorage', data.user_id);
        }
      }
    } catch (err) {
      logService('Error al recuperar user_id del localStorage', err);
    }
    
    // Si aún no tenemos user_id, registramos un error crítico
    if (!data.user_id) {
      return { 
        id: null, 
        error: "No se ha podido asociar un usuario al sitio web. Por favor, inicia sesión de nuevo." 
      };
    }
  }
  
  // Normalizar los datos de entrada
  data = {
    ...data,
    // Añadir cualquier campo por defecto que pueda faltar
    status: data.status || 'development'
  };
  
  if (getDevelopmentMode()) {
    logService('Modo desarrollo: Creando web simulada', data);
    const newWebsite = {
      id: mockWebsites.length + 1,
      id_website: mockWebsites.length + 1,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockWebsites.push(newWebsite);
    
    return new Promise((resolve) =>
      setTimeout(() => resolve(normalizeWebsite(newWebsite)), 500)
    );
  } else {
    try {
      logService('Creando web en API', data);
      const response = await api.post('/websites', data);
      
      // Extraer datos según el formato de respuesta
      let websiteData = null;
      
      // Formato de la API {error: false, message: string, data: {...}}
      if (response.data && response.data.error === false && response.data.data) {
        websiteData = response.data.data;
      } else if (response.data) {
        websiteData = response.data;
      }
      
      if (!websiteData) {
        return { id: null, error: "Formato de respuesta inesperado al crear sitio web" };
      }
      
      return normalizeWebsite(websiteData);
    } catch (error) {
      logService('Error al crear web', error);
      return { 
        id: null, 
        error: error.response?.data?.message || "Error al crear sitio web" 
      };
    }
  }
};

/**
 * Actualizar un sitio web existente
 * @param {number|string} id - ID del website a actualizar
 * @param {Object} data - Datos actualizados
 * @returns {Promise<Object>} - Website actualizado
 */
export const updateWebsite = async (id, data) => {
  // Normalizar datos de entrada
  data = {
    ...data,
    // Asegurar que tenemos campos obligatorios
    id: id,
    id_website: id
  };
  
  // Asegurar que no se pierde el user_id durante la actualización
  if (!data.user_id) {
    logService('Warning: No se ha proporcionado user_id al actualizar sitio web');
    
    // Intentar obtener el user_id del sitio actual en modo desarrollo
    if (getDevelopmentMode()) {
      const website = mockWebsites.find(w => w.id === Number(id) || w.id_website === Number(id));
      if (website && website.user_id) {
        data.user_id = website.user_id;
        logService('Recuperado user_id de mockWebsites', data.user_id);
      }
    }
    
    // Intentar recuperar del localStorage si sigue sin haber
    if (!data.user_id) {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user && (user.id || user.id_user)) {
            data.user_id = user.id || user.id_user;
            logService('Recuperado user_id del localStorage', data.user_id);
          }
        }
      } catch (err) {
        logService('Error al recuperar user_id del localStorage', err);
      }
    }
  }
  
  if (getDevelopmentMode()) {
    logService('Modo desarrollo: Actualizando web simulada', { id, data });
    const index = mockWebsites.findIndex(website => website.id === Number(id) || website.id_website === Number(id));
    
    if (index === -1) {
      throw new Error("Sitio web no encontrado");
    }
    
    const updatedWebsite = {
      ...mockWebsites[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    // Asegurar que user_id sigue presente
    if (!updatedWebsite.user_id && mockWebsites[index].user_id) {
      updatedWebsite.user_id = mockWebsites[index].user_id;
    }
    
    mockWebsites[index] = updatedWebsite;
    
    return new Promise((resolve) =>
      setTimeout(() => resolve(normalizeWebsite(updatedWebsite)), 500)
    );
  } else {
    try {
      logService('Actualizando web en API', { id, data });
      const response = await api.patch(`/websites/${id}`, data);
      
      // Extraer datos según el formato de respuesta
      let websiteData = null;
      
      // Formato de la API {error: false, message: string, data: {...}}
      if (response.data && response.data.error === false && response.data.data) {
        websiteData = response.data.data;
      } else if (response.data) {
        websiteData = response.data;
      }
      
      if (!websiteData) {
        return { 
          id, 
          ...data, 
          error: "Formato de respuesta inesperado al actualizar sitio web" 
        };
      }
      
      return normalizeWebsite(websiteData);
    } catch (error) {
      logService('Error al actualizar web', error);
      return { 
        id, 
        ...data, 
        error: error.response?.data?.message || "Error al actualizar sitio web" 
      };
    }
  }
};

/**
 * Eliminar un sitio web
 * @param {number|string} id - ID del website a eliminar
 * @returns {Promise<boolean|number>} - true/ID si se eliminó, false si hubo error
 */
export const deleteWebsite = async (id) => {
  if (getDevelopmentMode()) {
    logService('Modo desarrollo: Eliminando web simulada', id);
    const index = mockWebsites.findIndex(website => website.id === Number(id) || website.id_website === Number(id));
    
    if (index === -1) {
      throw new Error("Sitio web no encontrado");
    }
    
    mockWebsites.splice(index, 1);
    
    return new Promise((resolve) =>
      setTimeout(() => resolve(id), 500)
    );
  } else {
    try {
      logService('Eliminando web en API', id);
      await api.delete(`/websites/${id}`);
      return id;
    } catch (error) {
      logService('Error al eliminar web', error);
      return false;
    }
  }
};

export default {
  fetchWebsites,
  fetchWebsiteById,
  createWebsite,
  updateWebsite,
  deleteWebsite
};