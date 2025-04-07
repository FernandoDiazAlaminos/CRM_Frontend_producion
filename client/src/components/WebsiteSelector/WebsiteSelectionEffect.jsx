import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useWebsiteContext } from '../../contexts/WebsiteContext';

// Importamos las acciones que queremos disparar cuando cambia la web seleccionada
import { loadCategories } from '../../redux/slices/categoriesSlice';
import { validateWebsiteSelection } from '../../redux/slices/websiteSlice';

/**
 * Componente que detecta cambios en la web seleccionada y dispara acciones asociadas
 * No renderiza nada, solo gestiona efectos secundarios
 */
export default function WebsiteSelectionEffect() {
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Usar nuestro contexto de websites
  const { selectedWebsite, canAccessWebsite } = useWebsiteContext();
  const { user } = useSelector((state) => state.auth);
  
  // Logger para depuración
  const logEffect = (action, details) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[WebsiteSelectionEffect] ${action}:`, details);
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
    const hasAccess = canAccessWebsite(selectedWebsite);
    
    if (hasAccess) {
      logEffect('Cargando datos para web seleccionada', { websiteId });
      
      // Cargar categorías con el filtro de website_id
      dispatch(loadCategories(websiteId));
      
      // Aquí se pueden cargar otros datos relacionados
      // dispatch(loadSubcategories(websiteId));
      // dispatch(loadSubsubcategories(websiteId));
      // dispatch(loadPosts(websiteId));
      // dispatch(loadSEO(websiteId));
    } else {
      logEffect('Sin acceso a la web seleccionada', { websiteId });
    }
  }, [selectedWebsite, user, dispatch, canAccessWebsite]);

  // Este efecto se ejecuta cuando cambia la ruta
  useEffect(() => {
    if (!user) return; // No hacer nada si no hay usuario autenticado
    
    const path = location.pathname;
    const websiteId = selectedWebsite?.id;
    
    // Verificar permisos para la web seleccionada
    const hasAccess = canAccessWebsite(selectedWebsite);
    
    if (!hasAccess) {
      logEffect('Sin acceso a la web en cambio de ruta', { websiteId, path });
      return;
    }
    
    logEffect('Cambio de ruta', { path, websiteId });
    
    // Cargar datos específicos según la ruta
    if (path.includes('categories')) {
      dispatch(loadCategories(websiteId));
    }
    
    // Añadir más condiciones para otras rutas cuando estén implementadas
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