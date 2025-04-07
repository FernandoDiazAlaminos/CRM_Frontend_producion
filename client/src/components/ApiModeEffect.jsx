import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setDevelopmentMode } from '../services/api';

/**
 * Componente de efecto para sincronizar el modo API en los servicios
 * cuando cambia en Redux o al iniciar la aplicación.
 * 
 * Este componente no renderiza nada, solo ejecuta efectos secundarios.
 */
const ApiModeEffect = () => {
  // Obtener el estado actual del modo API desde Redux
  const { isDevelopmentMode } = useSelector(state => state.apiMode);
  
  // Efecto para sincronizar el modo API cuando cambia en Redux
  useEffect(() => {
    // Simplemente sincronizamos el modo sin mostrar notificaciones
    setDevelopmentMode(isDevelopmentMode);
  }, [isDevelopmentMode]);
  
  // No renderiza nada, solo ejecuta efectos
  return null;
};

export default ApiModeEffect;
