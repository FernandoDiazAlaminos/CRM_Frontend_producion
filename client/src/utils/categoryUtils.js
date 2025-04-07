/**
 * Utilidades para estandarizar y normalizar datos relacionados con categorías
 */

/**
 * Normaliza una categoría para asegurar consistencia en IDs y propiedades
 * @param {Object} category - Datos de la categoría a normalizar
 * @param {number|null} websiteId - ID de la web asociada (opcional)
 * @returns {Object} - Categoría normalizada con propiedades consistentes
 */
export const normalizeCategory = (category, websiteId = null) => {
  if (!category) return null;
  
  // Crear un objeto con las propiedades normalizadas
  return {
    ...category,
    // Garantizar que siempre hay un campo 'id' consistente
    id: category.id_categoria || category.id || null,
    // Mantener id_categoria para compatibilidad
    id_categoria: category.id_categoria || category.id || null,
    // Asegurar que siempre hay campos obligatorios
    nombre: category.nombre || "",
    descripcion: category.descripcion || "",
    estado: category.estado || "active",
    // Asegurar que está asociada a una web
    website_id: category.website_id || websiteId
  };
};

/**
 * Normaliza una lista de categorías
 * @param {Array} categories - Lista de categorías a normalizar
 * @param {number|null} websiteId - ID de la web asociada (opcional)
 * @returns {Array} - Lista de categorías normalizada
 */
export const normalizeCategories = (categories = [], websiteId = null) => {
  if (!Array.isArray(categories)) return [];
  return categories.map(category => normalizeCategory(category, websiteId));
};

/**
 * Genera datos para crear una nueva categoría con valores predeterminados
 * @param {number|null} websiteId - ID de la web asociada
 * @returns {Object} - Plantilla para nueva categoría
 */
export const getNewCategoryTemplate = (websiteId = null) => {
  return {
    nombre: "",
    descripcion: "",
    estado: "active",
    website_id: websiteId,
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

/**
 * Valida los datos de un formulario de categoría
 * @param {Object} data - Datos a validar
 * @returns {Object} - Resultado de la validación {isValid, errors}
 */
export const validateCategoryData = (data) => {
  const errors = {};
  
  // Validar nombre
  if (!data.nombre || data.nombre.trim() === "") {
    errors.nombre = "El nombre es obligatorio";
  }
  
  // Validar website_id
  if (!data.website_id) {
    errors.website_id = "Se requiere asociar la categoría a un sitio web";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Convierte un array de categorías a formato para selector (id, label)
 * @param {Array} categories - Lista de categorías
 * @returns {Array} - Lista formateada para selector
 */
export const categoriesToSelectOptions = (categories = []) => {
  if (!Array.isArray(categories)) return [];
  
  return categories.map(category => ({
    value: category.id || category.id_categoria,
    label: category.nombre
  }));
};

export default {
  normalizeCategory,
  normalizeCategories,
  getNewCategoryTemplate,
  validateCategoryData,
  categoriesToSelectOptions
};