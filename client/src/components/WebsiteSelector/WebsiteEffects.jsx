import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import useWebsitePermissions from '../../hooks/website/useWebsitePermissions';

// Importamos las acciones a disparar cuando cambia la web seleccionada
import { loadCategories } from '../../redux/slices/categoriesSlice';
import { validateWebsiteSelection } from '../../redux/slices/websiteSlice';

/**
 * Componente de efectos para la selección de websites
 * Este componente no renderiza nada, solo gestiona efectos secundarios
 * cuando cambia la web seleccionada o la ruta de navegación
 */
export default function WebsiteEffects() {
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Obtener la web seleccionada, usuario, y permisos
  const { selectedWebsite } = useSelector((state) => state.websites);
  const { user } = useSelector((state) => state.auth);
  const { canAccessWebsite } = useWebsitePermissions();
  
  // Registro de actividad para desarrollo
  const logEffect = (action, details) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[WebsiteEffects] ${action}:`, details);
    }
  };
  
  // Validar permisos cada vez que cambia el usuario o la web seleccionada
  useEffect(() => {
    if (user && selectedWebsite) {
      logEffect('Validando selección de web', { 
        userId: user.id || user.id_user, 
        websiteId: selectedWebsite.id 
      });
      dispatch(validateWebsiteSelection({ user }));
    }
  }, [user, selectedWebsite, dispatch]);
  
  // Efecto que se ejecuta cuando cambia la web seleccionada
  useEffect(() => {
    // Solo continuar si el usuario está autenticado
    if (!user) return;
    
    // Obtener el ID de la web seleccionada (puede ser null)
    const websiteId = selectedWebsite?.id;
    
    // Verificar permisos para la web seleccionada
    const hasAccess = websiteId ? canAccessWebsite(selectedWebsite) : true;
    
    if (hasAccess) {
      logEffect('Cargando datos para web seleccionada', { websiteId });
      
      // Cargar categorías con el filtro de website_id (si existe una web seleccionada)
      dispatch(loadCategories(websiteId));
      
      // Aquí se pueden añadir más acciones para cargar otros datos
      // dispatch(loadSubcategories(websiteId));
      // dispatch(loadSubsubcategories(websiteId));
      // dispatch(loadPosts(websiteId));
      // dispatch(loadSEO(websiteId));
    } else {
      logEffect('Sin acceso a la web seleccionada', { websiteId });
    }
  }, [selectedWebsite, user, dispatch, canAccessWebsite]);

  // Este efecto se ejecutará cuando cambie la ruta
  useEffect(() => {
    if (!user) return; // No hacer nada si no hay usuario autenticado
    
    const path = location.pathname;
    const websiteId = selectedWebsite?.id;
    
    // Verificar permisos para la web seleccionada
    const hasAccess = websiteId ? canAccessWebsite(selectedWebsite) : true;
    
    if (!hasAccess) {
      logEffect('Sin acceso a la web en cambio de ruta', { websiteId, path });
      return;
    }
    
    logEffect('Cambio de ruta', { path, websiteId });
    
    // Cargar datos específicos según la ruta
    if (path.includes('categories')) {
      dispatch(loadCategories(websiteId));
    }
    
    // Añadir más condiciones para otras rutas
    // if (path.includes('subcategories')) {
    //   dispatch(loadSubcategories(websiteId));
    // }
    
    // if (path.includes('subsubcategories')) {
    //   dispatch(loadSubsubcategories(websiteId));
    // }
    
    // if (path.includes('posts')) {
    //   dispatch(loadPosts(websiteId));
    // }
    
    // if (path.includes('seo')) {
    //   dispatch(loadSEO(websiteId));
    // }
    
  }, [location.pathname, selectedWebsite, user, dispatch, canAccessWebsite]);
  
  // Este componente no tiene UI
  return null;
}