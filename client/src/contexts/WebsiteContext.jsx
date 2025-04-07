import React, { createContext, useContext, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectWebsite, 
  clearSelectedWebsite, 
  loadWebsites,
  addWebsite,
  editWebsite,
  removeWebsite,
  showCreateForm,
  showEditForm,
  hideForm
} from '../redux/slices/websiteSlice';
import Swal from 'sweetalert2';
import useWebsitePermissions from '../hooks/website/useWebsitePermissions';
import { normalizeWebsite } from '../utils/websiteUtils';

// Crear el contexto
const WebsiteContext = createContext();

/**
 * Proveedor del contexto de Websites
 * Centraliza la lógica de gestión de websites para reutilización en componentes
 */
export const WebsiteProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { 
    websites, 
    selectedWebsite,
    loading, 
    error,
    isFormVisible,
    editingWebsite
  } = useSelector(state => state.websites);
  
  // Acceder a los permisos
  const { 
    canAccessWebsite,
    canEditWebsite,
    canDeleteWebsite,
    canCreateWebsite,
    getAccessibleWebsites
  } = useWebsitePermissions();
  
  // Cargar todas las webs
  const loadAllWebsites = useCallback(() => {
    return dispatch(loadWebsites()).unwrap();
  }, [dispatch]);
  
  // Seleccionar una web
  const handleSelectWebsite = useCallback((website) => {
    if (!website) return;
    
    const normalizedWebsite = normalizeWebsite(website);
    
    // Verificar permisos antes de seleccionar
    if (canAccessWebsite(normalizedWebsite)) {
      dispatch(selectWebsite(normalizedWebsite));
      
      // Notificar al usuario
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Web seleccionada: ${normalizedWebsite.name}`,
        showConfirmButton: false,
        timer: 2000
      });
      
      return true;
    } else {
      // Notificar al usuario que no tiene permisos
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: "No tienes permisos para acceder a esta web",
        showConfirmButton: false,
        timer: 3000
      });
      
      return false;
    }
  }, [dispatch, canAccessWebsite]);
  
  // Deseleccionar la web actual
  const handleClearSelectedWebsite = useCallback(() => {
    dispatch(clearSelectedWebsite());
    
    // Notificar al usuario
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: "Se ha deseleccionado la web",
      showConfirmButton: false,
      timer: 2000
    });
  }, [dispatch]);
  
  // Abrir formulario de creación
  const handleShowCreateForm = useCallback(() => {
    if (canCreateWebsite()) {
      dispatch(showCreateForm());
      return true;
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: "No tienes permisos para crear webs",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }
  }, [dispatch, canCreateWebsite]);
  
  // Abrir formulario de edición
  const handleShowEditForm = useCallback((website) => {
    if (canEditWebsite(website)) {
      dispatch(showEditForm(website));
      return true;
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: "No tienes permisos para editar esta web",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    }
  }, [dispatch, canEditWebsite]);
  
  // Cerrar formulario
  const handleHideForm = useCallback(() => {
    dispatch(hideForm());
  }, [dispatch]);
  
  // Crear una nueva web
  const handleCreateWebsite = useCallback((websiteData) => {
    if (canCreateWebsite()) {
      return dispatch(addWebsite(websiteData)).unwrap();
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: "No tienes permisos para crear webs",
        showConfirmButton: false,
        timer: 3000
      });
      return Promise.reject("No tienes permisos para crear webs");
    }
  }, [dispatch, canCreateWebsite]);
  
  // Actualizar una web existente
  const handleUpdateWebsite = useCallback((id, data) => {
    const website = websites.find(w => w.id === id);
    
    if (canEditWebsite(website)) {
      return dispatch(editWebsite({ id, data })).unwrap();
    } else {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: "No tienes permisos para editar esta web",
        showConfirmButton: false,
        timer: 3000
      });
      return Promise.reject("No tienes permisos para editar esta web");
    }
  }, [dispatch, websites, canEditWebsite]);
  
  // Eliminar una web
  const handleDeleteWebsite = useCallback(async (id) => {
    const website = websites.find(w => w.id === id);
    
    if (!canDeleteWebsite(website)) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: "No tienes permisos para eliminar esta web",
        showConfirmButton: false,
        timer: 3000
      });
      return Promise.reject("No tienes permisos para eliminar esta web");
    }
    
    // Confirmación antes de eliminar
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    
    if (result.isConfirmed) {
      return dispatch(removeWebsite(id)).unwrap();
    } else {
      return Promise.reject("Operación cancelada por el usuario");
    }
  }, [dispatch, websites, canDeleteWebsite]);
  
  // Obtener webs accesibles
  const getFilteredWebsites = useCallback(() => {
    return getAccessibleWebsites(websites);
  }, [websites, getAccessibleWebsites]);
  
  // Exportar la API del contexto
  const contextValue = {
    // Estado
    websites,
    selectedWebsite,
    loading,
    error,
    isFormVisible,
    editingWebsite,
    
    // Métodos para cargar datos
    loadWebsites: loadAllWebsites,
    
    // Métodos para gestionar la selección
    selectWebsite: handleSelectWebsite,
    clearSelectedWebsite: handleClearSelectedWebsite,
    
    // Métodos para formularios
    showCreateForm: handleShowCreateForm,
    showEditForm: handleShowEditForm,
    hideForm: handleHideForm,
    
    // Métodos CRUD
    createWebsite: handleCreateWebsite,
    updateWebsite: handleUpdateWebsite,
    deleteWebsite: handleDeleteWebsite,
    
    // Utilidades
    getFilteredWebsites,
    
    // Verificación de permisos
    canAccessWebsite,
    canEditWebsite,
    canDeleteWebsite,
    canCreateWebsite
  };
  
  return (
    <WebsiteContext.Provider value={contextValue}>
      {children}
    </WebsiteContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de websites
 * @returns {Object} - API del contexto de websites
 */
export const useWebsiteContext = () => {
  const context = useContext(WebsiteContext);
  
  if (!context) {
    throw new Error('useWebsiteContext debe ser usado dentro de un WebsiteProvider');
  }
  
  return context;
};

export default WebsiteContext;