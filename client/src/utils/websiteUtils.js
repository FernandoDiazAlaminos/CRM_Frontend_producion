/**
 * Utilidades para estandarizar y normalizar datos relacionados con websites
 */

/**
 * Normaliza una web para asegurar consistencia en IDs y propiedades
 * @param {Object} website - Datos de la web a normalizar
 * @returns {Object} - Web normalizada con propiedades consistentes
 */
export const normalizeWebsite = (website) => {
  if (!website) return null;
  
  // Crear un objeto con las propiedades normalizadas
  return {
    ...website,
    // Garantizar que siempre hay un campo 'id' consistente
    id: website.id_website || website.id || null,
    // Mantener id_website para compatibilidad
    id_website: website.id_website || website.id || null,
    // Asegurar que siempre hay un campo name
    name: website.name || website.nombre || "",
    // Normalizar el formato de URL (añadir https:// si no está presente)
    url: normalizeUrl(website.url || ""),
    // Estado por defecto si no existe
    status: website.status || "inactive"
  };
};

/**
 * Normaliza una lista de websites
 * @param {Array} websites - Lista de websites a normalizar
 * @returns {Array} - Lista de websites normalizada
 */
export const normalizeWebsites = (websites = []) => {
  if (!Array.isArray(websites)) return [];
  return websites.map(normalizeWebsite);
};

/**
 * Normaliza una URL añadiendo el protocolo HTTPS si no lo tiene
 * @param {string} url - URL a normalizar
 * @returns {string} - URL normalizada
 */
const normalizeUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
};

/**
 * Extrae el ID de usuario a partir del objeto de usuario (maneja ambos formatos)
 * @param {Object} user - Objeto de usuario 
 * @returns {number|null} - ID de usuario o null si no se encuentra
 */
export const getUserId = (user) => {
  if (!user) return null;
  return user.id || user.id_user || null;
};

/**
 * Genera datos para crear una nueva web con valores predeterminados
 * @param {Object} user - Usuario actual
 * @returns {Object} - Plantilla para nueva web
 */
export const getNewWebsiteTemplate = (user) => {
  return {
    name: "",
    url: "",
    description: "",
    logo: "",
    status: "development",
    user_id: getUserId(user),
    analytics_id: "",
    analytics_view_id: "",
    pixel_id: "",
    gtm_id: "",
    api_key: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

/**
 * Valida los datos de un formulario de website
 * @param {Object} data - Datos a validar
 * @returns {Object} - Resultado de la validación {isValid, errors}
 */
export const validateWebsiteData = (data) => {
  const errors = {};
  
  // Validar nombre
  if (!data.name || data.name.trim() === "") {
    errors.name = "El nombre es obligatorio";
  }
  
  // Validar URL
  if (!data.url || data.url.trim() === "") {
    errors.url = "La URL es obligatoria";
  } else {
    // Expresión regular para URL válida (básica)
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlRegex.test(data.url)) {
      errors.url = "La URL no tiene un formato válido";
    }
  }
  
  // Validar user_id
  if (!data.user_id) {
    errors.user_id = "Se requiere asociar la web a un usuario";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Convierte un array de websites a formato para selector (id, label)
 * @param {Array} websites - Lista de websites
 * @returns {Array} - Lista formateada para selector
 */
export const websitesToSelectOptions = (websites = []) => {
  if (!Array.isArray(websites)) return [];
  
  return websites.map(website => ({
    value: website.id || website.id_website,
    label: website.name || website.nombre
  }));
};

export default {
  normalizeWebsite,
  normalizeWebsites,
  getUserId,
  getNewWebsiteTemplate,
  validateWebsiteData,
  websitesToSelectOptions
};
