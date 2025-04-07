import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginService, verifyToken } from "../../services/authService";

// Función de ayuda para normalizar el objeto de usuario
const normalizeUser = (user) => {
  if (!user) return null;
  
  // Crear una copia para no mutar el objeto original
  const normalizedUser = { ...user };
  
  // Asegurar que user.id esté definido (usar id_user si existe)
  if (!normalizedUser.id && normalizedUser.id_user) {
    normalizedUser.id = normalizedUser.id_user;
  }
  
  // Si no existe role, asignar 'user' como predeterminado
  if (!normalizedUser.role) {
    normalizedUser.role = 'user';
  }
  
  return normalizedUser;
};

// Estado inicial con comprobación de datos en localStorage
const initialState = {
  user: normalizeUser(JSON.parse(localStorage.getItem("user"))) || null,
  token: localStorage.getItem("token") || null,
  tokenRefresh: localStorage.getItem("tokenRefresh") || null,
  isAuthenticated: Boolean(localStorage.getItem("token")),
  loading: false,
  error: null,
};

// Thunk para login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await loginService(email, password);
      
      // Normalizar el usuario
      response.user = normalizeUser(response.user);
      
      // Guardar datos en localStorage
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);
      localStorage.setItem("tokenRefresh", response.tokenRefresh);
      
      // Log para depuración
      console.log("Auth: Login exitoso, datos de usuario:", response.user);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk para verificar y actualizar tokens
export const checkTokenValidity = createAsyncThunk(
  "auth/checkToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token, tokenRefresh, user } = getState().auth;
      
      if (!token || !tokenRefresh) {
        return rejectWithValue("No hay tokens disponibles");
      }
      
      const result = await verifyToken(token, tokenRefresh);
      
      if (result.valid) {
        // Si hay nuevos tokens, actualizarlos
        if (result.newToken && result.newTokenRefresh) {
          localStorage.setItem("token", result.newToken);
          localStorage.setItem("tokenRefresh", result.newTokenRefresh);
          
          return {
            token: result.newToken,
            tokenRefresh: result.newTokenRefresh
          };
        }
        return { valid: true };
      } else if (result.newUser) {
        // Si llega información actualizada del usuario
        const updatedUser = normalizeUser({ ...user, ...result.newUser });
        
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { valid: true, user: updatedUser };
      } else {
        // Si los tokens no son válidos, borrar todo
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("tokenRefresh");
        
        return rejectWithValue("Sesión expirada");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // Limpiar estado
      state.user = null;
      state.token = null;
      state.tokenRefresh = null;
      state.isAuthenticated = false;
      
      // Limpiar localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("tokenRefresh");
    },
    updateTokens: (state, action) => {
      state.token = action.payload.token;
      state.tokenRefresh = action.payload.tokenRefresh;
      
      // Actualizar localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("tokenRefresh", action.payload.tokenRefresh);
    },
    // Nueva acción para actualizar datos de usuario
    updateUserData: (state, action) => {
      // Normalizar el usuario antes de guardarlo
      state.user = normalizeUser(action.payload);
      
      // Actualizar localStorage
      localStorage.setItem("user", JSON.stringify(state.user));
      
      console.log("Auth: Datos de usuario actualizados:", state.user);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.tokenRefresh = action.payload.tokenRefresh;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check Token
      .addCase(checkTokenValidity.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkTokenValidity.fulfilled, (state, action) => {
        state.loading = false;
        // Si hay nuevos tokens, actualizar el estado
        if (action.payload.token && action.payload.tokenRefresh) {
          state.token = action.payload.token;
          state.tokenRefresh = action.payload.tokenRefresh;
        }
        // Si hay información actualizada del usuario
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(checkTokenValidity.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.tokenRefresh = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const { logout, updateTokens, updateUserData } = authSlice.actions;
export default authSlice.reducer;
