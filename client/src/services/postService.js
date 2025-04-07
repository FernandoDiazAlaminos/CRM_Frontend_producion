import { get, post, patch, del, getDevelopmentMode } from './api';

// Datos simulados para desarrollo
const fakePosts = [
  { 
    id_post: 1, 
    titulo: "Introducción a JavaScript", 
    contenido: "JavaScript es un lenguaje de programación...",
    categoria_id: 1,
    subcategoria_id: 1,
    subsubcategoria_id: 2,
    estado: "active",
    imagen_destacada: "https://ejemplo.com/imagen1.jpg",
    website_id: 1,
    createdAt: "2023-10-15T14:30:00Z",
    updatedAt: "2023-10-16T09:15:00Z"
  },
  { 
    id_post: 2, 
    titulo: "Nutrición y Salud", 
    contenido: "Una buena nutrición es esencial para...",
    categoria_id: 2,
    subcategoria_id: 3,
    subsubcategoria_id: null,
    estado: "active",
    imagen_destacada: "https://ejemplo.com/imagen2.jpg",
    website_id: 1,
    createdAt: "2023-10-10T10:00:00Z",
    updatedAt: "2023-10-10T10:00:00Z"
  },
  { 
    id_post: 3, 
    titulo: "Marketing Digital en 2023", 
    contenido: "Las tendencias de marketing digital...",
    categoria_id: 3,
    subcategoria_id: 4,
    subsubcategoria_id: null,
    estado: "active",
    imagen_destacada: "https://ejemplo.com/imagen3.jpg",
    website_id: 1,
    createdAt: "2023-09-28T16:45:00Z",
    updatedAt: "2023-10-05T11:20:00Z"
  },
  { 
    id_post: 4, 
    titulo: "Mejores Prácticas SEO", 
    contenido: "Para mejorar el posicionamiento de tu sitio web...",
    categoria_id: 5,
    subcategoria_id: 4,
    subsubcategoria_id: null,
    estado: "active",
    imagen_destacada: "https://ejemplo.com/imagen4.jpg",
    website_id: 2,
    createdAt: "2023-09-15T08:30:00Z",
    updatedAt: "2023-09-20T14:10:00Z"
  },
  { 
    id_post: 5, 
    titulo: "Desarrollo Web Moderno", 
    contenido: "Las herramientas y frameworks más utilizados...",
    categoria_id: 1,
    subcategoria_id: 2,
    subsubcategoria_id: 3,
    estado: "draft",
    imagen_destacada: "https://ejemplo.com/imagen5.jpg",
    website_id: 2,
    createdAt: "2023-08-22T13:15:00Z",
    updatedAt: "2023-09-01T09:45:00Z"
  }
];

/**
 * Obtener todos los posts
 * @param {number} websiteId - ID del sitio web (opcional)
 * @param {number} categoriaId - ID de categoría (opcional)
 * @param {number} subcategoriaId - ID de subcategoría (opcional)
 * @param {number} subsubcategoriaId - ID de subsubcategoría (opcional)
 * @param {string} estado - Estado del post (opcional: active, draft, inactive)
 * @returns {Promise} - Promise con los datos de posts
 */
