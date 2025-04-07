import { useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useWebsiteContext } from '../../contexts/WebsiteContext';
import Swal from 'sweetalert2';

/**
 * Hook genérico para gestionar entidades que dependen de una web seleccionada
 * Proporciona una base reutilizable para crear hooks específicos para cada entidad
 * 
 * @param {Object} config - Configuración del hook
 * @param {Object} config.reduxSlice - Nombre del slice en Redux
 * @param {Object} config.actions - Acciones Redux para operaciones CRUD
 * @param {Function} config.normalizeItem - Función para normalizar un elemento
 * @param {Function} config.normalizeItems - Función para normalizar una lista de elementos
 * @param {Object} config.initialSortConfig - Configuración inicial de ordenamiento
 * @returns {Object} - API genérica para interactuar con la entidad
 */
export default function useEntityWebsiteHook(config) {
  const {
    reduxSlice,
    actions = {},
    normalizeItem = (item) => item,
    normalizeItems = (items) => Array.isArray(items) ? items.map(normalizeItem) : [],
    initialSortConfig = { key: 'id', direction: 'asc' }
  } = config;
  
  const dispatch = useDispatch();
  const { selectedWebsite } = useWebsiteContext();
  
  // Estado local para búsqueda y ordenamiento
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState(initialSortConfig);
  
  /**
   * Cargar elementos asociados a la web seleccionada
   */
  const fetchItems = useCallback(() => {
    if (selectedWebsite && actions.load) {
      dispatch(actions.load(selectedWebsite.id));
    }
  }, [dispatch, selectedWebsite, actions]);
  
  /**
   * Cargar elementos automáticamente cuando cambia la web seleccionada
   */
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);
  
  /**
   * Filtrar elementos según la web seleccionada y términos de búsqueda
   * 
   * @param {Array} items - Lista de elementos a filtrar
   * @param {Function} filterFn - Función de filtrado personalizada
   * @returns {Array} - Elementos filtrados
   */
  const getFilteredItems = useCallback((items, filterFn = null) => {
    let filtered = items;
    
    // Filtrar por web seleccionada
    if (selectedWebsite) {
      filtered = filtered.filter(item => 
        item.website_id === selectedWebsite.id
      );
    }
    
    // Filtrar por término de búsqueda (si se proporciona una función personalizada)
    if (searchQuery.trim() && filterFn) {
      filtered = filterFn(filtered, searchQuery);
    }
    
    return filtered;
  }, [selectedWebsite, searchQuery]);
  
  /**
   * Ordenar elementos según la configuración actual
   * 
   * @param {Array} items - Lista de elementos a ordenar
   * @returns {Array} - Elementos ordenados
   */
  const getSortedItems = useCallback((items) => {
    if (!sortConfig.key) return items;
    
    return [...items].sort((a, b) => {
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
  }, [sortConfig]);
  
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
   * Crear un nuevo elemento asociado a la web seleccionada
   * 
   * @param {Object} data - Datos del elemento a crear
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const handleCreate = useCallback((data) => {
    if (!selectedWebsite) {
      return Promise.reject(new Error('Debes seleccionar una web para asociar el elemento'));
    }
    
    if (!actions.create) {
      return Promise.reject(new Error('Operación no soportada'));
    }
    
    // Asociar el elemento a la web seleccionada
    const itemData = {
      ...data,
      website_id: selectedWebsite.id
    };
    
    return dispatch(actions.create(itemData)).unwrap();
  }, [dispatch, selectedWebsite, actions]);
  
  /**
   * Actualizar un elemento existente
   * 
   * @param {number} id - ID del elemento a actualizar
   * @param {Object} data - Nuevos datos del elemento
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const handleUpdate = useCallback((id, data) => {
    if (!selectedWebsite) {
      return Promise.reject(new Error('Debes seleccionar una web para actualizar el elemento'));
    }
    
    if (!actions.update) {
      return Promise.reject(new Error('Operación no soportada'));
    }
    
    // Asegurar que el elemento sigue asociado a la web correcta
    const itemData = {
      ...data,
      website_id: selectedWebsite.id
    };
    
    return dispatch(actions.update({ id, data: itemData })).unwrap();
  }, [dispatch, selectedWebsite, actions]);
  
  /**
   * Eliminar un elemento
   * 
   * @param {number} id - ID del elemento a eliminar
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const handleDelete = useCallback(async (id) => {
    if (!actions.delete) {
      return Promise.reject(new Error('Operación no soportada'));
    }
    
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
      return dispatch(actions.delete(id)).unwrap();
    }
    
    return Promise.reject(new Error('Operación cancelada por el usuario'));
  }, [dispatch, actions]);
  
  return {
    // Proporciona estos métodos base
    selectedWebsite,
    searchQuery,
    sortConfig,
    setSearchQuery,
    requestSort,
    
    // Funciones para acceder y manipular elementos
    fetchItems,
    getFilteredItems,
    getSortedItems,
    
    // Operaciones CRUD
    createItem: handleCreate,
    updateItem: handleUpdate,
    deleteItem: handleDelete,
    
    // Utilidades de normalización
    normalizeItem,
    normalizeItems
  };
}