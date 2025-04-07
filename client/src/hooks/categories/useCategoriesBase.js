import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
  loadCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../../redux/slices/categoriesSlice';
import { useEntityWebsiteHook } from '../common/useEntityWebsiteHook';
import { normalizeCategory, normalizeCategories } from '../../utils/categoryUtils';

/**
 * Implementación alternativa del hook de categorías usando el hook base genérico
 * Ejemplo de cómo implementar un hook específico basado en el genérico
 * 
 * @returns {Object} - API para interactuar con categorías
 */
export default function useCategoriesBase() {
  // Configuración para el hook base
  const config = {
    reduxSlice: 'categories',
    actions: {
      load: loadCategories,
      create: createCategory,
      update: updateCategory,
      delete: deleteCategory
    },
    normalizeItem: normalizeCategory,
    normalizeItems: normalizeCategories,
    initialSortConfig: { key: 'nombre', direction: 'asc' }
  };
  
  // Usar el hook base para la funcionalidad común
  const baseHook = useEntityWebsiteHook(config);
  
  // Acceder al estado global para funcionalidad específica
  const { categories } = useSelector((state) => state.categories);
  
  /**
   * Función personalizada para filtrar categorías por término de búsqueda
   * 
   * @param {Array} items - Lista de categorías
   * @param {string} query - Término de búsqueda
   * @returns {Array} - Categorías filtradas
   */
  const searchCategories = useCallback((items, query) => {
    if (!query.trim()) return items;
    
    const lowerQuery = query.toLowerCase();
    
    return items.filter(category => 
      category.nombre?.toLowerCase().includes(lowerQuery) ||
      category.descripcion?.toLowerCase().includes(lowerQuery)
    );
  }, []);
  
  /**
   * Obtener categorías filtradas y ordenadas
   * 
   * @returns {Array} - Categorías procesadas
   */
  const getFilteredCategories = useCallback(() => {
    return baseHook.getFilteredItems(categories, searchCategories);
  }, [baseHook, categories, searchCategories]);
  
  /**
   * Obtener categorías filtradas y ordenadas
   * 
   * @returns {Array} - Categorías ordenadas
   */
  const getSortedCategories = useCallback(() => {
    return baseHook.getSortedItems(getFilteredCategories());
  }, [baseHook, getFilteredCategories]);
  
  // Agregar funcionalidad específica de categorías
  return {
    ...baseHook,
    categories,
    getFilteredCategories,
    getSortedCategories,
    
    // Renombrar para mantener la API coherente con useCategories
    createCategory: baseHook.createItem,
    updateCategory: baseHook.updateItem,
    deleteCategory: baseHook.deleteItem,
    fetchCategories: baseHook.fetchItems
  };
}