export const getAll = async (params = {}) => {
  const { websiteId, categoriaId, subcategoriaId, subsubcategoriaId, estado } = params;
  
  if (getDevelopmentMode()) {
    // Filtrar según los parámetros proporcionados
    let filteredPosts = [...fakePosts];
    
    if (websiteId) {
      filteredPosts = filteredPosts.filter(post => post.website_id === parseInt(websiteId));
    }
    
    if (categoriaId) {
      filteredPosts = filteredPosts.filter(post => post.categoria_id === parseInt(categoriaId));
    }
    
    if (subcategoriaId) {
      filteredPosts = filteredPosts.filter(post => post.subcategoria_id === parseInt(subcategoriaId));
    }
    
    if (subsubcategoriaId) {
      filteredPosts = filteredPosts.filter(post => post.subsubcategoria_id === parseInt(subsubcategoriaId));
    }
    
    if (estado) {
      filteredPosts = filteredPosts.filter(post => post.estado === estado);
    }
    
    return {
      data: {
        status: 'success',
        data: filteredPosts
      }
    };
  }
  
  // Construir la URL de la API con los parámetros
  let endpoint = '/cms/posts';
  const queryParams = [];
  
  if (websiteId) queryParams.push(`website_id=${websiteId}`);
  if (categoriaId) queryParams.push(`categoria_id=${categoriaId}`);
  if (subcategoriaId) queryParams.push(`subcategoria_id=${subcategoriaId}`);
  if (subsubcategoriaId) queryParams.push(`subsubcategoria_id=${subsubcategoriaId}`);
  if (estado) queryParams.push(`estado=${estado}`);
  
  if (queryParams.length > 0) {
    endpoint += `?${queryParams.join('&')}`;
  }
  
  return get(endpoint);
};

/**
 * Obtener un post específico
 * @param {number} id - ID del post
 * @returns {Promise} - Promise con los datos del post
 */
export const getById = async (id) => {
  if (getDevelopmentMode()) {
    const post = fakePosts.find(p => p.id_post === parseInt(id));
    if (!post) {
      throw new Error('Post no encontrado');
    }
    
    return {
      data: {
        status: 'success',
        data: { ...post }
      }
    };
  }
  
  return get(`/cms/posts/${id}`);
};

/**
 * Crear un nuevo post
 * @param {Object} data - Datos del post a crear
 * @returns {Promise} - Promise con los datos del post creado
 */
export const create = async (data) => {
  if (getDevelopmentMode()) {
    const now = new Date().toISOString();
    const newPost = {
      id_post: fakePosts.length > 0 ? Math.max(...fakePosts.map(p => p.id_post)) + 1 : 1,
      titulo: data.titulo,
      contenido: data.contenido || '',
      categoria_id: data.categoria_id,
      subcategoria_id: data.subcategoria_id,
      subsubcategoria_id: data.subsubcategoria_id,
      estado: data.estado || 'draft',
      imagen_destacada: data.imagen_destacada || null,
      website_id: data.website_id || null,
      createdAt: now,
      updatedAt: now
    };
    
    // Simular añadir a la lista fake
    fakePosts.push(newPost);
    
    return {
      data: {
        status: 'success',
        data: { ...newPost }
      }
    };
  }
  
  return post('/cms/posts', data);
};

/**
 * Actualizar un post existente
 * @param {number} id - ID del post a actualizar
 * @param {Object} data - Nuevos datos del post
 * @returns {Promise} - Promise con los datos del post actualizado
 */
export const update = async (id, data) => {
  if (getDevelopmentMode()) {
    const index = fakePosts.findIndex(p => p.id_post === parseInt(id));
    if (index === -1) {
      throw new Error('Post no encontrado');
    }
    
    const now = new Date().toISOString();
    
    // Actualizar post simulado
    fakePosts[index] = {
      ...fakePosts[index],
      ...data,
      updatedAt: now
    };
    
    return {
      data: {
        status: 'success',
        data: { ...fakePosts[index] }
      }
    };
  }
  
  return patch(`/cms/posts/${id}`, data);
};

/**
 * Eliminar un post
 * @param {number} id - ID del post a eliminar
 * @returns {Promise} - Promise con la confirmación de eliminación
 */
export const deletePost = async (id) => {
  if (getDevelopmentMode()) {
    const index = fakePosts.findIndex(p => p.id_post === parseInt(id));
    if (index === -1) {
      throw new Error('Post no encontrado');
    }
    
    // Eliminar post simulado
    fakePosts.splice(index, 1);
    
    return {
      data: {
        status: 'success',
        message: 'Post eliminado correctamente'
      }
    };
  }
  
  return del(`/cms/posts/${id}`);
};

// Exportar servicio completo
export default {
  getAll,
  getById,
  create,
  update,
  delete: deletePost
};
