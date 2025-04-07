import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  loadCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../../redux/slices/categoriesSlice';
import { useWebsiteContext } from '../../contexts/WebsiteContext';
import Swal from 'sweetalert2';

/**
 * Hook personalizado para gestionar operaciones con categorías
 * Se integra con WebsiteContext para filtrar por web seleccionada
 * 
 * @returns {Object} - API para interactuar con categorías
 */
export default function useCategories() {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
  const { selectedWebsite } = useWebsiteContext();
  
  // Estado local para búsqueda, ordenamiento y filtrado
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'nombre', direction: 'asc' });
  
  /**
   * Cargar categorías asociadas a la web seleccionada
   */
  const fetchCategories = useCallback(() => {
    if (selectedWebsite) {
      dispatch(loadCategories(selectedWebsite.id));
    }
  }, [dispatch, selectedWebsite]);
  
  /**
   * Cargar categorías automáticamente cuando cambia la web seleccionada
   */
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  /**
   * Filtrar categorías según la web seleccionada y términos de búsqueda
   * 
   * @returns {Array} - Categorías filtradas
   */
  const getFilteredCategories = useCallback(() => {
    let filtered = categories;
    
    // Filtrar por web seleccionada
    if (selectedWebsite) {
      filtered = filtered.filter(category => 
        category.website_id === selectedWebsite.id
      );
    }
    
    // Filtrar por término de búsqueda
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(category => 
        category.nombre?.toLowerCase().includes(lowerQuery)
      );
    }
    
    return filtered;
  }, [categories, selectedWebsite, searchQuery]);
  
  /**
   * Ordenar categorías según la configuración actual
   * 
   * @returns {Array} - Categorías ordenadas
   */
  const getSortedCategories = useCallback(() => {
    const filtered = getFilteredCategories();
    
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
  }, [getFilteredCategories, sortConfig]);
  
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
   * Crear una nueva categoría asociada a la web seleccionada
   * 
   * @param {Object} data - Datos de la categoría a crear
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const handleCreate = useCallback((data) => {
    if (!selectedWebsite) {
      return Promise.reject(new Error('Debes seleccionar una web para asociar la categoría'));
    }
    
    // Asociar la categoría a la web seleccionada
    const categoryData = {
      ...data,
      website_id: selectedWebsite.id
    };
    
    return dispatch(createCategory(categoryData)).unwrap();
  }, [dispatch, selectedWebsite]);
  
  /**
   * Actualizar una categoría existente
   * 
   * @param {number} id - ID de la categoría a actualizar
   * @param {Object} data - Nuevos datos de la categoría
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const handleUpdate = useCallback((id, data) => {
    if (!selectedWebsite) {
      return Promise.reject(new Error('Debes seleccionar una web para actualizar la categoría'));
    }
    
    // Asegurar que la categoría sigue asociada a la web correcta
    const categoryData = {
      ...data,
      website_id: selectedWebsite.id
    };
    
    return dispatch(updateCategory({ id, data: categoryData })).unwrap();
  }, [dispatch, selectedWebsite]);
  
  /**
   * Eliminar una categoría
   * 
   * @param {number} id - ID de la categoría a eliminar
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
      return dispatch(deleteCategory(id)).unwrap();
    }
    
    return Promise.reject(new Error('Operación cancelada por el usuario'));
  }, [dispatch]);
  
  /**
   * Normalizar una categoría para garantizar consistencia
   * 
   * @param {Object} category - Categoría a normalizar
   * @returns {Object} - Categoría normalizada
   */
  const normalizeCategory = useCallback((category) => {
    if (!category) return null;
    
    return {
      ...category,
      id: category.id_categoria || category.id || null,
      id_categoria: category.id_categoria || category.id || null,
      website_id: category.website_id || (selectedWebsite ? selectedWebsite.id : null),
      nombre: category.nombre || "",
      descripcion: category.descripcion || "",
      estado: category.estado || "active"
    };
  }, [selectedWebsite]);
  
  /**
   * Normalizar una lista de categorías
   * 
   * @param {Array} categoryList - Lista de categorías a normalizar
   * @returns {Array} - Lista de categorías normalizada
   */
  const normalizeCategories = useCallback((categoryList = []) => {
    if (!Array.isArray(categoryList)) return [];
    return categoryList.map(normalizeCategory);
  }, [normalizeCategory]);
  
  return {
    // Datos
    categories, 
    loading, 
    error,
    searchQuery,
    sortConfig,
    selectedWebsite,
    
    // Getters con filtros y ordenación
    getFilteredCategories,
    getSortedCategories,
    
    // Setters para filtros y ordenación
    setSearchQuery,
    requestSort,
    
    // Operaciones CRUD
    fetchCategories,
    createCategory: handleCreate,
    updateCategory: handleUpdate,
    deleteCategory: handleDelete,
    
    // Utilidades
    normalizeCategory,
    normalizeCategories
  };
}