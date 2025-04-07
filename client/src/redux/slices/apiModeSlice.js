import { createSlice } from "@reduxjs/toolkit";
import { setDevelopmentMode } from "../../services/api";

// Función para obtener el modo inicial desde localStorage
const getInitialMode = () => {
  try {
    const storedMode = localStorage.getItem('apiMode');
    return storedMode !== null ? storedMode === 'true' : false; // Por defecto modo real (API)
  } catch (error) {
    console.error('Error al obtener el modo de API del localStorage:', error);
    return false; // Por defecto modo real (API)
  }
};

// Estado inicial: por defecto estaremos en modo desarrollo (datos de prueba)
const initialState = {
  isDevelopmentMode: getInitialMode()
};

const apiModeSlice = createSlice({
  name: "apiMode",
  initialState,
  reducers: {
    setApiMode: (state, action) => {
      state.isDevelopmentMode = action.payload;
      // Actualizamos también la configuración en el servicio API
      setDevelopmentMode(action.payload);
      
      // Forzamos el timestamp para que los componentes sepan que deben recargar
      state.lastChanged = Date.now();
    },
    toggleApiMode: (state) => {
      state.isDevelopmentMode = !state.isDevelopmentMode;
      // Actualizamos también la configuración en el servicio API
      setDevelopmentMode(state.isDevelopmentMode);
      
      // Forzamos el timestamp para que los componentes sepan que deben recargar
      state.lastChanged = Date.now();
    }
  }
});

export const { setApiMode, toggleApiMode } = apiModeSlice.actions;
export default apiModeSlice.reducer;
