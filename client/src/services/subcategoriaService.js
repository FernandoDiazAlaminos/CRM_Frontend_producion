import { get, post, patch, del, getDevelopmentMode } from './api';

// Datos simulados para desarrollo
const fakeSubcategorias = [
  { id_sub_categoria: 1, nombre: "Frontend", descripcion: "Desarrollo de interfaces de usuario", estado: "active", categoria_id: 1, website_id: 1 },
  { id_sub_categoria: 2, nombre: "Backend", descripcion: "Desarrollo de servidores y APIs", estado: "active", categoria_id: 1, website_id: 1 },
  { id_sub_categoria: 3, nombre: "Móvil", descripcion: "Desarrollo de aplicaciones móviles", estado: "active", categoria_id: 1, website_id: 1 },
  { id_sub_categoria: 4, nombre: "SEO On-page", descripcion: "Optimización dentro del sitio", estado: "active", categoria_id: 5, website_id: 2 },
  { id_sub_categoria: 5, nombre: "SEO Off-page", descripcion: "Estrategias externas de SEO", estado: "active", categoria_id: 5, website_id: 2 },
];

/**
 * Obtener todas las subcategorías
 * @param {number} websiteId - ID del sitio web (opcional)
 * @param {number} categoriaId - ID de categoría padre (opcional)
 * @returns {Promise} - Promise con los datos de subcategorías
 */
export const getAll = async (websiteId = null, categoriaId = null) => {
  if (getDevelopmentMode()) {
    // Filtrar por website_id y/o categoria_id si se proporcionan
    let filteredSubcategorias = fakeSubcategorias;
    
    if (websiteId) {
      filteredSubcategorias = filteredSubcategorias.filter(subcat => subcat.website_id === parseInt(websiteId));
    }
    
    if (categoriaId) {
      filteredSubcategorias = filteredSubcategorias.filter(subcat => subcat.categoria_id === parseInt(categoriaId));
    }
    
    return {
      data: {
        status: 'success',
        data: filteredSubcategorias
      }
    };
  }
  
  // Construir la URL de la API
  let endpoint = '/cms/subcategories';
  let params = [];
  
  if (websiteId) {
    params.push(`website_id=${websiteId}`);
  }
  
  if (categoriaId) {
    params.push(`categoria_id=${categoriaId}`);
  }
  
  if (params.length > 0) {
    endpoint += `?${params.join('&')}`;
  }
  
  return get(endpoint);
};

/**
 * Obtener una subcategoría específica
 * @param {number} id - ID de la subcategoría
 * @returns {Promise} - Promise con los datos de la subcategoría
 */
export const getById = async (id) => {
  if (getDevelopmentMode()) {
    const subcategoria = fakeSubcategorias.find(subcat => subcat.id_sub_categoria === parseInt(id));
    if (!subcategoria) {
      throw new Error('Subcategoría no encontrada');
    }
    
    return {
      data: {
        status: 'success',
        data: subcategoria
      }
    };
  }
  
  return get(`/cms/subcategories/${id}`);
};

/**
 * Crear una nueva subcategoría
 * @param {Object} data - Datos de la subcategoría a crear
 * @returns {Promise} - Promise con los datos de la subcategoría creada
 */
export const create = async (data) => {
  if (getDevelopmentMode()) {
    const newSubcategoria = {
      id_sub_categoria: fakeSubcategorias.length + 1,
      nombre: data.nombre,
      descripcion: data.descripcion || '',
      estado: data.estado || 'active',
      categoria_id: data.categoria_id || null,
      website_id: data.website_id || null,
    };
    
    // Simular añadir a la lista fake
    fakeSubcategorias.push(newSubcategoria);
    
    return {
      data: {
        status: 'success',
        data: newSubcategoria
      }
    };
  }
  
  return post('/cms/subcategories', data);
};

/**
 * Actualizar una subcategoría existente
 * @param {number} id - ID de la subcategoría a actualizar
 * @param {Object} data - Nuevos datos de la subcategoría
 * @returns {Promise} - Promise con los datos de la subcategoría actualizada
 */
export const update = async (id, data) => {
  if (getDevelopmentMode()) {
    const index = fakeSubcategorias.findIndex(subcat => subcat.id_sub_categoria === parseInt(id));
    if (index === -1) {
      throw new Error('Subcategoría no encontrada');
    }
    
    // Actualizar subcategoría simulada
    fakeSubcategorias[index] = {
      ...fakeSubcategorias[index],
      ...data
    };
    
    return {
      data: {
        status: 'success',
        data: fakeSubcategorias[index]
      }
    };
  }
  
  return patch(`/cms/subcategories/${id}`, data);
};

/**
 * Eliminar una subcategoría
 * @param {number} id - ID de la subcategoría a eliminar
 * @returns {Promise} - Promise con la confirmación de eliminación
 */
export const deleteSubcategoria = async (id) => {
  if (getDevelopmentMode()) {
    const index = fakeSubcategorias.findIndex(subcat => subcat.id_sub_categoria === parseInt(id));
    if (index === -1) {
      throw new Error('Subcategoría no encontrada');
    }
    
    // Eliminar subcategoría simulada
    fakeSubcategorias.splice(index, 1);
    
    return {
      data: {
        status: 'success',
        message: 'Subcategoría eliminada correctamente'
      }
    };
  }
  
  return del(`/cms/subcategories/${id}`);
};

// Exportar servicio completo
export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteSubcategoria
};
