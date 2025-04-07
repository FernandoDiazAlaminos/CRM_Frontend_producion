import { API_URL } from '../config';

export const loginService = async (email, password) => {
  try {
    // Modo desarrollo - comentar o eliminar en producción
    if (process.env.NODE_ENV === 'development' && email === 'admin@admin.com' && password === 'password') {
      console.log('Usando autenticación de desarrollo');
      return {
        user: { 
          id_user: 1,
          name: 'Admin', 
          surName: 'Dev',
          email, 
          role: 'admin' 
        },
        token: 'fake-jwt-token',
        tokenRefresh: 'fake-refresh-token'
      };
    }
    
    // Autenticación real con el backend
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la autenticación');
    }

    const data = await response.json();
    
    if (!data.error) {
      // Transformar respuesta del backend al formato esperado por el frontend
      return {
        user: {
          id_user: data.data.idUser,
          name: data.data.name,
          surName: data.data.surName,
          email,
          role: data.data.role
        },
        token: data.data.token,
        tokenRefresh: data.data.tokenRefresh
      };
    } else {
      throw new Error(data.message || 'Error en usuario o contraseña');
    }
  } catch (error) {
    console.error('Error de autenticación:', error);
    throw error;
  }
};

export const verifyToken = async (token, tokenRefresh) => {
  try {
    // Modo desarrollo - comentar o eliminar en producción
    if (process.env.NODE_ENV === 'development' && token === 'fake-jwt-token') {
      return { valid: true };
    }

    // Verificación real con el backend
    const response = await fetch(`${API_URL}/auth/checkToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        userState: {
          token, 
          tokenRefresh
        } 
      })
    });

    if (!response.ok) {
      throw new Error('Error en la verificación del token');
    }

    const data = await response.json();
    
    if (!data.error) {
      if (data.data.statusToken) {
        // Token válido
        return { valid: true };
      } else {
        // Token expirado pero refresh válido, devolver nuevos tokens
        return { 
          valid: true, 
          newToken: data.data.newToken, 
          newTokenRefresh: data.data.newTokenRefresh 
        };
      }
    } else {
      // Ambos tokens son inválidos
      return { valid: false };
    }
  } catch (error) {
    console.error('Error al verificar token:', error);
    return { valid: false };
  }
};
  