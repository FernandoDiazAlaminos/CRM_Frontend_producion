import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWebsiteContext } from '../../contexts/WebsiteContext';
import Swal from 'sweetalert2';
import { 
  loadSEOEntities,
  loadSEOPages,
  createSEOEntity,
  createSEOPage,
  updateSEOEntity,
  updateSEOPage,
  deleteSEOEntity,
  deleteSEOPage,
  setActiveSEOType,
  setSelectedSEO,
  clearSelectedSEO
} from '../../redux/slices/seoSlice';

/**
 * Hook personalizado para gestionar operaciones con SEO
 * Se integra con WebsiteContext para filtrar por web seleccionada
 * 
 * @returns {Object} - API para interactuar con configuraciones SEO
 */
export default function useSEO() {
  const dispatch = useDispatch();
  // Obtener el estado del slice de SEO
  const { 
    seoEntities, 
    seoPages, 
    selectedSEO, 
    activeSEOType, 
    loading, 
    error 
  } = useSelector((state) => state.seo);
  const { selectedWebsite } = useWebsiteContext();
  
  // Estado local para búsqueda y filtrado
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [filters, setFilters] = useState({
    entityType: null, // category, subcategory, subsubcategory, post
    pageType: null,   // home, about, contact, etc.
    status: null      // active, draft, etc.
  });
  
  /**
   * Cargar configuraciones SEO de entidades asociadas a la web seleccionada
   */
  const fetchSEOEntities = useCallback(() => {
    if (selectedWebsite) {
      dispatch(loadSEOEntities(selectedWebsite.id));
    }
  }, [dispatch, selectedWebsite]);
  
  /**
   * Cargar configuraciones SEO de páginas asociadas a la web seleccionada
   */
  const fetchSEOPages = useCallback(() => {
    if (selectedWebsite) {
      dispatch(loadSEOPages(selectedWebsite.id));
    }
  }, [dispatch, selectedWebsite]);
  
  /**
   * Cargar datos SEO según el tipo activo (entidades o páginas)
   */
  const fetchSEOData = useCallback(() => {
    if (activeSEOType === 'entities') {
      fetchSEOEntities();
    } else {
      fetchSEOPages();
    }
  }, [activeSEOType, fetchSEOEntities, fetchSEOPages]);
  
  /**
   * Cargar datos SEO automáticamente cuando cambia la web seleccionada o el tipo activo
   */
  useEffect(() => {
    if (selectedWebsite) {
      fetchSEOData();
    }
  }, [fetchSEOData, selectedWebsite]);
  
  /**
   * Cambiar el tipo activo de SEO (entidades o páginas)
   */
  const setActiveType = useCallback((type) => {
    dispatch(setActiveSEOType(type));
    dispatch(clearSelectedSEO());
  }, [dispatch]);
  
  /**
   * Seleccionar un ítem SEO para editar
   */
  const selectSEOItem = useCallback((item) => {
    dispatch(setSelectedSEO(item));
  }, [dispatch]);
  
  /**
   * Limpiar el ítem SEO seleccionado
   */
  const clearSelection = useCallback(() => {
    dispatch(clearSelectedSEO());
  }, [dispatch]);
  
  /**
   * Filtrar configuraciones SEO según términos de búsqueda y filtros
   * 
   * @returns {Array} - Configuraciones SEO filtradas
   */
  const getFilteredSEOItems = useCallback(() => {
    // Seleccionar datos según el tipo activo
    const items = activeSEOType === 'entities' ? seoEntities : seoPages;
    
    // Retornar todos los items si no hay filtros ni búsqueda
    if (!searchQuery.trim() && !filters.entityType && !filters.pageType && !filters.status) {
      return items;
    }
    
    // Aplicar filtros
    return items.filter(item => {
      // Filtrar por web seleccionada (siempre)
      if (selectedWebsite && item.website_id !== selectedWebsite.id) {
        return false;
      }
      
      // Filtrar por término de búsqueda
      if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase();
        const matchesSearch = 
          item.title?.toLowerCase().includes(lowerQuery) ||
          item.description?.toLowerCase().includes(lowerQuery) ||
          item.keywords?.toLowerCase().includes(lowerQuery) ||
          item.url_canonica?.toLowerCase().includes(lowerQuery) ||
          (activeSEOType === 'pages' && item.nombre_pagina?.toLowerCase().includes(lowerQuery));
        
        if (!matchesSearch) return false;
      }
      
      // Filtrar por tipo de entidad (solo para entidades)
      if (activeSEOType === 'entities' && filters.entityType) {
        // Determinar el tipo basado en los IDs presentes
        const entityType = 
          item.id_categoria ? 'category' :
          item.id_sub_categoria ? 'subcategory' :
          item.id_sub_sub_categoria ? 'subsubcategory' :
          item.id_post ? 'post' : null;
        
        if (entityType !== filters.entityType) return false;
      }
      
      // Filtrar por tipo de página (solo para páginas)
      if (activeSEOType === 'pages' && filters.pageType) {
        if (item.tipo_pagina !== filters.pageType) return false;
      }
      
      // Filtrar por estado
      if (filters.status && item.estado !== filters.status) {
        return false;
      }
      
      return true;
    });
  }, [activeSEOType, seoEntities, seoPages, searchQuery, filters, selectedWebsite]);
  
  /**
   * Ordenar configuraciones SEO según la configuración actual
   * 
   * @returns {Array} - Configuraciones SEO ordenadas
   */
  const getSortedSEOItems = useCallback(() => {
    const filtered = getFilteredSEOItems();
    
    if (!sortConfig.key) return filtered;
    
    return [...filtered].sort((a, b) => {
      // Permitir valores nulos o undefined
      if (!a[sortConfig.key] && !b[sortConfig.key]) return 0;
      if (!a[sortConfig.key]) return 1;
      if (!b[sortConfig.key]) return -1;
      
      const aValue = typeof a[sortConfig.key] === 'string' ? a[sortConfig.key].toLowerCase() : a[sortConfig.key];
      const bValue = typeof b[sortConfig.key] === 'string' ? b[sortConfig.key].toLowerCase() : b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [getFilteredSEOItems, sortConfig]);
  
  /**
   * Cambiar la configuración de ordenamiento
   * 
   * @param {string} key - Clave por la que ordenar
   */
  const requestSort = useCallback((key) => {
    setSortConfig(prevConfig => {
      if (prevConfig.key === key) {
        return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  }, []);
  
  /**
   * Aplicar filtros
   * 
   * @param {Object} newFilters - Nuevos filtros a aplicar
   */
  const applyFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);
  
  /**
   * Limpiar todos los filtros
   */
  const clearFilters = useCallback(() => {
    setFilters({
      entityType: null,
      pageType: null,
      status: null
    });
    setSearchQuery('');
  }, []);
  
  /**
   * Crear una nueva configuración SEO de entidad
   * 
   * @param {Object} data - Datos de la configuración a crear
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const createEntity = useCallback((data) => {
    if (!selectedWebsite) {
      return Promise.reject(new Error('Debes seleccionar una web para asociar la configuración SEO'));
    }
    
    // Asociar la configuración a la web seleccionada
    const seoData = {
      ...data,
      website_id: selectedWebsite.id
    };
    
    return dispatch(createSEOEntity(seoData)).unwrap();
  }, [dispatch, selectedWebsite]);
  
  /**
   * Actualizar una configuración SEO de entidad existente
   * 
   * @param {number} id - ID de la configuración a actualizar
   * @param {Object} data - Nuevos datos de la configuración
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const updateEntity = useCallback((id, data) => {
    if (!selectedWebsite) {
      return Promise.reject(new Error('Debes seleccionar una web para actualizar la configuración SEO'));
    }
    
    // Asegurar que la configuración sigue asociada a la web correcta
    const seoData = {
      ...data,
      website_id: selectedWebsite.id
    };
    
    return dispatch(updateSEOEntity({ id, data: seoData })).unwrap();
  }, [dispatch, selectedWebsite]);
  
  /**
   * Eliminar una configuración SEO de entidad
   * 
   * @param {number} id - ID de la configuración a eliminar
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const deleteEntity = useCallback(async (id) => {
    // Confirmación antes de eliminar
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
    
    if (result.isConfirmed) {
      return dispatch(deleteSEOEntity(id)).unwrap();
    }
    
    return Promise.reject(new Error('Operación cancelada por el usuario'));
  }, [dispatch]);
  
  /**
   * Crear una nueva configuración SEO de página
   * 
   * @param {Object} data - Datos de la configuración a crear
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const createPage = useCallback((data) => {
    if (!selectedWebsite) {
      return Promise.reject(new Error('Debes seleccionar una web para asociar la configuración SEO'));
    }
    
    // Asociar la configuración a la web seleccionada
    const seoData = {
      ...data,
      website_id: selectedWebsite.id
    };
    
    return dispatch(createSEOPage(seoData)).unwrap();
  }, [dispatch, selectedWebsite]);
  
  /**
   * Actualizar una configuración SEO de página existente
   * 
   * @param {number} id - ID de la configuración a actualizar
   * @param {Object} data - Nuevos datos de la configuración
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const updatePage = useCallback((id, data) => {
    if (!selectedWebsite) {
      return Promise.reject(new Error('Debes seleccionar una web para actualizar la configuración SEO'));
    }
    
    // Asegurar que la configuración sigue asociada a la web correcta
    const seoData = {
      ...data,
      website_id: selectedWebsite.id
    };
    
    return dispatch(updateSEOPage({ id, data: seoData })).unwrap();
  }, [dispatch, selectedWebsite]);
  
  /**
   * Eliminar una configuración SEO de página
   * 
   * @param {number} id - ID de la configuración a eliminar
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const deletePage = useCallback(async (id) => {
    // Confirmación antes de eliminar
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });
    
    if (result.isConfirmed) {
      return dispatch(deleteSEOPage(id)).unwrap();
    }
    
    return Promise.reject(new Error('Operación cancelada por el usuario'));
  }, [dispatch]);
  
  /**
   * Crear o actualizar un ítem SEO según el tipo activo
   * 
   * @param {number|null} id - ID del ítem a actualizar, null para crear
   * @param {Object} data - Datos del ítem
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const saveItem = useCallback((id, data) => {
    if (activeSEOType === 'entities') {
      return id ? updateEntity(id, data) : createEntity(data);
    } else {
      return id ? updatePage(id, data) : createPage(data);
    }
  }, [activeSEOType, createEntity, createPage, updateEntity, updatePage]);
  
  /**
   * Eliminar un ítem SEO según el tipo activo
   * 
   * @param {number} id - ID del ítem a eliminar
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const deleteItem = useCallback((id) => {
    return activeSEOType === 'entities' ? deleteEntity(id) : deletePage(id);
  }, [activeSEOType, deleteEntity, deletePage]);
  
  /**
   * Normalizar un ítem SEO
   * 
   * @param {Object} item - Ítem SEO a normalizar
   * @param {string} type - Tipo de ítem ('entity' o 'page')
   * @returns {Object} - Ítem SEO normalizado
   */
  const normalizeSEOItem = useCallback((item, type = null) => {
    if (!item) return null;
    
    const itemType = type || activeSEOType === 'entities' ? 'entity' : 'page';
    
    if (itemType === 'entity') {
      return {
        ...item,
        id: item.id || null,
        website_id: item.website_id || (selectedWebsite ? selectedWebsite.id : null),
        url_canonica: item.url_canonica || "",
        title: item.title || "",
        description: item.description || "",
        keywords: item.keywords || "",
        index: item.index !== false,
        follow: item.follow !== false,
        img: item.img || "",
        alt: item.alt || ""
      };
    } else {
      return {
        ...item,
        id: item.id || null,
        website_id: item.website_id || (selectedWebsite ? selectedWebsite.id : null),
        nombre_pagina: item.nombre_pagina || "",
        url_canonica: item.url_canonica || "",
        title: item.title || "",
        description: item.description || "",
        keywords: item.keywords || "",
        index: item.index !== false,
        follow: item.follow !== false,
        tipo_pagina: item.tipo_pagina || "default"
      };
    }
  }, [activeSEOType, selectedWebsite]);
  
  /**
   * Normalizar una lista de ítems SEO
   * 
   * @param {Array} items - Lista de ítems SEO a normalizar
   * @param {string} type - Tipo de los ítems ('entity' o 'page')
   * @returns {Array} - Lista normalizada de ítems SEO
   */
  const normalizeSEOItems = useCallback((items = [], type = null) => {
    if (!Array.isArray(items)) return [];
    return items.map(item => normalizeSEOItem(item, type));
  }, [normalizeSEOItem]);
  
  /**
   * Obtener resumen de métricas SEO
   * 
   * @returns {Object} - Objeto con métricas resumidas
   */
  const getSEOMetrics = useCallback(() => {
    const items = getFilteredSEOItems();
    
    return {
      total: items.length,
      indexed: items.filter(item => item.index).length,
      nonIndexed: items.filter(item => !item.index).length,
      follow: items.filter(item => item.follow).length,
      noFollow: items.filter(item => !item.follow).length,
      
      // Distribución por tipo para entidades
      ...(activeSEOType === 'entities' ? {
        byEntityType: {
          categories: items.filter(item => item.id_categoria).length,
          subcategories: items.filter(item => item.id_sub_categoria).length,
          subsubcategories: items.filter(item => item.id_sub_sub_categoria).length,
          posts: items.filter(item => item.id_post).length
        }
      } : {}),
      
      // Distribución por tipo para páginas
      ...(activeSEOType === 'pages' ? {
        byPageType: items.reduce((acc, item) => {
          const tipo = item.tipo_pagina || 'other';
          acc[tipo] = (acc[tipo] || 0) + 1;
          return acc;
        }, {})
      } : {})
    };
  }, [activeSEOType, getFilteredSEOItems]);
  
  return {
    // Datos
    seoEntities,
    seoPages,
    selectedSEO,
    activeSEOType,
    loading,
    error,
    searchQuery,
    sortConfig,
    filters,
    selectedWebsite,
    
    // Getters con filtros, ordenación y métricas
    getFilteredSEOItems,
    getSortedSEOItems,
    getSEOMetrics,
    
    // Setters para filtros, ordenación y tipo activo
    setSearchQuery,
    requestSort,
    applyFilters,
    clearFilters,
    setActiveType,
    
    // Selección de ítems
    selectSEOItem,
    clearSelection,
    
    // Operaciones de carga de datos
    fetchSEOEntities,
    fetchSEOPages,
    fetchSEOData,
    
    // Operaciones CRUD unificadas
    saveItem,
    deleteItem,
    
    // Operaciones CRUD específicas de entidades
    createEntity,
    updateEntity,
    deleteEntity,
    
    // Operaciones CRUD específicas de páginas
    createPage,
    updatePage,
    deletePage,
    
    // Utilidades
    normalizeSEOItem,
    normalizeSEOItems
  };
}