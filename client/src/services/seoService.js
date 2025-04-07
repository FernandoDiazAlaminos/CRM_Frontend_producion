import { get, post, patch, del, getDevelopmentMode } from './api';

// Datos simulados para SEO de entidades
const fakeSEOEntities = [
  { 
    id: 1, 
    id_categoria: 1,
    id_sub_categoria: null,
    id_sub_sub_categoria: null,
    id_post: null,
    url_canonica: "/categorias/marketing-digital", 
    title: "Marketing Digital - DIMAP", 
    description: "Todo sobre marketing digital y estrategias para empresas.", 
    keywords: "marketing digital, seo, sem, estrategias digitales",
    index: true,
    follow: true,
    img: "/img/marketing-digital.jpg",
    alt: "Estrategias de marketing digital",
    website_id: 1
  },
  { 
    id: 2, 
    id_categoria: null,
    id_sub_categoria: null,
    id_sub_sub_categoria: null,
    id_post: 1,
    url_canonica: "/blog/mejores-practicas-seo", 
    title: "Mejores prácticas SEO - DIMAP", 
    description: "Guía completa sobre las mejores prácticas SEO para 2025.", 
    keywords: "seo, optimización web, motores de búsqueda, posicionamiento",
    index: true,
    follow: true,
    img: "/img/cms/seo-practicas.jpg",
    alt: "Mejores prácticas SEO",
    website_id: 1
  },
  { 
    id: 3, 
    id_categoria: null,
    id_sub_categoria: 2,
    id_sub_sub_categoria: null,
    id_post: null,
    url_canonica: "/subcategorias/redes-sociales", 
    title: "Estrategias para Redes Sociales - DIMAP", 
    description: "Optimiza tu presencia en redes sociales con nuestras estrategias.", 
    keywords: "redes sociales, instagram, facebook, linkedin, estrategia digital",
    index: true,
    follow: true,
    img: "/img/redes-sociales.jpg",
    alt: "Estrategias en redes sociales",
    website_id: 2
  },
];

// Datos simulados para SEO de páginas estáticas
const fakeSEOPages = [
  { 
    id: 1, 
    nombre_pagina: "Inicio",
    url_canonica: "/", 
    title: "DIMAP - Agencia de Marketing Digital", 
    description: "DIMAP es tu agencia de marketing digital especializada en estrategias personalizadas para tu negocio.", 
    keywords: "dimap, marketing digital, agencia, seo, desarrollo web",
    index: true,
    follow: true,
    img: "/img/home-dimap.jpg",
    alt: "DIMAP Agencia de Marketing",
    website_id: 1
  },
  { 
    id: 2, 
    nombre_pagina: "Contacto",
    url_canonica: "/contacto", 
    title: "Contacta con DIMAP | Agencia de Marketing Digital", 
    description: "Contacta con nuestro equipo de expertos en marketing digital para impulsar tu negocio.", 
    keywords: "contacto dimap, consultoría marketing, presupuesto marketing",
    index: true,
    follow: true,
    img: "/img/contacto-dimap.jpg",
    alt: "Contacto DIMAP",
    website_id: 1
  },
  { 
    id: 3, 
    nombre_pagina: "Servicios",
    url_canonica: "/servicios", 
    title: "Servicios de Marketing Digital | DIMAP", 
    description: "Descubre todos los servicios de marketing digital que ofrecemos en DIMAP.", 
    keywords: "servicios marketing, seo, sem, diseño web, social media",
    index: true,
    follow: true,
    img: "/img/servicios-dimap.jpg",
    alt: "Servicios de Marketing Digital DIMAP",
    website_id: 2
  },
];

// ==================== SERVICIOS PARA SEO DE ENTIDADES ====================

/**
 * Obtener todas las configuraciones SEO de entidades
 * @param {number} websiteId - ID del sitio web (opcional)
 * @returns {Promise} - Promise con los datos de SEO de entidades
 */
export const getAllEntities = async (websiteId = null) => {
  if (getDevelopmentMode()) {
    // Filtrar por website_id si se proporciona
    let filteredEntities = fakeSEOEntities;
    if (websiteId) {
      filteredEntities = fakeSEOEntities.filter(entity => entity.website_id === parseInt(websiteId));
    }
    
    return {
      data: {
        status: 'success',
        data: filteredEntities
      }
    };
  }
  
  // Construir la URL de la API
  let endpoint = '/cms/seo/entities';
  if (websiteId) {
    endpoint += `?website_id=${websiteId}`;
  }
  
  return get(endpoint);
};

