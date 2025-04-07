import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateWebsiteSelection, loadWebsites } from '../redux/slices/websiteSlice';

/**
 * Este componente no renderiza nada en la UI, pero se encarga de:
 * 1. Validar los permisos de acceso a webs según el rol del usuario
 * 2. Cargar las webs al iniciar sesión o cuando cambia el usuario
 * 3. Mantener sincronizado el estado de las webs con los permisos
 */
export default function AuthRoleValidator() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { selectedWebsite } = useSelector(state => state.websites);

  // Cargar webs cuando cambie el usuario
  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(loadWebsites());
    }
  }, [isAuthenticated, user, dispatch]);

  // Validar selección cuando cambie el usuario o la web seleccionada
  useEffect(() => {
    if (isAuthenticated && user && selectedWebsite) {
      console.log('AuthRoleValidator: Validando acceso a web seleccionada');
      dispatch(validateWebsiteSelection({ user }));
    }
  }, [isAuthenticated, user, selectedWebsite, dispatch]);

  return null; // Este componente no renderiza nada
}
