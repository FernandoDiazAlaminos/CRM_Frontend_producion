import { get, post, patch, del, getDevelopmentMode } from './api';

// Datos simulados para desarrollo
const fakeSubsubcategorias = [
  { id_sub_sub_categoria: 1, nombre: "React", descripcion: "Biblioteca JavaScript para interfaces", estado: "active", sub_categoria_id: 1, website_id: 1 },
  { id_sub_sub_categoria: 2, nombre: "Angular", descripcion: "Framework JavaScript de Google", estado: "active", sub_categoria_id: 1, website_id: 1 },
  { id_sub_sub_categoria: 3, nombre: "Node.js", descripcion: "Entorno de ejecución para JavaScript", estado: "active", sub_categoria_id: 2, website_id: 1 },
  { id_sub_sub_categoria: 4, nombre: "Express", descripcion: "Framework para Node.js", estado: "active", sub_categoria_id: 2, website_id: 1 },
  { id_sub_sub_categoria: 5, nombre: "React Native", descripcion: "Framework para móviles con React", estado: "active", sub_categoria_id: 3, website_id: 1 },
];

/**
 * Obtener todas las subsubcategorías
 * @param {number} websiteId - ID del sitio web (opcional)
 * @param {number} subcategoriaId - ID de subcategoría padre (opcional)
 * @returns {Promise} - Promise con los datos de subsubcategorías
 */
export const getAll = async (websiteId = null, subcategoriaId = null) => {
  if (getDevelopmentMode()) {
    // Filtrar por website_id y/o sub_categoria_id si se proporcionan
    let filteredSubsubcategorias = fakeSubsubcategorias;
    
    if (websiteId) {
      filteredSubsubcategorias = filteredSubsubcategorias.filter(subsubcat => subsubcat.website_id === parseInt(websiteId));
    }
    
    if (subcategoriaId) {
      filteredSubsubcategorias = filteredSubsubcategorias.filter(subsubcat => subsubcat.sub_categoria_id === parseInt(subcategoriaId));
    }
    
    return {
      data: {
        status: 'success',
        data: filteredSubsubcategorias
      }
    };
  }
  
  // Construir la URL de la API
  let endpoint = '/cms/subsubcategories';
  let params = [];
  
  if (websiteId) {
    params.push(`website_id=${websiteId}`);
  }
  
  if (subcategoriaId) {
    params.push(`sub_categoria_id=${subcategoriaId}`);
  }
  
  if (params.length > 0) {
    endpoint += `?${params.join('&')}`;
  }
  
  return get(endpoint);
};

/**
 * Obtener una subsubcategoría específica
 * @param {number} id - ID de la subsubcategoría
 * @returns {Promise} - Promise con los datos de la subsubcategoría
 */
export const getById = async (id) => {
  if (getDevelopmentMode()) {
    const subsubcategoria = fakeSubsubcategorias.find(subsubcat => subsubcat.id_sub_sub_categoria === parseInt(id));
    if (!subsubcategoria) {
      throw new Error('Subsubcategoría no encontrada');
    }
    
    return {
      data: {
        status: 'success',
        data: subsubcategoria
      }
    };
  }
  
  return get(`/cms/subsubcategories/${id}`);
};

/**
 * Crear una nueva subsubcategoría
 * @param {Object} data - Datos de la subsubcategoría a crear
 * @returns {Promise} - Promise con los datos de la subsubcategoría creada
 */
export const create = async (data) => {
  if (getDevelopmentMode()) {
    const newSubsubcategoria = {
      id_sub_sub_categoria: fakeSubsubcategorias.length + 1,
      nombre: data.nombre,
      descripcion: data.descripcion || '',
      estado: data.estado || 'active',
      sub_categoria_id: data.sub_categoria_id || null,
      website_id: data.website_id || null,
    };
    
    // Simular añadir a la lista fake
    fakeSubsubcategorias.push(newSubsubcategoria);
    
    return {
      data: {
        status: 'success',
        data: newSubsubcategoria
      }
    };
  }
  
  return post('/cms/subsubcategories', data);
};

/**
 * Actualizar una subsubcategoría existente
 * @param {number} id - ID de la subsubcategoría a actualizar
 * @param {Object} data - Nuevos datos de la subsubcategoría
 * @returns {Promise} - Promise con los datos de la subsubcategoría actualizada
 */
export const update = async (id, data) => {
  if (getDevelopmentMode()) {
    const index = fakeSubsubcategorias.findIndex(subsubcat => subsubcat.id_sub_sub_categoria === parseInt(id));
    if (index === -1) {
      throw new Error('Subsubcategoría no encontrada');
    }
    
    // Actualizar subsubcategoría simulada
    fakeSubsubcategorias[index] = {
      ...fakeSubsubcategorias[index],
      ...data
    };
    
    return {
      data: {
        status: 'success',
        data: fakeSubsubcategorias[index]
      }
    };
  }
  
  return patch(`/cms/subsubcategories/${id}`, data);
};

/**
 * Eliminar una subsubcategoría
 * @param {number} id - ID de la subsubcategoría a eliminar
 * @returns {Promise} - Promise con la confirmación de eliminación
 */
export const deleteSubsubcategoria = async (id) => {
  if (getDevelopmentMode()) {
    const index = fakeSubsubcategorias.findIndex(subsubcat => subsubcat.id_sub_sub_categoria === parseInt(id));
    if (index === -1) {
      throw new Error('Subsubcategoría no encontrada');
    }
    
    // Eliminar subsubcategoría simulada
    fakeSubsubcategorias.splice(index, 1);
    
    return {
      data: {
        status: 'success',
        message: 'Subsubcategoría eliminada correctamente'
      }
    };
  }
  
  return del(`/cms/subsubcategories/${id}`);
};

// Exportar servicio completo
export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteSubsubcategoria
};
