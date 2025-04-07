import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWebsiteContext } from '../../contexts/WebsiteContext';
import Swal from 'sweetalert2';

// Importar acciones del slice
import {
  loadSubsubcategories,
  createSubsubcategory,
  updateSubsubcategory,
  deleteSubsubcategory
} from '../../redux/slices/subsubcategoriesSlice';

// Importar acciones para cargar datos relacionados
import { loadSubcategories } from '../../redux/slices/subcategoriesSlice';
import { loadCategories } from '../../redux/slices/categoriesSlice';

/**
 * Hook personalizado para gestionar operaciones con subsubcategorías
 * Se integra con WebsiteContext para filtrar por web seleccionada
 * 
 * @returns {Object} - API para interactuar con subsubcategorías
 */
export default function useSubsubcategories() {
  const dispatch = useDispatch();
  
  // Obtener datos de Redux
  const { subsubcategories, loading, error } = useSelector((state) => state.subsubcategories || { subsubcategories: [], loading: false, error: null });
  const { subcategories } = useSelector((state) => state.subcategories || { subcategories: [] });
  const { categories } = useSelector((state) => state.categories || { categories: [] });
  const { selectedWebsite } = useWebsiteContext();
  
  // Estado local para búsqueda, ordenamiento y filtrado
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [subcategoryFilter, setSubcategoryFilter] = useState(null);
  
  /**
   * Cargar subsubcategorías y datos relacionados
   */
  const fetchSubsubcategories = useCallback(() => {
    if (selectedWebsite) {
      // Cargar en paralelo todas las entidades necesarias
      dispatch(loadSubsubcategories(selectedWebsite.id));
      
      // Cargar categorías y subcategorías si son necesarias
      if (categories.length === 0) {
        dispatch(loadCategories(selectedWebsite.id));
      }
      
      if (subcategories.length === 0) {
        dispatch(loadSubcategories(selectedWebsite.id));
      }
    }
  }, [dispatch, selectedWebsite, categories.length, subcategories.length]);
  
  /**
   * Cargar datos automáticamente cuando cambia la web seleccionada
   */
  useEffect(() => {
    fetchSubsubcategories();
  }, [fetchSubsubcategories]);
  
  /**
   * Resetear el filtro de subcategoría cuando cambia el filtro de categoría
   */
  useEffect(() => {
    setSubcategoryFilter(null);
  }, [categoryFilter]);
  
  /**
   * Obtener subcategorías filtradas por categoría seleccionada
   * 
   * @returns {Array} - Subcategorías filtradas
   */
  const getFilteredSubcategories = useCallback(() => {
    if (!selectedWebsite) return [];
    
    let filtered = subcategories.filter(sub => 
      sub.website_id === selectedWebsite.id
    );
    
    if (categoryFilter) {
      filtered = filtered.filter(sub => 
        sub.id_categoria === categoryFilter
      );
    }
    
    return filtered;
  }, [subcategories, categoryFilter, selectedWebsite]);
  
  /**
   * Filtrar subsubcategorías según web, categoría, subcategoría y búsqueda
   * 
   * @returns {Array} - Subsubcategorías filtradas
   */
  const getFilteredSubsubcategories = useCallback(() => {
    let filtered = subsubcategories;
    
    // Filtrar por web seleccionada
    if (selectedWebsite) {
      filtered = filtered.filter(subsubcategory => 
        subsubcategory.website_id === selectedWebsite.id
      );
    }
    
    // Filtro por subcategoría
    if (subcategoryFilter) {
      filtered = filtered.filter(subsub => 
        subsub.id_sub_categoria === subcategoryFilter
      );
    } 
    // Filtro por categoría (si no hay filtro de subcategoría)
    else if (categoryFilter) {
      const filteredSubs = getFilteredSubcategories();
      const subIds = filteredSubs.map(sub => sub.id_sub_categoria);
      filtered = filtered.filter(subsub => 
        subIds.includes(subsub.id_sub_categoria)
      );
    }
    
    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(subsub => 
        subsub.nombre?.toLowerCase().includes(lowerQuery) ||
        subsub.descripcion?.toLowerCase().includes(lowerQuery)
      );
    }
    
    return filtered;
  }, [subsubcategories, selectedWebsite, subcategoryFilter, categoryFilter, searchQuery, getFilteredSubcategories]);
  
  /**
   * Ordenar subsubcategorías según la configuración actual
   * 
   * @returns {Array} - Subsubcategorías ordenadas
   */
  const getSortedSubsubcategories = useCallback(() => {
    const filtered = getFilteredSubsubcategories();
    
    if (!sortConfig.key) return filtered;
    
    return [...filtered].sort((a, b) => {
      if (sortConfig.key === 'categoria') {
        // Ordenar por nombre de categoría
        const subA = subcategories.find(sub => sub.id_sub_categoria === a.id_sub_categoria);
        const subB = subcategories.find(sub => sub.id_sub_categoria === b.id_sub_categoria);
        const catA = categories.find(cat => cat.id_categoria === subA?.id_categoria)?.nombre || '';
        const catB = categories.find(cat => cat.id_categoria === subB?.id_categoria)?.nombre || '';
        
        if (catA.toLowerCase() < catB.toLowerCase()) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (catA.toLowerCase() > catB.toLowerCase()) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
      
      if (sortConfig.key === 'subcategoria') {
        // Ordenar por nombre de subcategoría
        const subA = subcategories.find(sub => sub.id_sub_categoria === a.id_sub_categoria)?.nombre || '';
        const subB = subcategories.find(sub => sub.id_sub_categoria === b.id_sub_categoria)?.nombre || '';
        
        if (subA.toLowerCase() < subB.toLowerCase()) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (subA.toLowerCase() > subB.toLowerCase()) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
      
      // Ordenar por otros campos
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
  }, [getFilteredSubsubcategories, sortConfig, subcategories, categories]);
  
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
   * Filtrar por categoría
   * 
   * @param {number|null} catId - ID de la categoría para filtrar
   */
  const filterByCategory = useCallback((catId) => {
    setCategoryFilter(catId);
    // Al cambiar de categoría, resetear el filtro de subcategoría
    setSubcategoryFilter(null);
  }, []);
  
  /**
   * Filtrar por subcategoría
   * 
   * @param {number|null} subId - ID de la subcategoría para filtrar
   */
  const filterBySubcategory = useCallback((subId) => {
    setSubcategoryFilter(subId);
    
    // Si se selecciona una subcategoría, también filtrar por su categoría padre
    if (subId) {
      const parentSubcategory = subcategories.find(sub => sub.id_sub_categoria === subId);
      if (parentSubcategory) {
        setCategoryFilter(parentSubcategory.id_categoria);
      }
    }
  }, [subcategories]);
  
  /**
   * Limpiar todos los filtros
   */
  const clearFilters = useCallback(() => {
    setCategoryFilter(null);
    setSubcategoryFilter(null);
    setSearchQuery('');
  }, []);
  
  /**
   * Crear una nueva subsubcategoría asociada a la web seleccionada
   * 
   * @param {Object} data - Datos de la subsubcategoría a crear
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const handleCreate = useCallback((data) => {
    if (!selectedWebsite) {
      return Promise.reject(new Error('Debes seleccionar una web para asociar la subsubcategoría'));
    }
    
    // Asociar la subsubcategoría a la web seleccionada
    const subsubData = {
      ...data,
      website_id: selectedWebsite.id
    };
    
    return dispatch(createSubsubcategory(subsubData)).unwrap();
  }, [dispatch, selectedWebsite]);
  
  /**
   * Actualizar una subsubcategoría existente
   * 
   * @param {number} id - ID de la subsubcategoría a actualizar
   * @param {Object} data - Nuevos datos de la subsubcategoría
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const handleUpdate = useCallback((id, data) => {
    if (!selectedWebsite) {
      return Promise.reject(new Error('Debes seleccionar una web para actualizar la subsubcategoría'));
    }
    
    // Asegurar que la subsubcategoría sigue asociada a la web correcta
    const subsubData = {
      ...data,
      website_id: selectedWebsite.id
    };
    
    return dispatch(updateSubsubcategory({ id, data: subsubData })).unwrap();
  }, [dispatch, selectedWebsite]);
  
  /**
   * Eliminar una subsubcategoría
   * 
   * @param {number} id - ID de la subsubcategoría a eliminar
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const handleDelete = useCallback(async (id) => {
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
      return dispatch(deleteSubsubcategory(id)).unwrap();
    }
    
    return Promise.reject(new Error('Operación cancelada por el usuario'));
  }, [dispatch]);
  
  /**
   * Obtener categorías disponibles para la web seleccionada
   * 
   * @returns {Array} - Lista de categorías filtradas por la web actual
   */
  const getAvailableCategories = useCallback(() => {
    if (!selectedWebsite) return [];
    
    return categories.filter(category => 
      category.website_id === selectedWebsite.id
    );
  }, [categories, selectedWebsite]);
  
  /**
   * Obtener subcategorías para la categoría seleccionada
   * 
   * @returns {Array} - Lista de subcategorías filtradas
   */
  const getAvailableSubcategories = useCallback(() => {
    if (!selectedWebsite) return [];
    
    let filtered = subcategories.filter(sub => 
      sub.website_id === selectedWebsite.id
    );
    
    if (categoryFilter) {
      filtered = filtered.filter(sub => 
        sub.id_categoria === categoryFilter
      );
    }
    
    return filtered;
  }, [subcategories, selectedWebsite, categoryFilter]);
  
  /**
   * Normalizar una subsubcategoría para garantizar consistencia
   * 
   * @param {Object} subsubcategory - Subsubcategoría a normalizar
   * @returns {Object} - Subsubcategoría normalizada
   */
  const normalizeSubsubcategory = useCallback((subsubcategory) => {
    if (!subsubcategory) return null;
    
    return {
      ...subsubcategory,
      id: subsubcategory.id_sub_sub_categoria || subsubcategory.id || null,
      id_sub_sub_categoria: subsubcategory.id_sub_sub_categoria || subsubcategory.id || null,
      website_id: subsubcategory.website_id || (selectedWebsite ? selectedWebsite.id : null),
      id_sub_categoria: subsubcategory.id_sub_categoria || null,
      nombre: subsubcategory.nombre || "",
      descripcion: subsubcategory.descripcion || "",
      estado: subsubcategory.estado || "active",
      created_at: subsubcategory.created_at || new Date().toISOString(),
      updated_at: subsubcategory.updated_at || new Date().toISOString()
    };
  }, [selectedWebsite]);
  
  /**
   * Normalizar una lista de subsubcategorías
   * 
   * @param {Array} subsubList - Lista de subsubcategorías a normalizar
   * @returns {Array} - Lista de subsubcategorías normalizada
   */
  const normalizeSubsubcategories = useCallback((subsubList = []) => {
    if (!Array.isArray(subsubList)) return [];
    return subsubList.map(normalizeSubsubcategory);
  }, [normalizeSubsubcategory]);
  
  /**
   * Obtener el nombre de la categoría padre de una subcategoría
   * 
   * @param {number} subcategoryId - ID de la subcategoría 
   * @returns {string} - Nombre de la categoría padre
   */
  const getCategoryName = useCallback((subcategoryId) => {
    if (!subcategoryId) return "Sin categoría";
    
    const subcategory = subcategories.find(sub => sub.id_sub_categoria === subcategoryId);
    if (!subcategory) return "Sin categoría";
    
    const category = categories.find(cat => cat.id_categoria === subcategory.id_categoria);
    return category?.nombre || "Sin categoría";
  }, [subcategories, categories]);
  
  /**
   * Obtener el nombre de la subcategoría por su ID
   * 
   * @param {number} subcategoryId - ID de la subcategoría
   * @returns {string} - Nombre de la subcategoría
   */
  const getSubcategoryName = useCallback((subcategoryId) => {
    if (!subcategoryId) return "Sin subcategoría";
    
    const subcategory = subcategories.find(sub => sub.id_sub_categoria === subcategoryId);
    return subcategory?.nombre || "Sin subcategoría";
  }, [subcategories]);
  
  return {
    // Datos
    subsubcategories, 
    loading, 
    error,
    searchQuery,
    sortConfig,
    categoryFilter,
    subcategoryFilter,
    selectedWebsite,
    
    // Getters con filtros y ordenación
    getFilteredSubsubcategories,
    getSortedSubsubcategories,
    getAvailableCategories,
    getAvailableSubcategories,
    getCategoryName,
    getSubcategoryName,
    
    // Setters para filtros y ordenación
    setSearchQuery,
    requestSort,
    filterByCategory,
    filterBySubcategory,
    clearFilters,
    
    // Operaciones CRUD
    fetchSubsubcategories,
    createSubsubcategory: handleCreate,
    updateSubsubcategory: handleUpdate,
    deleteSubsubcategory: handleDelete,
    
    // Utilidades
    normalizeSubsubcategory,
    normalizeSubsubcategories
  };
}