/**
 * Obtener SEO de una entidad por categoría
 * @param {number} categoryId - ID de la categoría
 * @returns {Promise} - Promise con los datos de SEO
 */
export const getByCategory = async (categoryId) => {
  if (getDevelopmentMode()) {
    const seoEntity = fakeSEOEntities.find(entity => entity.id_categoria === parseInt(categoryId));
    if (!seoEntity) {
      return {
        data: {
          status: 'success',
          data: null
        }
      };
    }
    
    return {
      data: {
        status: 'success',
        data: seoEntity
      }
    };
  }
  
  return get(`/cms/seo/categories/${categoryId}`);
};

/**
 * Obtener SEO de una entidad por subcategoría
 * @param {number} subcategoryId - ID de la subcategoría
 * @returns {Promise} - Promise con los datos de SEO
 */
export const getBySubcategory = async (subcategoryId) => {
  if (getDevelopmentMode()) {
    const seoEntity = fakeSEOEntities.find(entity => entity.id_sub_categoria === parseInt(subcategoryId));
    if (!seoEntity) {
      return {
        data: {
          status: 'success',
          data: null
        }
      };
    }
    
    return {
      data: {
        status: 'success',
        data: seoEntity
      }
    };
  }
  
  return get(`/cms/seo/subcategories/${subcategoryId}`);
};

/**
 * Obtener SEO de una entidad por subsubcategoría
 * @param {number} subsubcategoryId - ID de la subsubcategoría
 * @returns {Promise} - Promise con los datos de SEO
 */
export const getBySubsubcategory = async (subsubcategoryId) => {
  if (getDevelopmentMode()) {
    const seoEntity = fakeSEOEntities.find(entity => entity.id_sub_sub_categoria === parseInt(subsubcategoryId));
    if (!seoEntity) {
      return {
        data: {
          status: 'success',
          data: null
        }
      };
    }
    
    return {
      data: {
        status: 'success',
        data: seoEntity
      }
    };
  }
  
  return get(`/cms/seo/subsubcategories/${subsubcategoryId}`);
};

/**
 * Obtener SEO de una entidad por post
 * @param {number} postId - ID del post
 * @returns {Promise} - Promise con los datos de SEO
 */
export const getByPost = async (postId) => {
  if (getDevelopmentMode()) {
    const seoEntity = fakeSEOEntities.find(entity => entity.id_post === parseInt(postId));
    if (!seoEntity) {
      return {
        data: {
          status: 'success',
          data: null
        }
      };
    }
    
    return {
      data: {
        status: 'success',
        data: seoEntity
      }
    };
  }
  
  return get(`/cms/seo/posts/${postId}`);
};

/**
 * Crear una nueva configuración SEO para entidad
 * @param {Object} data - Datos de la configuración SEO a crear
 * @returns {Promise} - Promise con los datos de la configuración SEO creada
 */
export const createEntity = async (data) => {
  if (getDevelopmentMode()) {
    const newEntity = {
      id: fakeSEOEntities.length > 0 ? Math.max(...fakeSEOEntities.map(e => e.id)) + 1 : 1,
      ...data
    };
    
    // Simular añadir a la lista fake
    fakeSEOEntities.push(newEntity);
    
    return {
      data: {
        status: 'success',
        data: { ...newEntity }
      }
    };
  }
  
  return post('/cms/seo/entities', data);
};

/**
 * Actualizar una configuración SEO de entidad existente
 * @param {number} id - ID de la configuración SEO a actualizar
 * @param {Object} data - Nuevos datos de la configuración SEO
 * @returns {Promise} - Promise con los datos de la configuración SEO actualizada
 */
export const updateEntity = async (id, data) => {
  if (getDevelopmentMode()) {
    const index = fakeSEOEntities.findIndex(entity => entity.id === parseInt(id));
    if (index === -1) {
      throw new Error('Configuración SEO de entidad no encontrada');
    }
    
    // Actualizar entidad simulada
    fakeSEOEntities[index] = {
      ...fakeSEOEntities[index],
      ...data
    };
    
    return {
      data: {
        status: 'success',
        data: { ...fakeSEOEntities[index] }
      }
    };
  }
  
  return patch(`/cms/seo/entities/${id}`, data);
};

/**
 * Eliminar una configuración SEO de entidad
 * @param {number} id - ID de la configuración SEO a eliminar
 * @returns {Promise} - Promise con la confirmación de eliminación
 */
