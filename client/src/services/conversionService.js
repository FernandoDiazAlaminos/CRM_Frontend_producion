import { get, post, patch, del, getDevelopmentMode } from './api';

// Datos simulados para desarrollo
const fakeConversions = [
  { 
    id: 1,
    name: "Formulario de contacto",
    description: "Envío del formulario de contacto",
    counter: 145,
    value: 10,
    website_id: 1,
    unique_code: "contact_form",
    created_at: "2024-03-15T12:30:45Z",
    updated_at: "2024-04-01T09:15:22Z",
    active: true
  },
  { 
    id: 2,
    name: "Registro newsletter",
    description: "Registro en la newsletter",
    counter: 284,
    value: 5,
    website_id: 1,
    unique_code: "newsletter_signup",
    created_at: "2024-03-15T12:35:10Z",
    updated_at: "2024-04-01T09:16:30Z",
    active: true
  },
  { 
    id: 3,
    name: "Compra completada",
    description: "El usuario completa una compra",
    counter: 67,
    value: 50,
    website_id: 1,
    unique_code: "purchase_complete",
    created_at: "2024-03-16T10:20:15Z",
    updated_at: "2024-04-01T09:17:45Z",
    active: true
  },
  { 
    id: 4,
    name: "Solicitud de demo",
    description: "El usuario solicita una demostración",
    counter: 52,
    value: 30,
    website_id: 1,
    unique_code: "demo_request",
    created_at: "2024-03-17T14:45:30Z",
    updated_at: "2024-04-01T09:18:20Z",
    active: true
  },
  { 
    id: 5,
    name: "Solicitud de presupuesto",
    description: "El usuario solicita un presupuesto personalizado",
    counter: 98,
    value: 25,
    website_id: 2,
    unique_code: "quote_request",
    created_at: "2024-03-18T09:10:25Z",
    updated_at: "2024-04-01T09:19:05Z",
    active: true
  }
];

/**
 * Obtener todas las conversiones
 * @param {number} websiteId - ID del sitio web (opcional)
 * @returns {Promise} - Promise con los datos de conversiones
 */
export const getAll = async (websiteId = null) => {
  if (getDevelopmentMode()) {
    // Filtrar por website_id si se proporciona
    let filteredConversions = fakeConversions;
    if (websiteId) {
      filteredConversions = fakeConversions.filter(conv => conv.website_id === parseInt(websiteId));
    }
    
    return {
      data: {
        status: 'success',
        data: filteredConversions
      }
    };
  }
  
  // Construir la URL de la API
  let endpoint = '/conversions';
  if (websiteId) {
    endpoint += `?website_id=${websiteId}`;
  }
  
  return get(endpoint);
};

/**
 * Obtener una conversión específica
 * @param {number} id - ID de la conversión
 * @returns {Promise} - Promise con los datos de la conversión
 */
export const getById = async (id) => {
  if (getDevelopmentMode()) {
    const conversion = fakeConversions.find(conv => conv.id === parseInt(id));
    if (!conversion) {
      throw new Error('Conversión no encontrada');
    }
    
    return {
      data: {
        status: 'success',
        data: conversion
      }
    };
  }
  
  return get(`/conversions/${id}`);
};

/**
 * Crear una nueva conversión
 * @param {Object} data - Datos de la conversión a crear
 * @returns {Promise} - Promise con los datos de la conversión creada
 */
export const create = async (data) => {
  if (getDevelopmentMode()) {
    const newConversion = {
      id: fakeConversions.length > 0 ? Math.max(...fakeConversions.map(c => c.id)) + 1 : 1,
      name: data.name,
      description: data.description || '',
      counter: data.counter || 0,
      value: data.value || 0,
      website_id: data.website_id || null,
      unique_code: data.unique_code || `conversion_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      active: data.active !== undefined ? data.active : true
    };
    
    // Simular añadir a la lista fake
    fakeConversions.push(newConversion);
    
    return {
      data: {
        status: 'success',
        data: newConversion
      }
    };
  }
  
  return post('/conversions', data);
};

/**
 * Actualizar una conversión existente
 * @param {number} id - ID de la conversión a actualizar
 * @param {Object} data - Nuevos datos de la conversión
 * @returns {Promise} - Promise con los datos de la conversión actualizada
 */
export const update = async (id, data) => {
  if (getDevelopmentMode()) {
    const index = fakeConversions.findIndex(conv => conv.id === parseInt(id));
    if (index === -1) {
      throw new Error('Conversión no encontrada');
    }
    
    // Actualizar conversión simulada
    const updatedConversion = {
      ...fakeConversions[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    
    fakeConversions[index] = updatedConversion;
    
    return {
      data: {
        status: 'success',
        data: updatedConversion
      }
    };
  }
  
  return patch(`/conversions/${id}`, data);
};

/**
 * Incrementar el contador de una conversión
 * @param {number} id - ID de la conversión
 * @param {number} value - Valor a incrementar (por defecto 1)
 * @returns {Promise} - Promise con los datos de la conversión actualizada
 */
export const increment = async (id, value = 1) => {
  if (getDevelopmentMode()) {
    const index = fakeConversions.findIndex(conv => conv.id === parseInt(id));
    if (index === -1) {
      throw new Error('Conversión no encontrada');
    }
    
    // Incrementar contador
    fakeConversions[index].counter += value;
    fakeConversions[index].updated_at = new Date().toISOString();
    
    return {
      data: {
        status: 'success',
        data: fakeConversions[index]
      }
    };
  }
  
  return patch(`/conversions/${id}/increment`, { value });
};

/**
 * Eliminar una conversión
 * @param {number} id - ID de la conversión a eliminar
 * @returns {Promise} - Promise con la confirmación de eliminación
 */
export const deleteConversion = async (id) => {
  if (getDevelopmentMode()) {
    const index = fakeConversions.findIndex(conv => conv.id === parseInt(id));
    if (index === -1) {
      throw new Error('Conversión no encontrada');
    }
    
    // Eliminar conversión simulada
    fakeConversions.splice(index, 1);
    
    return {
      data: {
        status: 'success',
        message: 'Conversión eliminada correctamente'
      }
    };
  }
  
  return del(`/conversions/${id}`);
};

// Exportar servicio completo
export default {
  getAll,
  getById,
  create,
  update,
  increment,
  delete: deleteConversion
};
