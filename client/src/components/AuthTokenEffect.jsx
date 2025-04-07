import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkTokenValidity } from '../redux/slices/authSlice';

/**
 * Componente de efecto para verificar y actualizar la validez de los tokens JWT
 * Se ejecuta periódicamente y cuando la aplicación se inicia
 */
const AuthTokenEffect = () => {
  const dispatch = useDispatch();
  const { token, tokenRefresh, isAuthenticated } = useSelector(state => state.auth);
  
  // Verificar token al cargar el componente
  useEffect(() => {
    if (isAuthenticated && token && tokenRefresh) {
      dispatch(checkTokenValidity());
    }
  }, []);
  
  // Verificar token cada 5 minutos
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const intervalId = setInterval(() => {
      if (token && tokenRefresh) {
        dispatch(checkTokenValidity());
      }
    }, 5 * 60 * 1000); // 5 minutos
    
    return () => clearInterval(intervalId);
  }, [isAuthenticated, token, tokenRefresh, dispatch]);
  
  // No renderiza nada (es un componente de efecto)
  return null;
};

export default AuthTokenEffect;
