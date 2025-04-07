import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWebsiteContext } from '../../contexts/WebsiteContext';
import Swal from 'sweetalert2';

// Importar acciones del slice
import {
  loadSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} from '../../redux/slices/subcategoriesSlice';

// Importar acción para cargar categorías si es necesario
import { loadCategories } from '../../redux/slices/categoriesSlice';

/**
 * Hook personalizado para gestionar operaciones con subcategorías
 * Se integra con WebsiteContext para filtrar por web seleccionada
 * 
 * @returns {Object} - API para interactuar con subcategorías
 */
export default function useSubcategories() {
  const dispatch = useDispatch();
  // Asumimos que existe un slice de subcategories
  const { subcategories, loading, error } = useSelector((state) => state.subcategories || { subcategories: [], loading: false, error: null });
  
  // También necesitamos acceder a las categorías principales para relacionar
  const { categories } = useSelector((state) => state.categories || { categories: [] });
  
  const { selectedWebsite } = useWebsiteContext();
  
  // Estado local para búsqueda y filtrado
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });
  const [categoryFilter, setCategoryFilter] = useState(null);
  
  /**
   * Cargar subcategorías asociadas a la web seleccionada
   */
  const fetchSubcategories = useCallback(() => {
    if (selectedWebsite) {
      dispatch(loadSubcategories(selectedWebsite.id));
      
      // También cargar categorías si no están cargadas
      if (categories.length === 0) {
        dispatch(loadCategories(selectedWebsite.id));
      }
    }
  }, [dispatch, selectedWebsite, categories.length]);
  
  /**
   * Cargar subcategorías automáticamente cuando cambia la web seleccionada
   */
  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);
  
  /**
   * Filtrar subcategorías según la web seleccionada, categoría padre y términos de búsqueda
   * 
   * @returns {Array} - Subcategorías filtradas
   */
  const getFilteredSubcategories = useCallback(() => {
    let filtered = subcategories;
    
    // Filtrar por web seleccionada
    if (selectedWebsite) {
      filtered = filtered.filter(subcategory => 
        subcategory.website_id === selectedWebsite.id
      );
    }
    
    // Filtrar por categoría principal
    if (categoryFilter) {
      filtered = filtered.filter(subcategory => 
        subcategory.id_categoria === categoryFilter
      );
    }
    
    // Filtrar por término de búsqueda
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(subcategory => 
        subcategory.nombre?.toLowerCase().includes(lowerQuery) ||
        subcategory.descripcion?.toLowerCase().includes(lowerQuery)
      );
    }
    
    return filtered;
  }, [subcategories, selectedWebsite, categoryFilter, searchQuery]);
  
  /**
   * Ordenar subcategorías según la configuración actual
   * 
   * @returns {Array} - Subcategorías ordenadas
   */
  const getSortedSubcategories = useCallback(() => {
    const filtered = getFilteredSubcategories();
    
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
  }, [getFilteredSubcategories, sortConfig]);
  
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
   * Filtrar por categoría principal
   * 
   * @param {number|null} categoryId - ID de la categoría para filtrar
   */
  const filterByCategory = useCallback((categoryId) => {
    setCategoryFilter(categoryId);
  }, []);
  
  /**
   * Limpiar filtro de categoría
   */
  const clearCategoryFilter = useCallback(() => {
    setCategoryFilter(null);
  }, []);
  
  /**
   * Crear una nueva subcategoría asociada a la web seleccionada
   * 
   * @param {Object} data - Datos de la subcategoría a crear
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const handleCreate = useCallback((data) => {
    if (!selectedWebsite) {
      return Promise.reject(new Error('Debes seleccionar una web para asociar la subcategoría'));
    }
    
    // Asociar la subcategoría a la web seleccionada
    const subcategoryData = {
      ...data,
      website_id: selectedWebsite.id
    };
    
    return dispatch(createSubcategory(subcategoryData)).unwrap();
  }, [dispatch, selectedWebsite]);
  
  /**
   * Actualizar una subcategoría existente
   * 
   * @param {number} id - ID de la subcategoría a actualizar
   * @param {Object} data - Nuevos datos de la subcategoría
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const handleUpdate = useCallback((id, data) => {
    if (!selectedWebsite) {
      return Promise.reject(new Error('Debes seleccionar una web para actualizar la subcategoría'));
    }
    
    // Asegurar que la subcategoría sigue asociada a la web correcta
    const subcategoryData = {
      ...data,
      website_id: selectedWebsite.id
    };
    
    return dispatch(updateSubcategory({ id, data: subcategoryData })).unwrap();
  }, [dispatch, selectedWebsite]);
  
  /**
   * Eliminar una subcategoría
   * 
   * @param {number} id - ID de la subcategoría a eliminar
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
      return dispatch(deleteSubcategory(id)).unwrap();
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
   * Normalizar una subcategoría para garantizar consistencia
   * 
   * @param {Object} subcategory - Subcategoría a normalizar
   * @returns {Object} - Subcategoría normalizada
   */
  const normalizeSubcategory = useCallback((subcategory) => {
    if (!subcategory) return null;
    
    return {
      ...subcategory,
      id: subcategory.id_sub_categoria || subcategory.id_subcategoria || subcategory.id || null,
      id_subcategoria: subcategory.id_sub_categoria || subcategory.id_subcategoria || subcategory.id || null,
      id_sub_categoria: subcategory.id_sub_categoria || subcategory.id_subcategoria || subcategory.id || null,
      website_id: subcategory.website_id || (selectedWebsite ? selectedWebsite.id : null),
      id_categoria: subcategory.id_categoria || subcategory.categoria_id || null,
      nombre: subcategory.nombre || "",
      descripcion: subcategory.descripcion || "",
      estado: subcategory.estado || "active",
      created_at: subcategory.created_at || new Date().toISOString(),
      updated_at: subcategory.updated_at || new Date().toISOString()
    };
  }, [selectedWebsite]);
  
  /**
   * Normalizar una lista de subcategorías
   * 
   * @param {Array} subcategoryList - Lista de subcategorías a normalizar
   * @returns {Array} - Lista de subcategorías normalizada
   */
  const normalizeSubcategories = useCallback((subcategoryList = []) => {
    if (!Array.isArray(subcategoryList)) return [];
    return subcategoryList.map(normalizeSubcategory);
  }, [normalizeSubcategory]);
  
  /**
   * Obtener el nombre de la categoría padre de una subcategoría por su ID
   * 
   * @param {number} categoryId - ID de la categoría padre
   * @returns {string} - Nombre de la categoría padre o "Sin categoría"
   */
  const getCategoryName = useCallback((categoryId) => {
    if (!categoryId) return "Sin categoría";
    
    const category = categories.find(cat => cat.id_categoria === categoryId);
    return category ? category.nombre : "Sin categoría";
  }, [categories]);
  
  return {
    // Datos
    subcategories, 
    loading, 
    error,
    searchQuery,
    sortConfig,
    categoryFilter,
    selectedWebsite,
    
    // Getters con filtros y ordenación
    getFilteredSubcategories,
    getSortedSubcategories,
    getAvailableCategories,
    getCategoryName,
    
    // Setters para filtros y ordenación
    setSearchQuery,
    requestSort,
    filterByCategory,
    clearCategoryFilter,
    
    // Operaciones CRUD
    fetchSubcategories,
    createSubcategory: handleCreate,
    updateSubcategory: handleUpdate,
    deleteSubcategory: handleDelete,
    
    // Utilidades
    normalizeSubcategory,
    normalizeSubcategories
  };
}