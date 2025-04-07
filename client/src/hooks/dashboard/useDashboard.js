import { useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useWebsiteContext } from '../../contexts/WebsiteContext';
import useConversions from '../conversions/useConversions';
import useSEO from '../seo/useSEO';

/**
 * Hook personalizado para gestionar datos agregados del dashboard
 * Integra información de múltiples fuentes en un solo lugar
 * 
 * @returns {Object} - API para interactuar con datos del dashboard
 */
export default function useDashboard() {
  const { selectedWebsite } = useWebsiteContext();
  
  // Estado de carga para datos agregados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Hooks para datos específicos
  const { 
    fetchConversions,
    getConversionMetrics
  } = useConversions();
  
  const {
    fetchSEOSettings,
    getSEOMetrics
  } = useSEO();
  
  // Estadísticas adicionales del estado global
  const { categories } = useSelector((state) => state.categories || { categories: [] });
  const { subcategories } = useSelector((state) => state.subcategories || { subcategories: [] });
  const { posts } = useSelector((state) => state.posts || { posts: [] });
  
  // Fecha para filtros
  const [dateRange, setDateRange] = useState({
    startDate: (() => {
      const date = new Date();
      date.setDate(date.getDate() - 30); // Últimos 30 días por defecto
      return date.toISOString().split('T')[0];
    })(),
    endDate: new Date().toISOString().split('T')[0]
  });
  
  /**
   * Cargar todos los datos necesarios para el dashboard
   */
  const loadDashboardData = useCallback(async () => {
    if (!selectedWebsite) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Cargar datos simultáneamente
      await Promise.all([
        fetchConversions(),
        fetchSEOSettings()
        // Asumimos que los otros datos ya se cargan desde sus propios hooks
      ]);
      
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Error al cargar datos del dashboard');
      setLoading(false);
    }
  }, [selectedWebsite, fetchConversions, fetchSEOSettings]);
  
  /**
   * Cargar datos automáticamente cuando cambia la web seleccionada
   */
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);
  
  /**
   * Filtrar elementos por la web seleccionada
   * 
   * @param {Array} items - Lista de elementos
   * @returns {Array} - Elementos filtrados
   */
  const filterByWebsite = useCallback((items = []) => {
    if (!selectedWebsite || !Array.isArray(items)) return [];
    
    return items.filter(item => 
      item.website_id === selectedWebsite.id
    );
  }, [selectedWebsite]);
  
  /**
   * Obtener métricas de contenido (categorías, subcategorías, posts)
   * 
   * @returns {Object} - Métricas de contenido
   */
  const getContentMetrics = useCallback(() => {
    // Filtrar por web seleccionada
    const websiteCategories = filterByWebsite(categories);
    const websiteSubcategories = filterByWebsite(subcategories);
    const websitePosts = filterByWebsite(posts);
    
    return {
      categories: {
        total: websiteCategories.length,
        active: websiteCategories.filter(c => c.estado === 'active').length
      },
      subcategories: {
        total: websiteSubcategories.length,
        active: websiteSubcategories.filter(s => s.estado === 'active').length
      },
      posts: {
        total: websitePosts.length,
        published: websitePosts.filter(p => p.estado === 'published').length,
        draft: websitePosts.filter(p => p.estado === 'draft').length
      },
      // Distribución de contenido por categoría
      contentDistribution: websiteCategories.map(category => {
        const categoryId = category.id_categoria;
        const categorySubcategories = websiteSubcategories.filter(s => s.id_categoria === categoryId);
        const categoryPosts = websitePosts.filter(p => p.id_categoria === categoryId);
        
        return {
          categoryId,
          categoryName: category.nombre,
          subcategoriesCount: categorySubcategories.length,
          postsCount: categoryPosts.length
        };
      })
    };
  }, [categories, subcategories, posts, filterByWebsite]);
  
  /**
   * Obtener todas las métricas agregadas del dashboard
   * 
   * @returns {Object} - Métricas completas
   */
  const getDashboardMetrics = useCallback(() => {
    if (!selectedWebsite) {
      return null;
    }
    
    // Integrar métricas de distintas fuentes
    return {
      website: {
        id: selectedWebsite.id,
        name: selectedWebsite.name,
        url: selectedWebsite.url,
        status: selectedWebsite.status
      },
      content: getContentMetrics(),
      seo: getSEOMetrics(),
      conversions: getConversionMetrics(),
      dateRange
    };
  }, [selectedWebsite, getContentMetrics, getSEOMetrics, getConversionMetrics, dateRange]);
  
  /**
   * Cambiar rango de fechas
   * 
   * @param {Object} range - Nuevo rango de fechas
   */
  const changeDateRange = useCallback((range) => {
    setDateRange(range);
  }, []);
  
  /**
   * Configurar rango de fechas rápido
   * 
   * @param {string} preset - Preajuste ('week', 'month', 'quarter', 'year')
   */
  const setQuickDateRange = useCallback((preset) => {
    const endDate = new Date();
    let startDate = new Date();
    
    switch (preset) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }
    
    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    });
  }, []);
  
  /**
   * Preparar datos para gráficos
   * 
   * @returns {Object} - Datos para gráficos
   */
  const getChartData = useCallback(() => {
    if (!selectedWebsite) {
      return null;
    }
    
    const conversionMetrics = getConversionMetrics();
    
    // Datos para gráfico de conversiones por día
    const conversionsByDate = [];
    
    // Crear un array de todas las fechas en el rango
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    const dateArray = [];
    
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      dateArray.push(new Date(dt).toISOString().split('T')[0]);
    }
    
    // Rellenar con datos
    const byDate = conversionMetrics?.byDate || {};
    
    dateArray.forEach(date => {
      conversionsByDate.push({
        date,
        count: byDate[date] || 0
      });
    });
    
    // Datos para gráfico de distribución de contenido
    const contentDistribution = getContentMetrics().contentDistribution || [];
    
    // Datos para gráfico de distribución de conversiones por fuente
    const conversionsBySource = Object.entries(conversionMetrics?.bySource || {})
      .map(([source, count]) => ({ source, count }));
    
    return {
      conversionsByDate,
      contentDistribution,
      conversionsBySource
    };
  }, [selectedWebsite, getConversionMetrics, dateRange, getContentMetrics]);
  
  return {
    // Estado
    loading,
    error,
    dateRange,
    selectedWebsite,
    
    // Getters para métricas
    getDashboardMetrics,
    getChartData,
    
    // Acciones
    loadDashboardData,
    changeDateRange,
    setQuickDateRange
  };
}