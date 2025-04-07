import { get, post, patch, del, getDevelopmentMode } from './api';

// Datos simulados para desarrollo
const fakeUsers = [
  { 
    id_user: 1, 
    name: "Juan", 
    sur_name: "Pérez", 
    email: "juan@example.com", 
    role: "admin",
    dni: "12345678A",
    name_empresa: "DIMAP Solutions",
    website_id: 1
  },
  { 
    id_user: 2, 
    name: "María", 
    sur_name: "López", 
    email: "maria@example.com", 
    role: "user",
    dni: "87654321B",
    name_empresa: "Marketing Digital",
    website_id: 1
  },
  { 
    id_user: 3, 
    name: "Carlos", 
    sur_name: "Ramírez", 
    email: "carlos@example.com", 
    role: "editor",
    dni: "11223344C",
    name_empresa: "Diseño Gráfico",
    website_id: 2
  }
];

/**
 * Obtener todos los usuarios
 * @param {number} websiteId - ID del sitio web (opcional)
 * @returns {Promise} - Promise con los datos de usuarios
 */
export const getAll = async (websiteId = null) => {
  if (getDevelopmentMode()) {
    // Filtrar por website_id si se proporciona
    let filteredUsers = fakeUsers;
    if (websiteId) {
      filteredUsers = fakeUsers.filter(user => user.website_id === parseInt(websiteId));
    }
    
    return {
      data: {
        status: 'success',
        data: filteredUsers
      }
    };
  }
  
  // Construir la URL de la API
  let endpoint = '/users';
  if (websiteId) {
    endpoint += `?website_id=${websiteId}`;
  }
  
  return get(endpoint);
};

/**
 * Obtener un usuario específico
 * @param {number} id - ID del usuario
 * @returns {Promise} - Promise con los datos del usuario
 */
export const getById = async (id) => {
  if (getDevelopmentMode()) {
    const user = fakeUsers.find(user => user.id_user === parseInt(id));
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return {
      data: {
        status: 'success',
        data: user
      }
    };
  }
  
  return get(`/users/${id}`);
};

/**
 * Crear un nuevo usuario
 * @param {Object} data - Datos del usuario a crear
 * @returns {Promise} - Promise con los datos del usuario creado
 */
export const create = async (data) => {
  if (getDevelopmentMode()) {
    const newUser = {
      id_user: fakeUsers.length > 0 ? Math.max(...fakeUsers.map(u => u.id_user)) + 1 : 1,
      name: data.name,
      sur_name: data.sur_name || '',
      email: data.email,
      role: data.role || 'user',
      dni: data.dni || '',
      name_empresa: data.name_empresa || '',
      website_id: data.website_id || null
    };
    
    // Simular añadir a la lista fake
    fakeUsers.push(newUser);
    
    return {
      data: {
        status: 'success',
        data: newUser
      }
    };
  }
  
  return post('/users', data);
};

/**
 * Actualizar un usuario existente
 * @param {number} id - ID del usuario a actualizar
 * @param {Object} data - Nuevos datos del usuario
 * @returns {Promise} - Promise con los datos del usuario actualizado
 */
export const update = async (id, data) => {
  if (getDevelopmentMode()) {
    const index = fakeUsers.findIndex(user => user.id_user === parseInt(id));
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    // Actualizar usuario simulado
    fakeUsers[index] = {
      ...fakeUsers[index],
      ...data
    };
    
    return {
      data: {
        status: 'success',
        data: fakeUsers[index]
      }
    };
  }
  
  return patch(`/users/${id}`, data);
};

/**
 * Eliminar un usuario
 * @param {number} id - ID del usuario a eliminar
 * @returns {Promise} - Promise con la confirmación de eliminación
 */
export const deleteUser = async (id) => {
  if (getDevelopmentMode()) {
    const index = fakeUsers.findIndex(user => user.id_user === parseInt(id));
    if (index === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    // Eliminar usuario simulado
    fakeUsers.splice(index, 1);
    
    return {
      data: {
        status: 'success',
        message: 'Usuario eliminado correctamente'
      }
    };
  }
  
  return del(`/users/${id}`);
};

// Exportar servicio completo
export default {
  getAll,
  getById,
  create,
  update,
  delete: deleteUser
};
