import { get, post, patch, del } from './api';
import { getDevelopmentMode } from './api';

// Datos simulados para desarrollo
const fakeCategorias = [
  { id_categoria: 1, nombre: "Tecnología", descripcion: "Artículos sobre tecnología", estado: "active", website_id: 1 },
  { id_categoria: 2, nombre: "Marketing", descripcion: "Estrategias de marketing digital", estado: "active", website_id: 1 },
  { id_categoria: 3, nombre: "Diseño", descripcion: "Tips de diseño web y gráfico", estado: "active", website_id: 1 },
  { id_categoria: 4, nombre: "Desarrollo", descripcion: "Programación y desarrollo de software", estado: "active", website_id: 2 },
  { id_categoria: 5, nombre: "SEO", descripcion: "Optimización para motores de búsqueda", estado: "active", website_id: 2 },
];

/**
 * Obtener todas las categorías
 * @param {number} websiteId - ID del sitio web (opcional)
 * @returns {Promise} - Promise con los datos de categorías
 */
export const getAll = async (websiteId = null) => {
  if (getDevelopmentMode()) {
    // Filtrar por website_id si se proporciona
    let filteredCategorias = fakeCategorias;
    if (websiteId) {
      filteredCategorias = fakeCategorias.filter(cat => cat.website_id === parseInt(websiteId));
    }
    
    return {
      data: {
        status: 'success',
        data: filteredCategorias
      }
    };
  }
  
  // Construir la URL de la API
  let endpoint = '/cms/categories';
  if (websiteId) {
    endpoint += `?website_id=${websiteId}`;
  }
  
  return get(endpoint);
};

/**
 * Obtener una categoría específica
 * @param {number} id - ID de la categoría
 * @returns {Promise} - Promise con los datos de la categoría
 */
export const getById = async (id) => {
  if (getDevelopmentMode()) {
    const categoria = fakeCategorias.find(cat => cat.id_categoria === parseInt(id));
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }
    
    return {
      data: {
        status: 'success',
        data: categoria
      }
    };
  }
  
  return get(`/cms/categories/${id}`);
};

/**
 * Crear una nueva categoría
 * @param {Object} data - Datos de la categoría a crear
 * @returns {Promise} - Promise con los datos de la categoría creada
 */
export const create = async (data) => {
  if (getDevelopmentMode()) {
    const newCategoria = {
      id_categoria: fakeCategorias.length + 1,
      nombre: data.nombre,
      descripcion: data.descripcion,
      estado: data.estado || 'active',
      website_id: data.website_id || null,
    };
    
    // Simular añadir a la lista fake
    fakeCategorias.push(newCategoria);
    
    return {
      data: {
        status: 'success',
        data: newCategoria
      }
    };
  }
  
  return post('/cms/categories', data);
};

/**
 * Actualizar una categoría existente
 * @param {number} id - ID de la categoría a actualizar
 * @param {Object} data - Nuevos datos de la categoría
 * @returns {Promise} - Promise con los datos de la categoría actualizada
 */
export const update = async (id, data) => {
  if (getDevelopmentMode()) {
    const index = fakeCategorias.findIndex(cat => cat.id_categoria === parseInt(id));
    if (index === -1) {
      throw new Error('Categoría no encontrada');
    }
    
    // Actualizar categoría simulada
    fakeCategorias[index] = {
      ...fakeCategorias[index],
      ...data
    };
    
    return {
      data: {
        status: 'success',
        data: fakeCategorias[index]
      }
    };
  }
  
  return patch(`/cms/categories/${id}`, data);
};

/**
 * Eliminar una categoría
 * @param {number} id - ID de la categoría a eliminar
 * @returns {Promise} - Promise con la confirmación de eliminación
 */
export const deleteCategoria = async (id) => {
  if (getDevelopmentMode()) {
    const index = fakeCategorias.findIndex(cat => cat.id_categoria === parseInt(id));
    if (index === -1) {
      throw new Error('Categoría no encontrada');
    }
    
    // Eliminar categoría simulada
    fakeCategorias.splice(index, 1);
    
    return {
      data: {
        status: 'success',
        message: 'Categoría eliminada correctamente'
      }
    };
  }
  
  return del(`/cms/categories/${id}`);
};

// Exportar servicio completo
export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteCategoria
};
