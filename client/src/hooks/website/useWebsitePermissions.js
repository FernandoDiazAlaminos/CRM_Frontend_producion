import { useSelector } from 'react-redux';

/**
 * Hook personalizado para gestionar permisos relacionados con websites
 * Centraliza la lógica de validación de permisos y acceso a websites
 *
 * @returns {Object} Objeto con métodos y propiedades para gestionar permisos
 */
export default function useWebsitePermissions() {
  // Obtener el usuario actual y la web seleccionada del estado
  const { user } = useSelector((state) => state.auth);
  const { selectedWebsite } = useSelector((state) => state.websites);
  
  // Determinar si el usuario es administrador
  const isAdmin = user?.role === 'admin';
  
  // Obtener el ID de usuario de manera consistente
  const userId = user?.id || user?.id_user || null;
  
  /**
   * Verifica si el usuario tiene permisos para acceder a la web especificada
   * 
   * @param {Object} website - La web a verificar
   * @returns {boolean} - true si tiene permiso, false si no
   */
  const canAccessWebsite = (website) => {
    // Si no hay usuario autenticado, no tiene permiso
    if (!user) return false;
    
    // Si no se proporciona una web, verificamos la web seleccionada
    const targetWebsite = website || selectedWebsite;
    if (!targetWebsite) return false;
    
    // Si es administrador, tiene acceso a todas las webs
    if (isAdmin) return true;
    
    // Si la web no tiene propietario, solo los administradores pueden acceder
    if (targetWebsite.user_id === null) return false;
    
    // Verificar si el usuario es propietario de la web
    return targetWebsite.user_id === userId;
  };
  
  /**
   * Verifica si el usuario puede editar la web especificada
   * 
   * @param {Object} website - La web a verificar
   * @returns {boolean} - true si puede editar, false si no
   */
  const canEditWebsite = (website) => {
    // Para editar se requieren los mismos permisos que para acceder
    return canAccessWebsite(website);
  };
  
  /**
   * Verifica si el usuario puede eliminar la web especificada
   * 
   * @param {Object} website - La web a verificar
   * @returns {boolean} - true si puede eliminar, false si no
   */
  const canDeleteWebsite = (website) => {
    // Si no hay usuario autenticado, no tiene permiso
    if (!user) return false;
    
    // Si no se proporciona una web, verificamos la web seleccionada
    const targetWebsite = website || selectedWebsite;
    if (!targetWebsite) return false;
    
    // Si es administrador, puede eliminar cualquier web
    if (isAdmin) return true;
    
    // Si la web no tiene propietario, solo los administradores pueden eliminarla
    if (targetWebsite.user_id === null) return false;
    
    // Solo el propietario puede eliminar su web
    return targetWebsite.user_id === userId;
  };
  
  /**
   * Verifica si el usuario puede crear nuevas webs
   * 
   * @returns {boolean} - true si puede crear, false si no
   */
  const canCreateWebsite = () => {
    // Todos los usuarios autenticados pueden crear webs
    return !!user;
  };
  
  /**
   * Obtiene una lista de websites filtradas según los permisos del usuario
   * 
   * @param {Array} websites - Lista de websites a filtrar
   * @returns {Array} - Lista de websites a las que el usuario tiene acceso
   */
  const getAccessibleWebsites = (websites = []) => {
    // Si no hay usuario autenticado, no tiene acceso a ninguna web
    if (!user) return [];
    
    // Si es administrador, tiene acceso a todas las webs
    if (isAdmin) return websites;
    
    // Filtramos las webs a las que el usuario tiene acceso (solo las propias)
    return websites.filter(website => website.user_id === userId);
  };
  
  /**
   * Verifica si hay una web seleccionada actualmente
   * 
   * @returns {boolean} - true si hay una web seleccionada, false si no
   */
  const hasSelectedWebsite = () => {
    return !!selectedWebsite;
  };
  
  /**
   * Obtiene el error apropiado para mostrar según el tipo de permiso
   * 
   * @param {string} permissionType - Tipo de permiso ('access', 'edit', 'delete')
   * @param {Object} website - Web objetivo (opcional)
   * @returns {string} - Mensaje de error
   */
  const getPermissionErrorMessage = (permissionType, website) => {
    const targetWebsite = website || selectedWebsite;
    
    if (!user) {
      return "Debes iniciar sesión para acceder a esta funcionalidad";
    }
    
    if (!targetWebsite) {
      return "No se ha seleccionado ninguna web";
    }
    
    if (targetWebsite.user_id === null && !isAdmin) {
      return "Solo los administradores pueden acceder a webs sin propietario";
    }
    
    switch (permissionType) {
      case 'access':
        return "No tienes permiso para acceder a esta web";
      case 'edit':
        return "No tienes permiso para editar esta web";
      case 'delete':
        return "No tienes permiso para eliminar esta web";
      default:
        return "No tienes permisos suficientes";
    }
  };
  
  return {
    // Propiedades
    isAdmin,
    userId,
    selectedWebsite,
    
    // Métodos de verificación de permisos
    canAccessWebsite,
    canEditWebsite,
    canDeleteWebsite,
    canCreateWebsite,
    
    // Métodos utilitarios
    getAccessibleWebsites,
    hasSelectedWebsite,
    getPermissionErrorMessage
  };
}
