import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWebsiteContext } from '../../contexts/WebsiteContext';
import Swal from 'sweetalert2';
import {
  loadConversions,
  createConversion,
  updateConversion,
  deleteConversion,
  incrementConversion,
  clearConversions
} from '../../redux/slices/conversionsSlice';

/**
 * Hook personalizado para gestionar operaciones con conversiones
 * Se integra con WebsiteContext para filtrar por web seleccionada
 * 
 * @returns {Object} - API para interactuar con conversiones
 */
export default function useConversions() {
  const dispatch = useDispatch();
  // Asumimos que existe un slice de conversions
  const { conversions, loading, error } = useSelector((state) => state.conversions || { conversions: [], loading: false, error: null });
  const { selectedWebsite } = useWebsiteContext();
  
  // Estado local para búsqueda, filtrado y fechas
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [filters, setFilters] = useState({
    source: null,     // Fuente de la conversión
    medium: null,     // Medio
    campaign: null,   // Campaña
    type: null,       // Tipo de conversión (contacto, venta, etc.)
    status: null      // Estado de la conversión (pending, completed, etc.)
  });
  
  /**
   * Cargar conversiones asociadas a la web seleccionada
   */
  const fetchConversions = useCallback(() => {
    if (selectedWebsite) {
      // Usar la acción loadConversions importada
      dispatch(loadConversions(selectedWebsite.id));
    } else {
      // Si no hay sitio web seleccionado, limpiar las conversiones
      dispatch(clearConversions());
    }
  }, [dispatch, selectedWebsite]);
  
  /**
   * Cargar conversiones automáticamente cuando cambia la web seleccionada
   */
  useEffect(() => {
    fetchConversions();
  }, [fetchConversions]);
  
  /**
   * Filtrar conversiones según la web seleccionada y los filtros aplicados
   * 
   * @returns {Array} - Conversiones filtradas
   */
  const getFilteredConversions = useCallback(() => {
    let filtered = conversions;
    
    // Filtrar por web seleccionada
    if (selectedWebsite) {
      filtered = filtered.filter(conversion => 
        conversion.website_id === selectedWebsite.id
      );
    }
    
    // Filtrar por término de búsqueda
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(conversion => 
        conversion.name?.toLowerCase().includes(lowerQuery) ||
        conversion.email?.toLowerCase().includes(lowerQuery) ||
        conversion.phone?.includes(lowerQuery) ||
        conversion.url?.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Filtrar por rango de fechas
    if (dateRange.startDate) {
      const startDate = new Date(dateRange.startDate);
      filtered = filtered.filter(conversion => {
        const convDate = new Date(conversion.created_at);
        return convDate >= startDate;
      });
    }
    
    if (dateRange.endDate) {
      const endDate = new Date(dateRange.endDate);
      endDate.setHours(23, 59, 59); // Establecer a final del día
      filtered = filtered.filter(conversion => {
        const convDate = new Date(conversion.created_at);
        return convDate <= endDate;
      });
    }
    
    // Filtrar por fuente
    if (filters.source) {
      filtered = filtered.filter(conversion => 
        conversion.source === filters.source
      );
    }
    
    // Filtrar por medio
    if (filters.medium) {
      filtered = filtered.filter(conversion => 
        conversion.medium === filters.medium
      );
    }
    
    // Filtrar por campaña
    if (filters.campaign) {
      filtered = filtered.filter(conversion => 
        conversion.campaign === filters.campaign
      );
    }
    
    // Filtrar por tipo
    if (filters.type) {
      filtered = filtered.filter(conversion => 
        conversion.type === filters.type
      );
    }
    
    // Filtrar por estado
    if (filters.status) {
      filtered = filtered.filter(conversion => 
        conversion.status === filters.status
      );
    }
    
    return filtered;
  }, [conversions, selectedWebsite, searchQuery, dateRange, filters]);
  
  /**
   * Ordenar conversiones según la configuración actual
   * 
   * @returns {Array} - Conversiones ordenadas
   */
  const getSortedConversions = useCallback(() => {
    const filtered = getFilteredConversions();
    
    if (!sortConfig.key) return filtered;
    
    return [...filtered].sort((a, b) => {
      // Caso especial para fechas
      if (sortConfig.key === 'created_at' || sortConfig.key === 'updated_at') {
        const dateA = new Date(a[sortConfig.key] || 0);
        const dateB = new Date(b[sortConfig.key] || 0);
        
        if (dateA < dateB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (dateA > dateB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
      
      // Para otros campos
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
  }, [getFilteredConversions, sortConfig]);
  
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
   * Aplicar rango de fechas
   * 
   * @param {Object} range - Rango de fechas {startDate, endDate}
   */
  const setDateFilter = useCallback((range) => {
    setDateRange(range);
  }, []);
  
  /**
   * Limpiar todos los filtros
   */
  const clearFilters = useCallback(() => {
    setFilters({
      source: null,
      medium: null,
      campaign: null,
      type: null,
      status: null
    });
    setDateRange({
      startDate: null,
      endDate: null
    });
    setSearchQuery('');
  }, []);
  
  /**
   * Crear una nueva conversión asociada a la web seleccionada
   * 
   * @param {Object} data - Datos de la conversión a crear
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const handleCreate = useCallback((data) => {
    if (!selectedWebsite) {
      return Promise.reject(new Error('Debes seleccionar una web para asociar la conversión'));
    }
    
    // Asociar la conversión a la web seleccionada
    const conversionData = {
      ...data,
      website_id: selectedWebsite.id
    };
    
    // Usar la acción createConversion importada
    return dispatch(createConversion(conversionData)).unwrap();
  }, [dispatch, selectedWebsite]);
  
  /**
   * Actualizar una conversión existente
   * 
   * @param {number} id - ID de la conversión a actualizar
   * @param {Object} data - Nuevos datos de la conversión
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const handleUpdate = useCallback((id, data) => {
    if (!selectedWebsite) {
      return Promise.reject(new Error('Debes seleccionar una web para actualizar la conversión'));
    }
    
    // Usar la acción updateConversion importada
    return dispatch(updateConversion({ id, data })).unwrap();
  }, [dispatch, selectedWebsite]);
  
  /**
   * Eliminar una conversión
   * 
   * @param {number} id - ID de la conversión a eliminar
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
      // Usar la acción deleteConversion importada
      return dispatch(deleteConversion(id)).unwrap();
    }
    
    return Promise.reject(new Error('Operación cancelada por el usuario'));
  }, [dispatch]);
  
  /**
   * Actualizar estado de una conversión
   * 
   * @param {number} id - ID de la conversión
   * @param {string} status - Nuevo estado
   * @returns {Promise} - Promesa con el resultado de la operación
   */
  const updateStatus = useCallback((id, status) => {
    // Usar la acción updateConversion importada
    return dispatch(updateConversion({ 
      id, 
      data: { status } 
    })).unwrap();
  }, [dispatch]);
  
  /**
   * Obtener métricas resumidas de conversiones
   * 
   * @returns {Object} - Objeto con métricas
   */
  const getConversionMetrics = useCallback(() => {
    const filteredConversions = getFilteredConversions();
    
    // Totales
    const total = filteredConversions.length;
    
    // Métricas por tipo
    const byType = {};
    filteredConversions.forEach(conversion => {
      const type = conversion.type || 'unknown';
      byType[type] = (byType[type] || 0) + 1;
    });
    
    // Métricas por fuente
    const bySource = {};
    filteredConversions.forEach(conversion => {
      const source = conversion.source || 'unknown';
      bySource[source] = (bySource[source] || 0) + 1;
    });
    
    // Métricas por estado
    const byStatus = {};
    filteredConversions.forEach(conversion => {
      const status = conversion.status || 'unknown';
      byStatus[status] = (byStatus[status] || 0) + 1;
    });
    
    // Métricas por día (últimos 30 días)
    const byDate = {};
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    filteredConversions.forEach(conversion => {
      const date = new Date(conversion.created_at);
      if (date >= thirtyDaysAgo) {
        const dateString = date.toISOString().split('T')[0];
        byDate[dateString] = (byDate[dateString] || 0) + 1;
      }
    });
    
    return {
      total,
      byType,
      bySource,
      byStatus,
      byDate
    };
  }, [getFilteredConversions]);
  
  /**
   * Exportar conversiones filtradas a CSV
   * 
   * @returns {string} - Contenido CSV
   */
  const exportToCSV = useCallback(() => {
    const conversions = getSortedConversions();
    
    if (conversions.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin datos',
        text: 'No hay conversiones para exportar con los filtros actuales'
      });
      return null;
    }
    
    // Obtener las cabeceras de todas las propiedades
    const headers = Object.keys(conversions[0]).filter(key => !key.startsWith('_'));
    
    // Crear filas para cada conversión
    const rows = conversions.map(conversion => {
      return headers.map(header => {
        const value = conversion[header];
        // Manejar valores especiales
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
      }).join(',');
    });
    
    // Combinar cabeceras y filas
    const csv = [headers.join(','), ...rows].join('\n');
    
    return csv;
  }, [getSortedConversions]);
  
  /**
   * Normalizar una conversión para garantizar consistencia
   * 
   * @param {Object} conversion - Conversión a normalizar
   * @returns {Object} - Conversión normalizada
   */
  const normalizeConversion = useCallback((conversion) => {
    if (!conversion) return null;
    
    return {
      ...conversion,
      id: conversion.id_conversion || conversion.id || null,
      id_conversion: conversion.id_conversion || conversion.id || null,
      website_id: conversion.website_id || (selectedWebsite ? selectedWebsite.id : null),
      name: conversion.name || "",
      email: conversion.email || "",
      phone: conversion.phone || "",
      message: conversion.message || "",
      url: conversion.url || "",
      source: conversion.source || "direct",
      medium: conversion.medium || "website",
      campaign: conversion.campaign || "",
      type: conversion.type || "contact",
      status: conversion.status || "pending",
      created_at: conversion.created_at || new Date().toISOString(),
      updated_at: conversion.updated_at || new Date().toISOString()
    };
  }, [selectedWebsite]);
  
  /**
   * Normalizar una lista de conversiones
   * 
   * @param {Array} conversionList - Lista de conversiones a normalizar
   * @returns {Array} - Lista de conversiones normalizada
   */
  const normalizeConversions = useCallback((conversionList = []) => {
    if (!Array.isArray(conversionList)) return [];
    return conversionList.map(normalizeConversion);
  }, [normalizeConversion]);
  
  return {
    // Datos
    conversions, 
    loading, 
    error,
    searchQuery,
    sortConfig,
    dateRange,
    filters,
    selectedWebsite,
    
    // Getters con filtros, ordenación y métricas
    getFilteredConversions,
    getSortedConversions,
    getConversionMetrics,
    
    // Setters para filtros, fechas y ordenación
    setSearchQuery,
    requestSort,
    applyFilters,
    setDateFilter,
    clearFilters,
    
    // Operaciones CRUD
    fetchConversions,
    createConversion: handleCreate,
    updateConversion: handleUpdate,
    deleteConversion: handleDelete,
    updateStatus,
    
    // Utilidades
    normalizeConversion,
    normalizeConversions,
    exportToCSV
  };
}