export const deleteEntity = async (id) => {
  if (getDevelopmentMode()) {
    const index = fakeSEOEntities.findIndex(entity => entity.id === parseInt(id));
    if (index === -1) {
      throw new Error('Configuración SEO de entidad no encontrada');
    }
    
    // Eliminar entidad simulada
    fakeSEOEntities.splice(index, 1);
    
    return {
      data: {
        status: 'success',
        message: 'Configuración SEO de entidad eliminada correctamente'
      }
    };
  }
  
  return del(`/cms/seo/entities/${id}`);
};

// ==================== SERVICIOS PARA SEO DE PÁGINAS ====================

/**
 * Obtener todas las configuraciones SEO de páginas
 * @param {number} websiteId - ID del sitio web (opcional)
 * @returns {Promise} - Promise con los datos de SEO de páginas
 */
export const getAllPages = async (websiteId = null) => {
  if (getDevelopmentMode()) {
    // Filtrar por website_id si se proporciona
    let filteredPages = fakeSEOPages;
    if (websiteId) {
      filteredPages = fakeSEOPages.filter(page => page.website_id === parseInt(websiteId));
    }
    
    return {
      data: {
        status: 'success',
        data: filteredPages
      }
    };
  }
  
  // Construir la URL de la API
  let endpoint = '/cms/seo/pages';
  if (websiteId) {
    endpoint += `?website_id=${websiteId}`;
  }
  
  return get(endpoint);
};

/**
 * Obtener SEO de una página específica
 * @param {number} id - ID de la página
 * @returns {Promise} - Promise con los datos de SEO de la página
 */
export const getPageById = async (id) => {
  if (getDevelopmentMode()) {
    const seoPage = fakeSEOPages.find(page => page.id === parseInt(id));
    if (!seoPage) {
      throw new Error('Configuración SEO de página no encontrada');
    }
    
    return {
      data: {
        status: 'success',
        data: seoPage
      }
    };
  }
  
  return get(`/cms/seo/pages/${id}`);
};

/**
 * Crear una nueva configuración SEO para página
 * @param {Object} data - Datos de la configuración SEO de página a crear
 * @returns {Promise} - Promise con los datos de la configuración SEO creada
 */
export const createPage = async (data) => {
  if (getDevelopmentMode()) {
    const newPage = {
      id: fakeSEOPages.length > 0 ? Math.max(...fakeSEOPages.map(p => p.id)) + 1 : 1,
      ...data
    };
    
    // Simular añadir a la lista fake
    fakeSEOPages.push(newPage);
    
    return {
      data: {
        status: 'success',
        data: { ...newPage }
      }
    };
  }
  
  return post('/cms/seo/pages', data);
};

/**
 * Actualizar una configuración SEO de página existente
 * @param {number} id - ID de la configuración SEO de página a actualizar
 * @param {Object} data - Nuevos datos de la configuración SEO de página
 * @returns {Promise} - Promise con los datos de la configuración SEO actualizada
 */
export const updatePage = async (id, data) => {
  if (getDevelopmentMode()) {
    const index = fakeSEOPages.findIndex(page => page.id === parseInt(id));
    if (index === -1) {
      throw new Error('Configuración SEO de página no encontrada');
    }
    
    // Actualizar página simulada
    fakeSEOPages[index] = {
      ...fakeSEOPages[index],
      ...data
    };
    
    return {
      data: {
        status: 'success',
        data: { ...fakeSEOPages[index] }
      }
    };
  }
  
  return patch(`/cms/seo/pages/${id}`, data);
};

/**
 * Eliminar una configuración SEO de página
 * @param {number} id - ID de la configuración SEO de página a eliminar
 * @returns {Promise} - Promise con la confirmación de eliminación
 */
export const deletePage = async (id) => {
  if (getDevelopmentMode()) {
    const index = fakeSEOPages.findIndex(page => page.id === parseInt(id));
    if (index === -1) {
      throw new Error('Configuración SEO de página no encontrada');
    }
    
    // Eliminar página simulada
    fakeSEOPages.splice(index, 1);
    
    return {
      data: {
        status: 'success',
        message: 'Configuración SEO de página eliminada correctamente'
      }
    };
  }
  
  return del(`/cms/seo/pages/${id}`);
};

// Exportar servicio completo
export default {
  // SEO de entidades
  getAllEntities,
  getByCategory,
  getBySubcategory,
  getBySubsubcategory,
  getByPost,
  createEntity,
  updateEntity,
  deleteEntity,
  
  // SEO de páginas
  getAllPages,
  getPageById,
  createPage,
  updatePage,
  deletePage
};
