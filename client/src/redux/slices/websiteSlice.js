import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { 
  fetchWebsites, 
  fetchWebsiteById, 
  createWebsite, 
  updateWebsite, 
  deleteWebsite 
} from "../../services/websiteService";
import { 
  normalizeWebsite, 
  normalizeWebsites, 
  getUserId 
} from '../../utils/websiteUtils';

// Logger para el módulo de websiteSlice
const logWebsiteAction = (action, details) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[WebsiteSlice] ${action}:`, details);
  }
};

// Thunk para cargar todas las webs basado en rol
export const loadWebsites = createAsyncThunk(
  "websites/load", 
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      // Si el usuario no está autenticado, mostrar error
      if (!auth.isAuthenticated || !auth.user) {
        return rejectWithValue("Usuario no autenticado");
      }
      
      // Extraer id y role de forma segura
      const userId = getUserId(auth.user);
      const isAdmin = auth.user.role === "admin";
      
      logWebsiteAction('Cargando webs', { userId, isAdmin });
      
      // Si es admin, cargar todas las webs; si no, solo las del usuario
      const websites = await fetchWebsites(isAdmin ? null : userId);
      
      // Normalizar la respuesta para asegurar consistencia
      return normalizeWebsites(websites);
    } catch (error) {
      logWebsiteAction('Error al cargar webs', error);
      return rejectWithValue(error.message || "Error al cargar las webs");
    }
  }
);

// Thunk para cargar una web específica
export const loadWebsiteById = createAsyncThunk(
  "websites/loadById", 
  async (id, { rejectWithValue }) => {
    try {
      logWebsiteAction('Cargando web por ID', id);
      const website = await fetchWebsiteById(id);
      return normalizeWebsite(website);
    } catch (error) {
      logWebsiteAction('Error al cargar web por ID', error);
      return rejectWithValue(error.message || "Error al cargar los detalles de la web");
    }
  }
);

// Thunk para crear una nueva web
export const addWebsite = createAsyncThunk(
  "websites/add", 
  async (websiteData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      // Si no hay user_id en los datos de la web, usar el del usuario actual
      if (!websiteData.user_id && auth.user) {
        websiteData.user_id = getUserId(auth.user);
        logWebsiteAction('Asignando user_id a nueva web', websiteData.user_id);
      }
      
      // Validación final antes de enviar
      if (!websiteData.user_id) {
        logWebsiteAction('Error: No hay user_id para nueva web', websiteData);
        return rejectWithValue("No se ha podido asociar un usuario al sitio web");
      }
      
      const website = await createWebsite(websiteData);
      return normalizeWebsite(website);
    } catch (error) {
      logWebsiteAction('Error al crear web', error);
      return rejectWithValue(error.message || "Error al crear el sitio web");
    }
  }
);

// Thunk para actualizar una web existente
export const editWebsite = createAsyncThunk(
  "websites/edit", 
  async ({ id, data }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      
      // Si no hay user_id en los datos de la web, usar el del usuario actual
      if (!data.user_id && auth.user) {
        data.user_id = getUserId(auth.user);
        logWebsiteAction('Asignando user_id a web actualizada', data.user_id);
      }
      
      const website = await updateWebsite(id, data);
      return normalizeWebsite(website);
    } catch (error) {
      logWebsiteAction('Error al actualizar web', error);
      return rejectWithValue(error.message || "Error al actualizar el sitio web");
    }
  }
);

// Thunk para eliminar una web
export const removeWebsite = createAsyncThunk(
  "websites/remove", 
  async (id, { rejectWithValue, getState }) => {
    try {
      // Verificar permisos según el rol
      const { auth, websites } = getState();
      
      if (!auth.isAuthenticated || !auth.user) {
        return rejectWithValue("Usuario no autenticado");
      }
      
      const { role } = auth.user;
      const userId = getUserId(auth.user);
      const isAdmin = role === "admin";
      
      // Si no es admin, verificar que la web pertenezca al usuario
      if (!isAdmin) {
        const website = websites.websites.find(w => w.id === id);
        if (website && website.user_id !== userId) {
          return rejectWithValue("No tienes permiso para eliminar esta web");
        }
      }
      
      logWebsiteAction('Eliminando web', id);
      const result = await deleteWebsite(id);
      
      if (result === true) {
        return id;
      } else {
        return rejectWithValue("Error al eliminar el sitio web");
      }
    } catch (error) {
      logWebsiteAction('Error al eliminar web', error);
      return rejectWithValue(error.message || "Error al eliminar el sitio web");
    }
  }
);

// Función auxiliar para recuperar la web seleccionada del localStorage
const getStoredSelectedWebsite = () => {
  try {
    const storedWebsite = localStorage.getItem('selectedWebsite');
    const website = storedWebsite ? JSON.parse(storedWebsite) : null;
    return website ? normalizeWebsite(website) : null;
  } catch (error) {
    logWebsiteAction('Error al recuperar web seleccionada', error);
    return null;
  }
};

// Estado inicial
const initialState = {
  websites: [],
  selectedWebsite: getStoredSelectedWebsite(),
  loading: false,
  error: null,
  isFormVisible: false,
  editingWebsite: null
};

const websiteSlice = createSlice({
  name: "websites",
  initialState,
  reducers: {
    // Seleccionar una web con validación de acceso
    selectWebsite: (state, action) => {
      // Normalizar la web seleccionada
      state.selectedWebsite = normalizeWebsite(action.payload);
      
      // Almacenar en localStorage para persistencia
      try {
        localStorage.setItem('selectedWebsite', JSON.stringify(state.selectedWebsite));
        logWebsiteAction('Web seleccionada guardada en localStorage', state.selectedWebsite?.id);
      } catch (error) {
        logWebsiteAction('Error al guardar web seleccionada', error);
      }
    },
    
    // Deseleccionar la web
    clearSelectedWebsite: (state) => {
      state.selectedWebsite = null;
      
      // Eliminar de localStorage
      try {
        localStorage.removeItem('selectedWebsite');
        logWebsiteAction('Web seleccionada eliminada de localStorage');
      } catch (error) {
        logWebsiteAction('Error al eliminar web seleccionada', error);
      }
    },
    
    // Mostrar formulario para crear web
    showCreateForm: (state) => {
      state.isFormVisible = true;
      state.editingWebsite = null;
    },
    
    // Mostrar formulario para editar web
    showEditForm: (state, action) => {
      state.isFormVisible = true;
      state.editingWebsite = normalizeWebsite(action.payload);
    },
    
    // Ocultar formulario
    hideForm: (state) => {
      state.isFormVisible = false;
      state.editingWebsite = null;
    },

    // Validar selección de web según el rol del usuario
    validateWebsiteSelection: (state, action) => {
      const { user } = action.payload;
      
      if (!user || !state.selectedWebsite) return;
      
      const userId = getUserId(user);
      const isAdmin = user.role === "admin";
      
      logWebsiteAction('Validando selección de web', { 
        userId, 
        isAdmin, 
        websiteId: state.selectedWebsite.id,
        websiteUserId: state.selectedWebsite.user_id
      });
      
      // Si la web no tiene propietario, solo admin puede acceder
      if (state.selectedWebsite.user_id === null) {
        if (!isAdmin) {
          logWebsiteAction('Deseleccionando web (sin propietario, usuario no es admin)');
          state.selectedWebsite = null;
          try {
            localStorage.removeItem('selectedWebsite');
          } catch (error) {
            logWebsiteAction('Error al eliminar web seleccionada', error);
          }
          return;
        }
      }
      
      const isOwner = state.selectedWebsite.user_id === userId;
      
      // Si no es admin y no es propietario, deseleccionar la web
      if (!isAdmin && !isOwner) {
        logWebsiteAction('Deseleccionando web (usuario no es propietario ni admin)');
        state.selectedWebsite = null;
        try {
          localStorage.removeItem('selectedWebsite');
        } catch (error) {
          logWebsiteAction('Error al eliminar web seleccionada', error);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Cargar webs
      .addCase(loadWebsites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadWebsites.fulfilled, (state, action) => {
        state.websites = action.payload;
        state.loading = false;
        
        // Verificar si la web seleccionada está en las webs cargadas
        if (state.selectedWebsite) {
          const webExists = state.websites.some(web => web.id === state.selectedWebsite.id);
          
          if (!webExists) {
            logWebsiteAction('Deseleccionando web (no existe en las webs cargadas)');
            state.selectedWebsite = null;
            try {
              localStorage.removeItem('selectedWebsite');
            } catch (error) {
              logWebsiteAction('Error al eliminar web seleccionada', error);
            }
          }
        }
      })
      .addCase(loadWebsites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
        // Notificar al usuario del error
        Swal.fire({
          icon: "error",
          title: "Error al cargar las webs",
          text: action.payload,
          confirmButtonColor: "#3085d6"
        });
      })
      
      // Cargar web por ID
      .addCase(loadWebsiteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadWebsiteById.fulfilled, (state, action) => {
        // Actualizar la web en la lista si ya existe
        const index = state.websites.findIndex(web => web.id === action.payload.id);
        if (index !== -1) {
          state.websites[index] = action.payload;
        } else {
          state.websites.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(loadWebsiteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Crear web
      .addCase(addWebsite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWebsite.fulfilled, (state, action) => {
        // Verificar si hay error
        if (!action.payload || (action.payload.id === null && action.payload.error)) {
          state.error = action.payload?.error || "Error desconocido al crear el sitio web";
          state.loading = false;
          
          // Notificar al usuario del error
          Swal.fire({
            icon: "error",
            title: "Error al crear el sitio web",
            text: state.error,
            confirmButtonColor: "#3085d6"
          });
          return;
        }
        
        state.websites.push(action.payload);
        state.loading = false;
        state.isFormVisible = false;
        
        // Notificar al usuario del éxito
        Swal.fire({
          icon: "success",
          title: "Sitio web creado",
          text: "El sitio web se ha creado correctamente",
          confirmButtonColor: "#3085d6"
        });
      })
      .addCase(addWebsite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
        // Notificar al usuario del error
        Swal.fire({
          icon: "error",
          title: "Error al crear el sitio web",
          text: action.payload,
          confirmButtonColor: "#3085d6"
        });
      })
      
      // Actualizar web
      .addCase(editWebsite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editWebsite.fulfilled, (state, action) => {
        // Verificar si hay error
        if (!action.payload || action.payload.error) {
          state.error = action.payload?.error || "Error desconocido al actualizar el sitio web";
          state.loading = false;
          
          // Notificar al usuario del error
          Swal.fire({
            icon: "error",
            title: "Error al actualizar el sitio web",
            text: state.error,
            confirmButtonColor: "#3085d6"
          });
          return;
        }

        const index = state.websites.findIndex(web => web.id === action.payload.id);
        if (index !== -1) {
          state.websites[index] = action.payload;
        }
        state.loading = false;
        state.isFormVisible = false;
        state.editingWebsite = null;
        
        // Actualizar la web seleccionada si es la misma que se actualizó
        if (state.selectedWebsite && state.selectedWebsite.id === action.payload.id) {
          state.selectedWebsite = action.payload;
          try {
            localStorage.setItem('selectedWebsite', JSON.stringify(action.payload));
          } catch (error) {
            logWebsiteAction('Error al guardar web seleccionada', error);
          }
        }
        
        // Notificar al usuario del éxito
        Swal.fire({
          icon: "success",
          title: "Sitio web actualizado",
          text: "El sitio web se ha actualizado correctamente",
          confirmButtonColor: "#3085d6"
        });
      })
      .addCase(editWebsite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
        // Notificar al usuario del error
        Swal.fire({
          icon: "error",
          title: "Error al actualizar el sitio web",
          text: action.payload,
          confirmButtonColor: "#3085d6"
        });
      })
      
      // Eliminar web
      .addCase(removeWebsite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeWebsite.fulfilled, (state, action) => {
        // Si action.payload es false, hubo un error en la API pero recuperado
        if (action.payload === false) {
          state.loading = false;
          
          // Notificar al usuario del error
          Swal.fire({
            icon: "error",
            title: "Error al eliminar el sitio web",
            text: "No se pudo conectar con el servidor. Inténtelo más tarde.",
            confirmButtonColor: "#3085d6"
          });
          return;
        }
        
        state.websites = state.websites.filter(web => web.id !== action.payload);
        state.loading = false;
        
        // Si la web eliminada era la seleccionada, la desseleccionamos
        if (state.selectedWebsite && state.selectedWebsite.id === action.payload) {
          state.selectedWebsite = null;
          try {
            localStorage.removeItem('selectedWebsite');
          } catch (error) {
            logWebsiteAction('Error al eliminar web seleccionada', error);
          }
        }
        
        // Notificar al usuario del éxito
        Swal.fire({
          icon: "success",
          title: "Sitio web eliminado",
          text: "El sitio web se ha eliminado correctamente",
          confirmButtonColor: "#3085d6"
        });
      })
      .addCase(removeWebsite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        
        // Notificar al usuario del error
        Swal.fire({
          icon: "error",
          title: "Error al eliminar el sitio web",
          text: action.payload,
          confirmButtonColor: "#3085d6"
        });
      });
  }
});

export const { 
  selectWebsite, 
  clearSelectedWebsite, 
  showCreateForm, 
  showEditForm, 
  hideForm,
  validateWebsiteSelection
} = websiteSlice.actions;

export default websiteSlice.reducer;
